import dotenv from 'dotenv';
import path from 'node:path';
import { ExpressServer } from './server';

dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

(async () => {
    ExpressServer.getInstance().open(3001)
})()
