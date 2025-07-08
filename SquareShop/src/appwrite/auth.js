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


    async createAccount({ email, password, name }) {
  try {
    // 🔁 Clear previous sessions first
    try {
      const sessions = await this.account.listSessions();
      if (sessions.total > 0) {
        await this.account.deleteSessions();
      }
    } catch (sessionError) {
      if (sessionError.code !== 401) {
        console.error("Session cleanup before signup failed:", sessionError);
        throw sessionError;
      }
    }

    // 👤 Create new account
    const userAccount = await this.account.create(ID.unique(), email, password, name);

    // 🔐 Create new session for new account
    await this.account.createEmailPasswordSession(email, password);

    const user = await this.account.get();

    // 📝 Create user document
    await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      {
        userId: userAccount.$id,
        name: user.name,
        email: user.email,
        status: "verified",
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id))
      ]
    );

    return userAccount;
  } catch (error) {
    console.log("Appwrite service:: createAccount :: error", error);
    throw error;
  }
}


    async deactivateUser(documentId) {
    try {
      await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
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
        try {
          const sessions = await this.account.listSessions();
          if (sessions.total > 0) {
            await this.account.deleteSessions();
          }
        } catch (sessionError) {
          // Guest users will get 401 — this is fine, skip logout
          if (sessionError.code !== 401) {
            console.error("Session check failed", sessionError);
            throw sessionError; // Re-throw only unexpected errors
          }
        }

        const session = await this.account.createEmailPasswordSession(email, password);
        const user = await this.account.get();
        // console.log(user);

        if (!user.emailVerification) {
          // Optional: log out again to kill session
          await this.account.deleteSession("current");

          throw new Error("Email not verified. Please verify your email to continue.");
        }
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

      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
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