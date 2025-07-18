import jwt from 'jsonwebtoken';
import { errorHander } from './error.js';
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHander(401, 'You are not authenticated'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHander(403, 'Token is not valid'));
        }
        req.user = user;
        next();
    });
}