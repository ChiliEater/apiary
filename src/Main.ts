import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import Logger from './logger/Logger';
import mariadb from 'mariadb';
import Database from './db/Database';

dotenv.config()

const server: Express = express();
const port: number = parseInt(process.env.PORT as unknown as string);
const publicRoot: string = process.env.ROOT as unknown as string;
const cookiePath: RegExp = /\/cookie\/.*?\/?/;

const db = new Database();

/*
server.get("/", (req: Request, res: Response) => {
    res.send("This is a test wow");
});

server.use(express.static(publicRoot));

server.listen(port, () => {
    Logger.info(`Server started at http://localhost:${port}`);
});

server.post(cookiePath, (req: Request, res: Response) => {
    Logger.info("Received POST");
    res.json();
});

server.put(cookiePath, (req: Request, res: Response) => {
    Logger.info("Received PUT");
    res.json();
});


server.delete(cookiePath, (req: Request, res: Response) => {
    Logger.info("Received DELETE");
    res.json();
});
*/