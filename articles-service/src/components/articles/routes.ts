import express from 'express';

import {
    CreateArticleController, DeleteArticleController,
    GetArticleByIdService, GetAllArticlesController, UpdateArticleController
} from './controllers';

const router = express.Router();

router.post(
    '/',
    CreateArticleController.run
);

router.delete(
    '/:id',
    DeleteArticleController.run
);

router.get(
    '/',
    GetAllArticlesController.run
);

router.get(
    '/:id',
    GetArticleByIdService.run
);

router.put(
    '/:id',
    UpdateArticleController.run
);

export default router;