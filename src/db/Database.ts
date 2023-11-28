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
type DatabaseResponse = { affectedRows: number, insertId: bigint, warningStatus: number };

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
}

export default Database;