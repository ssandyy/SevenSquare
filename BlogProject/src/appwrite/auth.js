import { Account, Client, Databases, ID, Query } from "appwrite";
import config, { default as conf } from '../conf/config.js';


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


    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
           console.log("Appwrite service:: logout :: error", error);
        }
    }

    async deactivateUser(authUserId) {
    try {

        const res = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [Query.equal("userId", authUserId)]
            );

            if (!res.documents.length) {
            throw new Error("User document not found");
            }

            const documentId = res.documents[0].$id;

        // 1. Mark user as inactive in database
         await this.databases.updateDocument(
            config.appwriteDatabaseId,
            config.appwriteCollectionId,
            documentId,
            { status: `{"inactive" || "deleted" || "unverified"}` }
            );

        // 2. Logout the user
        await this.logout();

        // 3. Optionally redirect
        window.location.href = '/';
        return true;
    } catch (error) {
        console.error('Failed to deactivate user:', error);
        return false;
    }
}

    async login({ email, password }) {
        try {
            if (!this.account) this.account = new Account(this.client);
            const session = await this.account.createEmailPasswordSession(email, password); // <-- FIXED
                await this.account.getSession(session.$id);
             return session;
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
            throw error;
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
        return {
            id: user.$id,
            name: user.name,
            email: user.email
        };
    } catch (error) {
        if (error.code === 401 || error.message.includes("missing scope")) {
            console.warn("User is not logged in.");
            return null;
        }
        console.error("AppwriteService :: getCurrentUser :: error:", error);
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

    async updateUserPassword (newPassword, confirmPassword, currentPassword = null) {
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
        console.error("something went wrong..!: ",emptyPassError)
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
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService