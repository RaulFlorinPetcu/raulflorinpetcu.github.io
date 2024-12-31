"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdf_controller_1 = __importDefault(require("../controllers/pdf_controller"));
const pdf_router = (0, express_1.Router)();
pdf_router.post('/download_pdf', (req, res) => pdf_controller_1.default.generate_pdf(req, res));
exports.default = pdf_router;
