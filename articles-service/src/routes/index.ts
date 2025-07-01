import Express, {Response, Request} from "express";
import articlesRoutes from "@components/articles/routes";
const router = Express.Router();

router.get('/', (req: Request, res: Response): void => {
    res.send('OK');
});

export { router as appRouter, articlesRoutes };