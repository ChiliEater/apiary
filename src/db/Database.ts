import mariadb, { Pool, PoolConnection } from 'mariadb';
import DummyData from './DummyData';
import Category from './Category';

type CategorySchema = { id: number, name: string, image: string };
type ProductSchema = {
    id: number,
    category: number,
    name: string,
    price: number,
    location: string,
    contact: string,
    images: string,
};
type CartSchema = { id: number, productId: number, userId: number };
type UserSchema = { id: number, name: string };
type DatabaseResponse = { affectedRows: number, insertId: bigint, warningStatus: number };

/**
 * Holds abstractions for database access
 */
class Database {
    public static categoriesTable = "categories";
    public static productTable = "products";
    public static userTable = "users";
    public static cartTable = "carts";
    private pool: Pool;

    constructor() {
        this.pool = mariadb.createPool({
            host: 'localhost',
            port: 7778,
            user: 'node',
            password: 'DrqY8s9jHiUNuctk',
            database: 'node',
            connectionLimit: 1
        });
        DummyData.setupData(this.pool).then(() => { });
    }

    /**
     * Get a list of all available categories
     * @returns Result
     */
    public async getCategories(): Promise<CategorySchema[]> {
        let connection: PoolConnection | undefined;
        let res: Promise<CategorySchema[]>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`SELECT * FROM ${Database.categoriesTable};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * List all products in a certain category
     * @param category Category to search in
     * @returns Result
     */
    public async getProduct(id: number): Promise<ProductSchema[]> {
        let connection: PoolConnection | undefined;
        let res: Promise<ProductSchema[]>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`SELECT * FROM ${Database.productTable} WHERE id LIKE ${id};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * List all products in a certain category
     * @param category Category to search in
     * @returns Result
     */
    public async getProductsInCategory(category: Category): Promise<ProductSchema[]> {
        let connection: PoolConnection | undefined;
        let res: Promise<ProductSchema[]>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`SELECT * FROM ${Database.productTable} WHERE category LIKE ${category};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * Add a product to a user's cart
     * @param product Product to add
     * @param user Which user to perform this operation for
     * @returns Summary of the operation
     */
    public async addToCart(product: number, user: number): Promise<DatabaseResponse> {
        let connection: PoolConnection | undefined;
        let res: Promise<DatabaseResponse>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`INSERT INTO ${Database.cartTable} (productId, userId) VALUES (?,?);`, [product, user]);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * Remove a cart entry
     * @param id Cart item to remove
     * @returns Summary of the operation
     */
    public async removeFromCart(id: bigint): Promise<DatabaseResponse> {
        let connection: PoolConnection | undefined;
        let res: Promise<DatabaseResponse>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`DELETE FROM ${Database.cartTable} WHERE id LIKE ${id};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * List the contents of a user's cart
     * @param user Whose cart
     * @returns The cart
     */
    public async getCart(user: number): Promise<CartSchema> {
        let connection: PoolConnection | undefined;
        let res: Promise<CartSchema>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`SELECT * FROM ${Database.cartTable} WHERE userId LIKE ${user};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }

    /**
     * List the contents of a user's cart
     * @param user Whose cart
     * @returns The cart
     */
    public async getUser(user: number): Promise<UserSchema[]> {
        let connection: PoolConnection | undefined;
        let res: Promise<UserSchema[]>;
        try {
            connection = await this.pool.getConnection();
            res = connection.query(`SELECT * FROM ${Database.userTable} WHERE id LIKE ${user};`);
        } catch (err) {
            throw err;
        } finally {
            if (connection) await connection.end();
        }
        return res;
    }


}

export default Database;