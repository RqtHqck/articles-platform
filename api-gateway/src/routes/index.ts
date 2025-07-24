import Express from "express";
import appRoutes from "@routes/app.routes";
import swaggerRoutes from "./swagger.routes";
import serviceRoutes from "./service.routes";
const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);
router.use("/", serviceRoutes);

export { router };