import Express from "express";
// import searchRoutes from "@components/search/routes";
import appRoutes from "@routes/app.routes";
import swaggerRoutes from "./swagger.routes";

const router = Express.Router();

router.use("/", swaggerRoutes);
router.use("/", appRoutes);

export { router };