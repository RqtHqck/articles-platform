import dotenv from 'dotenv';
import path from 'path';
import logger from "@libs/logger";

const envPath: string = path.join(__dirname, '../../config/.env');
dotenv.config({ path: envPath });

logger.debug("Environment set");

export default dotenv;