"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token)
        return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], 'GwWifouXZnV43M0MuKROBmerk4xwbH6M');
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}
;
