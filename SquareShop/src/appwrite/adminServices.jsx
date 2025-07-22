import { Client, Databases, ID, Permission, Query, Role } from "appwrite";
import conf from '../conf/config';

class AdminServices {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteEndpoint)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Product Management
    async createProduct(productData) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                ID.unique(),
                {
                    name: productData.name,
                    description: productData.description,
                    price: parseFloat(productData.price),
                    image: productData.image,
                    inStock: parseInt(productData.inStock),
                    fastDelivery: Boolean(productData.fastDelivery),
                    isNew: Boolean(productData.isNew),
                    ratings: parseInt(productData.ratings) || 1,
                    category: productData.category || 'uncategorized',
                    status: 'active',
                    tags: productData.tags ? JSON.stringify(productData.tags) : '[]'
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.team('admin')),
                    Permission.delete(Role.team('admin'))
                ]
            );
        } catch (error) {
            console.error("Appwrite :: createProduct :: error", error);
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                productId,
                productData
            );
        } catch (error) {
            console.error("Appwrite :: updateProduct :: error", error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                productId
            );
        } catch (error) {
            console.error("Appwrite :: deleteProduct :: error", error);
            throw error;
        }
    }

    async listProducts(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProductsCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite :: listProducts :: error", error);
            throw error;
        }
    }

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
    
}

const adminService = new AdminServices();
export default adminService;