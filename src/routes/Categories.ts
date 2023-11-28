import { Express, Request, Response } from 'express';
import Database from '../db/Database';

class Categories {
    private db: Database;
    constructor(db: Database) {
        this.db = db;
    }
    public listCategories(server: Express) {
        server.get("/categories", (req: Request, res: Response) => {
            this.db.getCategories().then(categories => res.send(categories));
        });
    }
}

export default Categories;