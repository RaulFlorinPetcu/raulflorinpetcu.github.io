"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const user_router = (0, express_1.Router)();
user_router.post("/register_user", (req, res) => user_controller_1.default.register_user(req, res));
user_router.post("/login_user", (req, res) => user_controller_1.default.login_user(req, res));
exports.default = user_router;
