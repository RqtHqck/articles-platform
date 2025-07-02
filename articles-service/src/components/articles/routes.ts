import express from 'express';

import {
    CreateArticleController, DeleteArticleController,
    GetArticleByIdService, GetAllArticlesController
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



export default router;