import dotenv from 'dotenv';
import path from 'node:path';
import { MongoDBDatabase } from './shared/database/mongodb.configuration';
import { ExpressServer } from './server';

dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

(async () => {
    ExpressServer.getInstance().open(3001)
    MongoDBDatabase.connect()
})()
