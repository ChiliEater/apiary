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
            let query: string = req.query["id"] as string ?? "";
            let id = parseCategory(parseInt(query));
            if (id) {
                this.db.getProductsInCategory(id).then(results => {
                    res.send(results);
                });
            } else {
                res.status(404).send("Invalid category");
            }
        });
    }
}

export default Products;