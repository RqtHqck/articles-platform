import {Request} from "express";

export const normalizePath = (req: Request): string => {
    let path = req.baseUrl + (req.route?.path || req.path);
    if (req.params) {
        // incase we don't get "req.route?.path" - we need to replace the path param names inplace of actual values
        Object.keys(req.params).forEach((paramKey) => {
            path = path.replace(`/${req.params[paramKey]}`, `/:${paramKey}`);
        });
    }

    return path;
};
