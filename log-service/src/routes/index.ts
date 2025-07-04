import Express from "express";
import logRoutes from "@components/logs/routes";
import swaggerRoutes from "./swagger.routes";
import appRoutes from "@routes/app.routes";

const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);
router.use("/", logRoutes);

export { router };