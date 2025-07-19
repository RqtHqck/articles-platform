import express from 'express';
import {SearchArticlesController} from "@components/search/controllers";
const router = express.Router();


/**
 * @openapi
 * /search:
 *   get:
 *     summary: Поиск статей
 *     tags:
 *       - search
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           $ref: '#/components/schemas/TagEnumArray'
 *         style: form
 *         explode: true
 *         required: false
 *         description: Список тегов
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           pattern: '^\\d+$'
 *         required: false
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           pattern: '^\\d+$'
 *         required: false
 *         description: Кол-во результатов на странице
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - relevance
 *             - date_desc
 *             - date_asc
 *             # из ES_SortTypeEnum
 *         required: false
 *         description: Сортировка результатов
 *     responses:
 *       200:
 *         description: Результаты поиска
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchArticlesResponse'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
    '/search',
    SearchArticlesController.run
);

export default router;