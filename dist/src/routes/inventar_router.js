"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const inventar_controller_1 = __importDefault(require("../controllers/inventar_controller"));
const AuthMiddleware_1 = require("../misc/AuthMiddleware");
const inventar_router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "./temp" });
inventar_router.post("/import_csv_to_inventar", upload.single("file"), (req, res) => inventar_controller_1.default.import_csv_to_inventar(req, res));
inventar_router.post("/create_inventar", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.create_inventar(req, res));
inventar_router.get("/get_inventare", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.get_inventare(req, res));
inventar_router.post("/get_inventar_products", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.get_inventar_products(req, res));
inventar_router.post("/add_produs", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.add_produs(req, res));
inventar_router.post("/delete_produs", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.delete_produs(req, res));
inventar_router.post("/update_produs", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.update_produs(req, res));
inventar_router.post("/import_products_to_inventar", AuthMiddleware_1.verifyToken, (req, res) => inventar_controller_1.default.import_products_to_inventar(req, res));
exports.default = inventar_router;
