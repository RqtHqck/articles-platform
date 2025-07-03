import Express from "express";
import articlesRoutes from "@components/articles/routes";
import swaggerRoutes from "./swagger.routes";
import appRoutes from "@routes/app.routes";

const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);
router.use("/", articlesRoutes);

export { router };