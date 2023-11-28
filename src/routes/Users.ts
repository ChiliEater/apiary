import { Express, Request, Response } from 'express';
import Database from "../db/Database";

class Users {
    private static userPath: RegExp = /\/users\/\d+/;
    private db: Database;
    constructor(db: Database) {
        this.db = db;
    }

    public listUser(server: Express) {
        server.get(Users.userPath, (req: Request, res: Response) => {
            let query = req.url.split("/");
            let id = parseInt(query[query.length - 1]);
            if (id) {
                this.db.getUser(id).then(user => {
                    if (user.length > 0) {
                        res.send(user[0])
                    } else {
                        res.status(404).send("User not found");
                    }
                });
            } else {
                res.status(400).send("User ID is not a number")
            }
        });
    }
}

export default Users;