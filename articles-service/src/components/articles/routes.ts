import express from 'express';

import {
    CreateArticleController,
} from './controllers';

const router = express.Router();

router.post(
    '/',
    CreateArticleController.run
);


export default router;