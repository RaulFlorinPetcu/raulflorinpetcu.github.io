import { DataSource } from "typeorm";
import USER from "./tables/USER";
import INVENTAR from "./tables/INVENTAR";
import PRODUS from "./tables/PRODUS";

const ServerDataSource = new DataSource({
    type: "postgres",
    host: "db.vjymlglrbphrxhgpdtlh.supabase.co",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "aDRIAN675231!@",
    synchronize: true,
    logging: false,
    entities: [USER, INVENTAR, PRODUS],
    subscribers: [],
    migrations: []
});

export default ServerDataSource;