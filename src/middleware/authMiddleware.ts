import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyJWTToken = async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        res.status(401).json({
            message: 'No token, authorization denied',
            response_code: 401,
        });
        return;
    }
    // Verify token
    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        );
        if (!decoded.user_id) {
            throw new Error('Unidentified user');
        }
        req.userId = decoded.user_id;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Token is not valid',
            response_code: 401,
        });
    }
};