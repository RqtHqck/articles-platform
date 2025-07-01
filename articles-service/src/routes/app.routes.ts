import Express, {Response, Request} from "express";
const router = Express.Router();


router.get('/', (req: Request, res: Response): void => {
    res.send('OK');
});

export default router;