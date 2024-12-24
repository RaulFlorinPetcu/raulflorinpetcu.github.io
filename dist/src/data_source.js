"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const USER_1 = __importDefault(require("./tables/USER"));
const INVENTAR_1 = __importDefault(require("./tables/INVENTAR"));
const PRODUS_1 = __importDefault(require("./tables/PRODUS"));
require('dotenv').config();
const ServerDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    logging: false,
    entities: [USER_1.default, INVENTAR_1.default, PRODUS_1.default],
    subscribers: [],
    migrations: []
});
exports.default = ServerDataSource;
