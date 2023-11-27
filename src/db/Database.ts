import mariadb, { Pool, PoolConnection } from 'mariadb';

type CategoryArray = [id: number, name: string, path: string];

class Database {
    private pool: Pool;
    constructor() {
        this.pool = mariadb.createPool({
            host: 'localhost',
            port: 7778,
            user: 'node',
            password: 'DrqY8s9jHiUNuctk',
            database: 'node',
        });
        Database.setupData(this.pool);
    }

    private static async setupData(pool: Pool) {
        let connection: PoolConnection | undefined;
        try {
            connection = await pool.getConnection();
            let categoriesTable = 'categories';
            let res = await connection.query(`
                CREATE OR REPLACE TABLE ${categoriesTable} (id INT PRIMARY KEY, name VARCHAR(30), image VARCHAR(50))
            `);
            console.log(res);
            res = await Database.addCategory(connection, categoriesTable, [0, "Burger", "img/categories/burger.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [1, "Chinese", "img/categories/chinese.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [2, "Donuts", "img/categories/donuts.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [3, "Fish", "img/categories/fish.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [4, "Italian", "img/categories/italian.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [5, "Japanese", "img/categories/japanese.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [6, "Mexican", "img/categories/mexican.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [7, "Pizza", "img/categories/pizza.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [8, "Sandwich", "img/categories/sandwich.jpg"]);
            res = await Database.addCategory(connection, categoriesTable, [9, "Vietnamese", "img/categories/vietnamese.jpg"]);
            let cats = await connection.query(`SELECT * FROM ${categoriesTable}`);
            console.log(cats);
        } catch (err) {
            throw err;
        } finally {
            if (connection) return connection.end();
        }
    }

    private static addCategory(connection: PoolConnection, table: string, category: CategoryArray) {
        return connection.query(`
            INSERT INTO ${table} value (?,?,?)
        `,
        category);
    }
}

export default Database;