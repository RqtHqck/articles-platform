import {rateLimit} from "express-rate-limit";
import {Request, Response} from "express";
import logger from "@libs/logger";

export const rateLimitOptions = rateLimit({
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response): void => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: "Too many requests" });
    }
});