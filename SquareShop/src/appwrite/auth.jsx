import { Account, Client, Databases, ID, Permission, Query, Role } from "appwrite";
import { default as conf } from '../conf/config';


export class AuthService {
  client = new Client();
  account;
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId)

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  async getUserDocument(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                [Query.equal("userId", userId)]
            );
            return response.documents[0] || await this.createUserDocument(userId);
        } catch (error) {
            console.error("Get user document error:", error);
            throw error;
        }
    }

  async createUserDocument(userId) {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProductsCollectionId,
            ID.unique(),
            {
                userId,
                name: "User",
                email: "",
                status: "active",
                cart: "[]",
                createdAt: new Date().toISOString()
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        );
    }

  async createAccount({ email, password, name }) {
        try {
            // Clear previous sessions
            try {
                await this.account.deleteSessions();
            } catch (sessionError) {
                if (sessionError.code !== 401) throw sessionError;
            }

            // Create account and session
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            await this.account.createEmailPasswordSession(email, password);
            const user = await this.account.get();

            // Create user document with empty cart
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                ID.unique(),
                {
                    userId: user.$id,
                    name: user.name,
                    email: user.email,
                    status: "verified",
                    cart: "[]",
                    createdAt: new Date().toISOString()
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            );

            return userAccount;
        } catch (error) {
            console.error("Create account error:", error);
            throw error;
        }
    }


  async deactivateUser(documentId) {
    try {
      await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProductsCollectionIdectionIdectionId,
        documentId,
        { status: "unverified" }
      );

      await this.logout();
      return true;
    } catch (error) {
      console.error("Failed to deactivate user:", error);
      return false;
    }
  }

  async login({ email, password }) {
        try {
            // Cleanup sessions
            try {
                await this.account.deleteSessions();
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (cleanupError) {
                if (![401, 404].includes(cleanupError?.code)) throw cleanupError;
            }

            // Create session with retry
            let session, user;
            for (let attempts = 0; attempts < 3; attempts++) {
                try {
                    session = await this.account.createEmailPasswordSession(email, password);
                    user = await this.account.get();
                    break;
                } catch (error) {
                    if (error.code === 429) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
                        continue;
                    }
                    throw error;
                }
            }

            if (!user.emailVerification) {
                await this.account.deleteSession('current');
                throw new Error("Please verify your email before logging in.");
            }

            // Merge guest cart if exists
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            if (guestCart.length > 0) {
                const userDoc = await this.getUserDocument(user.$id);
                let userCart = userDoc.cart ? JSON.parse(userDoc.cart) : [];
                
                // Merge logic
                guestCart.forEach(guestItem => {
                    const existing = userCart.find(item => item.productId === guestItem.id);
                    if (existing) {
                        existing.quantity = Math.min(existing.quantity + guestItem.quantity, guestItem.inStock || 20);
                    } else {
                        userCart.push({
                            productId: guestItem.id,
                            quantity: guestItem.quantity
                        });
                    }
                });

                await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteProductsCollectionId,
                    userDoc.$id,
                    { cart: JSON.stringify(userCart) }
                );
                localStorage.removeItem('guestCart');
            }

            return { session, user };
        } catch (error) {
            let message = "Login failed. Please try again.";
            if (error.message.includes("verify your email")) message = error.message;
            else if (error.code === 429) message = "Too many attempts. Please wait.";
            else if (error.code === 401) message = "Invalid email or password";
            
            console.error("Login error:", error);
            throw new Error(message);
        }
    }

  async sendOTP(email) {
    try {
      const response = await this.account.createEmailToken(
        ID.unique(),
        email,
        true // Enable security phrase
      );
      return {
        userId: response.userId,
        phrase: response.phrase
      };
    } catch (error) {
      console.error('OTP send failed:', error);
      throw error;
    }
  }

  async verifyOTP(userId, otp) {
    try {
      return await this.account.createSession(userId, otp);
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  }


  async getCurrentUser() {
    try {
      const user = await this.account.get();

      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductsCollectionId,
        [Query.equal("userId", user.$id)]
      );

      const userDoc = res.documents[0];

      return {
        id: user.$id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerification,
        documentId: userDoc?.$id, // ✅ ADD THIS
      };
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  }


  async hasPassword() {
    try {
      await this.account.updatePassword('temporary', 'temporary');
      return true;
    } catch (error) {
      console.Error(`haspassword function error: `, error)
      return false; // No password exists
    }
  }

  async updateUserPassword(newPassword, confirmPassword, currentPassword = null) {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }


      if (await this.hasPassword() && !currentPassword) {
        throw new Error("Current password is required");
      }

      // For accounts WITH existing password
      if (currentPassword) {
        return await this.account.updatePassword(newPassword, currentPassword);
      }
      // For accounts WITHOUT existing password (OTP users)
      else {
        return await this.account.updatePassword(newPassword, newPassword);
      }
    } catch (error) {
      console.log("Unabe to update passsowrd ", error);

    }
  }


  // NEW: Update profile for OTP-logged-in users
  async updateProfile(name, email) {
    try {
      const promises = [];
      if (name) {
        promises.push(this.account.updateName(name));
      }
      if (email) {
        // For passwordless accounts, we can update email without current password
        promises.push(this.account.updateEmail(email, ''));
      }
      return await Promise.all(promises);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }


  //------ User Account ----
  updateName(name) {
    return this.account.updateName(name);
  }

  // Update email (requires current password for confirmation)
  updateEmail(email, password) {
    return this.account.updateEmail(email, password);
  }



  async setInitialPassword(newPassword, confirmPassword) {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }

      // Special handling for OTP-verified users
      // First try with empty current password
      try {
        return await this.account.updatePassword(newPassword, "");
      } catch (emptyPassError) {
        // If that fails, try using new password as both params
        console.error("something went wrong..!: ", emptyPassError)
        return await this.account.updatePassword(newPassword, newPassword);
      }
    } catch (error) {
      console.error('Password setup failed:', error);
      throw error;
    }
  }

  async changePassword(newPassword, currentPassword) {
    try {
      return await this.account.updatePassword(newPassword, currentPassword);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  async checkPasswordExists() {
    try {
      // Try a password-protected operation
      await this.account.getPrefs();
      return true;
    } catch (error) {
      if (error.code === 401 || error.message.includes('password')) {
        return false;
      }
      throw error;
    }
  }

  async verifySession() {
    try {
      // List sessions to check if any exists
      const sessions = await this.account.listSessions();
      return sessions.total > 0;
    } catch (error) {
      console.error("AppwriteService :: getCurrentUser :: error:", error);
      return false;
    }
  }


  async logout() {
    try {
      const sessions = await this.account.listSessions();
      if (sessions.total > 0) {
        await this.account.deleteSessions();
      }
    } catch (error) {
      if (error.code === 401) {
        console.warn("User already logged out or session missing.");
      } else {
        console.error("Appwrite service :: logout :: error", error);
      }
    }
  }

}

const authService = new AuthService();

export default authService