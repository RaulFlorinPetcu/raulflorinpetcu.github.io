import { DataSource } from "typeorm";
import USER from "./tables/USER";
import INVENTAR from "./tables/INVENTAR";
import PRODUS from "./tables/PRODUS";
require('dotenv').config()

const ServerDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    logging: false,
    entities: [USER, INVENTAR, PRODUS],
    subscribers: [],
    migrations: []
});

export default ServerDataSource;