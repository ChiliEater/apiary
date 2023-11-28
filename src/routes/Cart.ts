import { Express, Request, Response } from 'express';
import Database from "../db/Database";

class Cart {
    private static cartPath: RegExp =  /\/carts\/\d+/;
    private static cartQuery: RegExp =  /\/carts/;
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

}

export default Cart;