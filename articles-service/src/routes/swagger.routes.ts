import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@libs/swagger/swagger";
import {Request, Response, Router} from "express";

const router  = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/json', async (req: Request, res: Response): Promise<void> => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export default router;