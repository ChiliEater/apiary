import { Express, Request, Response } from 'express';
import Database from "../db/Database";
import Category, { parseCategory } from '../db/Category';

class Products {
    private static productPath: RegExp = /\/products\/\d+/;
    private static productQuery: RegExp = /\/products/;
    private db: Database;
    constructor(db: Database) {
        this.db = db;
    }

    public listProduct(server: Express) {
        server.get(Products.productPath, (req: Request, res: Response) => {
            let query = req.url.split("/");
            let id = parseInt(query[query.length - 1]);
            if (id) {
                this.db.getProduct(id).then(product => {
                    if (product.length > 0) {
                        res.send(product[0])
                    } else {
                        res.status(404).send("Product not found");
                    }
                });
            } else {
                res.status(400).send("Product ID is not a number")
            }
        });
    }

    public listProductsInCategory(server: Express) {
        server.get(Products.productQuery, (req: Request, res: Response) => {
            let keywords: string | undefined = req.query["name"] as string | undefined;
            let categoryString: string = req.query["category"] as string ?? "";
            let category = parseCategory(parseInt(categoryString));
            if (category && !keywords) {
                this.db.getProductsInCategory(category).then(results => {
                    res.send(results);
                });
            } else {
                this.db.searchByNameCategory(keywords, category).then(results => {
                    res.send(results);
                });
            }
        });
    }
}

export default Products;