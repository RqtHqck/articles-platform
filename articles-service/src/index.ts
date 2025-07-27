import logger from "@libs/logger";
import CreateManyTagsService from "./components/tags/services/createManyTags.service";
import app from "./app";

app.listen(process.env.CONTAINER_PORT!, async () => {
    logger.info(`Article Service running on port ${process.env.CONTAINER_PORT}`);
    await CreateManyTagsService();
});