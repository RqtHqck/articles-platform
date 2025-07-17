import express from 'express';
import {SearchArticlesController} from "@components/search/controllers";
const router = express.Router();

router.get(
    '/search',
    SearchArticlesController.run
);

export default router;