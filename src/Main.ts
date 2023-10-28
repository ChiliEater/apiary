import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import Logger from './logger/Logger';

dotenv.config()

const server: Express = express();
const port: number = parseInt(process.env.PORT as unknown as string);

server.get("/", (req: Request, res: Response) => {
    res.send("This is a test wow");
});

server.listen(port, () => {
    Logger.info(`Server started at http://localhost:${port}`);
});