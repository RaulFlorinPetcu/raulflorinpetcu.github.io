import { DataSource } from "typeorm";
import USER from "./tables/USER";
import INVENTAR from "./tables/INVENTAR";
import PRODUS from "./tables/PRODUS";

const ServerDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./database/main.sqlite",
    synchronize: true,
    logging: false,
    entities: [USER, INVENTAR, PRODUS],
    subscribers: [],
    migrations: []
});

export default ServerDataSource;