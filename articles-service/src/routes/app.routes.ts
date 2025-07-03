import {Response, Request, Router} from "express";
const router = Router();


router.get('/health', (req: Request, res: Response): void => {
    res.send('OK');
});

export default router;