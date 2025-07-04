import Express, {Response, Request} from "express";

const router = Express.Router();

router.get('/health', (req: Request, res: Response): void => {
    res.send('OK');
});

export { router as appRouter};