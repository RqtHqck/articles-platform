import Express from "express";
import appRoutes from "@routes/app.routes";
import swaggerRoutes from "./swagger.routes";
import serviceRoutes from "./service.routes";
import metricsRoutes from "./prometheus.routes";
const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);
router.use("/", serviceRoutes);
router.use("/", metricsRoutes);

export { router };