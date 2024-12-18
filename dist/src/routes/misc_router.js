"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const misc_router = (0, express_1.Router)();
misc_router.get("", (req, res) => { res.send("API of PFR"); });
exports.default = misc_router;
