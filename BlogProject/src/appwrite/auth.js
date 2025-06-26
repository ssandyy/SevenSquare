import { Account, Client, ID } from "appwrite";
import config from "../conf/config";


export class AuthService {
    client = new Client();
    account;
    
    constructor() { 
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    //to create new user/signup
    async createAccount({name, email, password}) {
        try {
            const userAccount = await this.account.create(ID.unique(), name,
                                    email,password);
                    if(userAccount){
                        // logged in method / homepage
                        return this.loginAccount({email, password})
                    }else{
                        //user Account page login /Signup
                        return userAccount;
                    }
            
        } catch (Error) {
            throw new Error("Something went wrong..!");
        }
    }

    async loginAccount({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (err) {
            throw new err("Something went wrong..!");
        }
    }

    async getCurrentAccount() {
        try {
            return await this.account.get()
        } catch (Error) {
            throw new Error("Something went wrong while fetching account details..!");
        }
    }

    async logoutAccount() {
        try {
            // return await this.account.deleteSession("current");
            // return await this.account.deleteSession('all');
            return await this.account.deleteSession();
        } catch (error) {
            console.log("Something went wrong while logging out..!"+ error);
            
        }
    }
}

const authService = new AuthService();

export default authService;