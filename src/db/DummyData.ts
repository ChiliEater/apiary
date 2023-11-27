import mariadb, { Pool, PoolConnection } from 'mariadb';
import Random from '../random/Random';
import Category from './Products';

type CategoryArray = [name: string, path: string];
type ProductArray = [
    category: number,
    name: string, 
    price: number, 
    location: string, 
    contact: string, 
    images: string
];


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

    private constructor() {}

    public static async setupData(pool: Pool) {
        let connection: PoolConnection | undefined;
        try {
            connection = await pool.getConnection();

            let res = await DummyData.dummyCategories(connection);
            
            let productTable = 'products';
            res = await connection.query(`
                CREATE OR REPLACE TABLE ${productTable} (
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
            console.log(res); 
            console.log(Category.Burger);
            let burgers = this.generateProductsInCategory(
                Random.shuffleArray(this.prefixes.slice()),
                "Burger",
                Category.Burger,
                [
                    "img/products/burger/burger1.jpg",
                    "img/products/burger/burger2.jpg",
                    "img/products/burger/burger3.jpg",
                    "img/products/burger/burger4.jpg",
                    "img/products/burger/burger5.jpg",
                ]
            ); 
            console.log("test");
            console.log(burgers);
    

        } catch (err) {
            throw err;
        } finally {
            if (connection) return connection.end();
        }
    }

    private static async dummyCategories(connection: mariadb.PoolConnection) {
        let categoriesTable = 'categories';
        let res = await connection.query(`
                CREATE OR REPLACE TABLE ${categoriesTable} (
                    id INT NOT NULL AUTO_INCREMENT, 
                    name VARCHAR(30) NOT NULL, 
                    image VARCHAR(50) NOT NULL,
                    PRIMARY KEY (id)
                );
            `);
        res = await DummyData.addCategory(connection, categoriesTable, ["Burger", "img/categories/burger.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Chinese", "img/categories/chinese.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Donuts", "img/categories/donuts.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Fish", "img/categories/fish.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Italian", "img/categories/italian.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Japanese", "img/categories/japanese.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Mexican", "img/categories/mexican.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Pizza", "img/categories/pizza.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Sandwich", "img/categories/sandwich.jpg"]);
        res = await DummyData.addCategory(connection, categoriesTable, ["Vietnamese", "img/categories/vietnamese.jpg"]);

        return res;
    }

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

    private static addCategory(connection: PoolConnection, table: string, category: CategoryArray) {
        return connection.query(`
            INSERT INTO ${table} (name, image) value (?,?);
        `,
        category);
    }

    private static addProduct(connection: PoolConnection, table: string, product: ProductArray) {
        return connection.query(`
            INSERT INTO ${table} (category, name, price, location, contact, images) value (?,?,?,?,?,?);
        `,
        product);
    }

}

export default DummyData;