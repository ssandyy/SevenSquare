import { Client, Databases, ID, Query, Storage } from 'appwrite';
import config from '../conf/config';


export class ServiceConfig {
    client = new Client();
    databases;
    buckets;

    constructor(){
        this.client
            .setEndpoint(config.appwriteEndpoint)
            .setProject(config.appwriteProjectId);
        
        // this.databases = this.client.database;
        // this.buckets = this.client.storage;
        this.databases = new Databases(this.client)
        this.buckets = new Storage(this.client);
        
    }

    //create post/service
    async createBlog({userId, title, contents, status, featuredImage, slug}){
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    userId,
                    title,
                    contents,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            throw new Error("Something went wrong while creating the blog post..!"+ error);
        }
    }

    //update post/service
    // await databases.updateDocument('<DATABASE_ID>', <COLLECTION_ID>', <DOCUMENT_ID>')
 
    async updateBlog(slug, {title, contents, status, featuredImage}) { // here we have taken slug seperatly to extract document-id
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug, // document id
                {
                    title,
                    contents,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            throw new Error("Something went wrong while updating the blog post..!"+ error);
            
        }
    }


    //to delete post
    //appwite.deleteDocument('<DATABASE_ID>', <COLLECTION_ID>, <DOCUMENT_ID>)
    async deleteBlog(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug // document id

            )
            return true;
        } catch (error) {
            throw new Error("Something went wrong while deleting the blog post..!"+ error);
        }
    }

    async getBlog(slug){
        try {
            await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        } catch (error) {
            throw new Error("Something went wrong while fetching the blog post..!"+ error);
        }
    }
    
    async getBlogList(condition = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                condition
                // or
                // [Query.equal("status", "active")]
            )
        } catch (error) {
            throw new Error("Something went wrong while fetching the blog post..!"+ error);
        }
    }

//------------------------------ File Services  ----------------------------------
    // file/image upoad
    async fileUpload(file){
        try {
            return await this.buckets.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            throw new Error("Something went wrong while uploading the file..!", error)
        }
    }

    //delete file/image
    async deleteuploadedFile(fileid){
        try {
            return await this.buckets.deleteFile(
                config.appwriteBucketId,
                fileid
            )
        } catch (error) {
            throw new Error("something went wron on file deleting..!", error);
            
        }
    }


}

const serviceConfig = new ServiceConfig();

export default serviceConfig;