import express from "express";
import articlesRoutes from "@components/articles/routes";
const router = express.Router();

router.use("/api/articles", articlesRoutes)

export { router };