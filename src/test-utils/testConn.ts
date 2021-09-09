import { createConnection } from 'typeorm';

export const testConn = (drop: boolean = false) => {
    return createConnection({
        name: 'default',
        type: 'postgres',
        host: 'localhost',
        port: 15432,
        username: 'postgres',
        password: 'Postgres2019!',
        database: 'movietest_jest',
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + '/../entity/*.*'],
    });
};
