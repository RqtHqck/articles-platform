import {GlobalRegistry} from "@libs/prometheus";
import {NextFunction, Request, Response, Router} from "express";
const router = Router();

router.get('/metrics', async (req: Request, res: Response): Promise<void> => {
    // Return all metrics the Prometheus exposition format
    const metricsData = await GlobalRegistry.metrics();
    res.setHeader('Content-Type', GlobalRegistry.contentType);
    res.status(200).send(metricsData);
});

export default router;