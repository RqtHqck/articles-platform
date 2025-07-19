import {Response, Request, Router} from "express";
const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Проверка доступности сервиса
 *     description: Возвращает "OK", если сервис работает
 *     tags:
 *       - health
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 */
router.get('/health', (req: Request, res: Response): void => {
    res.status(200).json({ status: 'OK' });
});

export default router;