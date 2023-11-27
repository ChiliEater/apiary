import mariadb, { Pool, PoolConnection } from 'mariadb';
import DummyData from './DummyData';

class Database {
    private pool: Pool;


    
    constructor() {
        this.pool = mariadb.createPool({
            host: 'localhost',
            port: 7778,
            user: 'node',
            password: 'DrqY8s9jHiUNuctk',
            database: 'node',
            connectionLimit: 1
        });
        DummyData.setupData(this.pool).then((res) => console.log(res));
    }

}

export default Database;