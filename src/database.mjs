/**
 * Created on: 2024/11/03
 *     Author: A.G.
 */

import Pool from 'pg-pool';

import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: 'env' });

export const pool = new Pool({
    host:       process.env.POSTGRES_HOST,
    port:       process.env.POSTGRES_PORT,
    user:       process.env.POSTGRES_USER,
    password:   process.env.POSTGRES_PASSWORD,
    database:   process.env.POSTGRES_DB,
    max:        3,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000
});

pool.connect((error, client) => client?.release());

pool.once("connect", function () { console.log('Connection to database is successful'); });
