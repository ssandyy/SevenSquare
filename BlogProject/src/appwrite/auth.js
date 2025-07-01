import { Account, Client, Databases, ID, Query } from "appwrite";
import config, { default as conf } from '../conf/config.js';


export class AuthService {
    client = new Client();
    account;

    constructor() {
    this.client
        .setEndpoint(conf.appwriteEndpoint)
        .setProject(conf.appwriteProjectId);
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
        console.log("Login data:", email, password);  // Add this for debugging
        if (!this.account) this.account = new Account(this.client);
        return await this.account.createEmailPasswordSession(email, password); // <-- FIXED
    } catch (error) {
        console.log("Appwrite service :: login :: error", error);
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

//------ User Account ----
updateName(name) {
    return this.account.updateName(name);
}

// Update email (requires current password for confirmation)
updateEmail(email, password) {
    return this.account.updateEmail(email, password);
}

// Update password (requires old password)
updatePassword(newPassword, oldPassword) {
    return this.account.updatePassword(newPassword, oldPassword);
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