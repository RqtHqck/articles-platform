import express from 'express';
import {
    CreateArticleController, DeleteArticleController, GetAllArticlesController, UpdateArticleController, GetArticleByIdController
} from './controllers';

const router = express.Router();

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new article
 *     tags:
 *       - articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleCreate'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
    '/',
    CreateArticleController.run
);

/**
 * @openapi
 * /{id}:
 *   delete:
 *     summary: Delete article by ID
 *     tags:
 *       - articles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^\\d+$'
 *         required: true
 *         description: Numeric ID of the article to delete
 *     responses:
 *       204:
 *         $ref: '#/components/responses/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.delete(
    '/:id',
    DeleteArticleController.run
);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Retrieve the full list of articles
 *     tags:
 *       - articles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           pattern: '^\\d+$'
 *         required: false
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           pattern: '^\\d+$'
 *         required: false
 *         description: Number of articles per page (default 10)
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArticleGetAllList'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
    '/',
    GetAllArticlesController.run
);

/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Get article by ID
 *     tags:
 *       - articles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the article
 *     responses:
 *       200:
 *         description: Article found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get(
    '/:id',
    GetArticleByIdController.run
);

/**
 * @openapi
 * /{id}:
 *   put:
 *     summary: Update article by ID
 *     tags:
 *       - articles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the article to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleUpdate'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put(
    '/:id',
    UpdateArticleController.run
);


export default router;