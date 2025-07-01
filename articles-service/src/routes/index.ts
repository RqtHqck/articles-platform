import Express, {Response, Request} from "express";
// import appRoutes from "./app.routes";
import articlesRoutes from "@components/articles/routes";

const router = Express.Router();


router.use("/", articlesRoutes);
// router.use("/healthcheck", appRoutes);

export { router };