import mariadb, { Pool, PoolConnection, UpsertResult } from 'mariadb';
import Random from '../random/Random';
import Category from './Category';
import Logger from '../logger/Logger';
import Database from './Database';

type CategoryArray = [name: string, path: string];
type ProductArray = [
    category: number,
    name: string,
    price: number,
    location: string,
    contact: string,
    images: string
];

/**
 * Collection of static functions to fill a MariaDB instance with testing data.
 */
class DummyData {
    private static streets = [
        "Noxapater, Mississippi, 39346",
        "Colcord, Oklahoma, 74338",
        "Avondale, Arizona, 85323",
        "Ripon, California, 95366",
        "Sycamore, Georgia, 31790",
        "Astoria, New York, 11105",
        "Lakewood, Washington, 98498",
        "Bessemer, Alabama, 35020",
        "Dana Point, California, 92629",
        "Sunbury, Pennsylvania, 17801",
        "Bucyrus, Kansas, 66013",
        "Attica, Indiana, 47918",
        "Flushing, Ohio, 43977",
        "Sausalito, California, 94965",
        "Costa Mesa, California, 92626",
        "Imlay City, Michigan, 48444",
        "Russellville, Alabama, 35653",
        "Lancaster, Pennsylvania, 17602",
        "Trinity Center, California, 96091",
        "Cave Creek, Arizona, 85331",
        "Gray, Kentucky, 40734",
        "Aberdeen, South Dakota, 57401",
        "Hohenwald, Tennessee, 38462",
        "Okarche, Oklahoma, 73762",
        "Burnsville, Minnesota, 55337",
        "Tishomingo, Mississippi, 38873",
        "Corbin, Kentucky, 40701",
        "Carrington, North Dakota, 58421",
        "Prescott, Arizona, 86305",
        "Inglewood, California, 90303",
    ]

    private static prefixes = [
        "Super",
        "Mega",
        "Amazing",
        "Ultra",
        "Omega",
        "Extreme",
        "Awesome",
        "Magnificient",
        "Alpha",
        "Crazy",
        "Insane",
        "Godly",
        "Viking",
        "Cracked",
        "Great",
        "Unexpected",
        "Terrific",
        "Classy",
        "Fancy",
        "Goergeous",
    ]

    private constructor() { }

    /**
     * Setup the dummy data.
     * @param pool The MariaDB pool
     * @returns Result of the disconnect
     */
    public static async setupData(pool: Pool): Promise<void> {
        let connection: PoolConnection | undefined;
        try {
            connection = await pool.getConnection();

            let res;
            res = await this.dummyCategories(connection);
            res = await this.dummyProducts(connection);
            res = await this.dummyUsers(connection);
            res = await this.dummyCarts(connection);
        } catch (err) {
            throw err;
        } finally {
            if (connection) return connection.end();
        }
    }

    /**
     * Creates the categories table
     * @param connection DB connection
     * @returns Result of the last operation
     */
    private static async dummyCategories(connection: PoolConnection): Promise<any> {
        let categoriesTable = 'categories';
        let res = await connection.query(`
                CREATE OR REPLACE TABLE ${categoriesTable} (
                    id INT NOT NULL AUTO_INCREMENT, 
                    name VARCHAR(30) NOT NULL, 
                    image VARCHAR(50) NOT NULL,
                    PRIMARY KEY (id)
                );
            `);
        res = await DummyData.addCategory(connection, categoriesTable, [
            ["burgerCategory", "img/categories/burger.jpg"],
            ["chineseCategory", "img/categories/chinese.jpg"],
            ["donutsCategory", "img/categories/donuts.jpg"],
            ["fishCategory", "img/categories/fish.jpg"],
            ["italianCategory", "img/categories/italian.jpg"],
            ["japaneseCategory", "img/categories/japanese.jpg"],
            ["mexicanCategory", "img/categories/mexican.jpg"],
            ["pizzaCategory", "img/categories/pizza.jpg"],
            ["sandwichCategory", "img/categories/sandwich.jpg"],
            ["vietnameseCategory", "img/categories/vietnamese.jpg"],
        ]);
        return res;
    }

    /**
     * Creates the products table
     * @param connection DB connection
     * @returns Result of last operation
     */
    private static async dummyProducts(connection: PoolConnection): Promise<any> {
        let res = await connection.query(`
            CREATE OR REPLACE TABLE ${Database.productTable} (
                id INT NOT NULL AUTO_INCREMENT, 
                category INT NOT NULL,
                name VARCHAR(50) NOT NULL,
                price INT NOT NULL,
                location VARCHAR(50) NOT NULL,
                contact VARCHAR(50) NOT NULL,
                images TEXT NOT NULL,
                PRIMARY KEY (id)
            );
        `);
        let products: ProductArray[] = [];
        let productMap: Map<Category, string> = new Map([
            [Category.Burger, "burger"],
            [Category.Chinese, "chinese"],
            [Category.Donuts, "donuts"],
            [Category.Fish, "fish"],
            [Category.Italian, "pasta"],
            [Category.Japanese, "ramen"],
            [Category.Mexican, "tacos"],
            [Category.Pizza, "pizza"],
            [Category.Sandwich, "sub"],
            [Category.Vietnamese, "vietnamese"],
        ]);

        productMap.forEach((name: string, category: Category) => products = products.concat(this.generateProductsInCategory(
            Random.shuffleArray(this.prefixes.slice()),
            name[0].toUpperCase() + name.slice(1),
            category,
            new Array(5).fill("").map((_, i) => `img/products/${name}/${name}${i+1}.jpg`)
        )));

        res = await this.addProduct(connection, Database.productTable, products)
        //res = await connection.query(`SELECT * FROM ${Database.productTable} WHERE category LIKE 2`);
        //console.log(res);
        return res;
    }

    /**
     * Creates the users table
     * @param connection DB connection
     * @returns Result of the last operation
     */
    private static async dummyUsers(connection: PoolConnection): Promise<any> {
        let res = await connection.query(`
            CREATE OR REPLACE TABLE ${Database.userTable} (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL,
                PRIMARY KEY (id)
            );
        `);
        res = await connection.query(`
        INSERT INTO ${Database.userTable} (name) VALUES (?);
        `, ["John Smith"]);
        //res = await connection.query(`SELECT * FROM ${userTable};`);
        //console.log(res);
        return res;
    }


    /**
     * Creates the carts table
     * @param connection DB connection
     * @returns Result of the insert operation
     */
    private static async dummyCarts(connection: PoolConnection) {
        let res = await connection.query(`
            CREATE OR REPLACE TABLE ${Database.cartTable} (
                id INT NOT NULL AUTO_INCREMENT,
                productId INT NOT NULL,
                userId INT NOT NULL,
                PRIMARY KEY (id)
            );
        `);
        res = await connection.query(`INSERT INTO ${Database.cartTable} (productId, userId) VALUES (?,?)`, [1, 1]);
        //res = await connection.query(`SELECT * FROM ${cartTable}`);
        //console.log(res);
        return res;
    }

    /**
     * Generates a list of the input product with unique names and shuffled images.
     * @param prefixes List of name prefixes
     * @param name Name of the product
     * @param category Which category the product belongs to
     * @param images Which images should be added to the products
     * @returns A list of products
     */
    private static generateProductsInCategory(prefixes: string[], name: string, category: Category, images: string[]): ProductArray[] {
        return prefixes.map(prefix => [
            category as number,
            `${prefix} ${name}`,
            Random.int(25, 350),
            this.streets[Random.int(0, this.streets.length - 1)],
            Random.int(1000000000, 9999999999).toString(),
            Random.shuffleArray(images.slice()).join(','),
        ]
        );
    }

    /**
     * Adds a list of categories to the DB
     * @param connection DB connection
     * @param table Where to insert
     * @param category The list of categories
     * @returns Summary of the operation
     */
    private static addCategory(connection: PoolConnection, table: string, category: CategoryArray[]): Promise<UpsertResult> {
        return connection.batch(`
            INSERT INTO ${table} (name, image) value (?,?);
        `,
            category);
    }

    /**
     * Adds a list of products to the DB
     * @param connection DB connection
     * @param table where to insert
     * @param product The list of products
     * @returns Summary of the operation
     */
    private static addProduct(connection: PoolConnection, table: string, product: ProductArray[]): Promise<UpsertResult> {
        return connection.batch(`
            INSERT INTO ${table} (category, name, price, location, contact, images) value (?,?,?,?,?,?);
        `,
            product);
    }

}

export default DummyData;