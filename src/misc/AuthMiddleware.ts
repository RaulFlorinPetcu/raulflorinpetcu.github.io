import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jsonwebtoken.verify(token.split(" ")[1], 'GwWifouXZnV43M0MuKROBmerk4xwbH6M');
        next();
    } 
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};