"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const misc_router_1 = __importDefault(require("./routes/misc_router"));
const inventar_router_1 = __importDefault(require("./routes/inventar_router"));
const user_router_1 = __importDefault(require("./routes/user_router"));
const pdf_router_1 = __importDefault(require("./routes/pdf_router"));
// Server Setup - Initialization
const app = (0, express_1.default)();
// Server Setup - Config
app.use((0, cors_1.default)({ origin: "*" }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
// Server Setup - Routes
app.use("", misc_router_1.default);
app.use("", inventar_router_1.default);
app.use("", user_router_1.default);
app.use("", pdf_router_1.default);
exports.default = app;
