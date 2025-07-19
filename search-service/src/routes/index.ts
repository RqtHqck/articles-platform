import Express from "express";
import searchRoutes from "@components/search/routes";
import appRoutes from "@routes/app.routes";
import swaggerRoutes from "@routes/swagger.routes";

const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);
router.use("/", searchRoutes);

export { router };