import { Express, Request, Response } from 'express';
import Database from "../db/Database";
import { it } from 'node:test';

type AddRequest = { productId: number, userId: number };

class Cart {
    private static cartPath: RegExp = /\/carts\/\d+/;
    private static cartQuery: RegExp = /\/carts/;
    private db: Database;
    constructor(db: Database) {
        this.db = db;
    }

    public listCart(server: Express) {
        server.get(Cart.cartQuery, (req: Request, res: Response) => {
            let query: string = req.query["user"] as string ?? "";
            let id = parseInt(query);
            if (id) {
                this.db.getCart(id).then(results => {
                    res.send(results);
                });
            } else {
                res.status(400).send("User ID not a number");
            }
        });
    }

    public addToCart(server: Express) {
        server.post(Cart.cartQuery, (req: Request, res: Response) => {
            let item = req.body as AddRequest;
            if (typeof item.productId === 'number' && typeof item.userId === 'number') {
                this.db.addToCart(item.productId, item.userId).then(operation => {
                    let id = Number(operation.insertId);
                    res.send({ id: id });
                });
            } else {
                res.status(400).send("Malformed JSON payload");
            }
        });
    }

    public removeFromCart(server: Express) {
        server.delete(Cart.cartPath, (req: Request, res: Response) => {
            let query = req.url.split("/");
            let id = parseInt(query[query.length - 1]);
            if (id) {
                this.db.removeFromCart(id).then(operation => {
                    if (operation.affectedRows > 0) {
                        res.status(200).send();
                    } else {
                        res.status(404).send("Cart entry not found");
                    }
                });
            } else {
                res.status(400).send("Cart ID is not a number");
            }
        });
    }

}

export default Cart;