import Express from "express";
// import searchRoutes from "@components/search/routes";
import appRoutes from "@routes/app.routes";

const router = Express.Router();

router.use("/", appRoutes);

export { router };