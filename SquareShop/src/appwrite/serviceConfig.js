import { Client, Databases, ID, Permission, Query, Role, Storage } from "appwrite";
import conf from '../conf/config.js';

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteEndpoint)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }


    // products APis:


// 📄 Get a Single Product
async getProduct(slug) {
  try {
    return await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteProductCollectionId,
      slug
    );
  } catch (error) {
    console.error("getProduct error:", error);
    throw error;
  }
}

// 📚 List Products
async getProducts(queries = [Query.equal("status", "active")]) {
  try {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteProductCollectionId,
      queries
    );
  } catch (error) {
    console.error("getProducts error:", error);
    throw error;
  }
}

    // =======  USER And Cart ======= //
    async getUserCart(userId) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        [Query.equal('userId', userId)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0];
      }
      
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        ID.unique(),
        {
          userId,
          items: JSON.stringify([]),
          createdAt: new Date().toISOString()
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
    } catch (error) {
      console.error("Get user cart error:", error);
      throw error;
    }
  }

  async updateUserCart(cartId, items) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCartCollectionId,
        cartId,
        {
          items: JSON.stringify(items),
          updatedAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error("Update cart error:", error);
      throw error;
    }
  }

    async deleteUserCart(cartId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCartCollectionId,
                cartId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteUserCart :: error", error);
            throw error;
        }
    }
    // =============================

    async createPost({title, slug, contents, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                slug,
                {
                    title,
                    contents,
                    featuredImage,
                    status,
                    userId,
                    documentId: slug,
                },
                
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),

                // 👇 OR, if posts should be public
                Permission.read(Role.any()) 
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, contents, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                slug,
                {
                    title,
                    contents,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionIdectionIdectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                slug,
                
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    //Test Areana
    async  getAllUsers(queries = [Query.equal("status", "verified")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getAllUsers :: error", error);
            return false;
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any())  // 👈 This line makes the file publicly accessible
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        if (!fileId) return null;
        return this.bucket.getFileView(conf.appwriteBucketId, fileId).toString();
    }
}


const service = new Service()
export default service