"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const USER_1 = __importDefault(require("./tables/USER"));
const INVENTAR_1 = __importDefault(require("./tables/INVENTAR"));
const PRODUS_1 = __importDefault(require("./tables/PRODUS"));
const ServerDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "db.vjymlglrbphrxhgpdtlh.supabase.co",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "aDRIAN675231!@",
    synchronize: true,
    logging: false,
    entities: [USER_1.default, INVENTAR_1.default, PRODUS_1.default],
    subscribers: [],
    migrations: []
});
exports.default = ServerDataSource;
