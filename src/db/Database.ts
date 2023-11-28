import mariadb, { Pool, PoolConnection } from 'mariadb';
import DummyData from './DummyData';

type CategorySchema = { id: number, name: string, image: string };

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
}

export default Database;