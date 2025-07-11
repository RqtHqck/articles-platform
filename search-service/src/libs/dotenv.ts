import dotenv from 'dotenv';
import path from 'path';
import logger from "@libs/logger";

const envPath = path.join(__dirname, '../../config/.env.' + (process.env.NODE_ENV));
dotenv.config({ path: envPath });

logger.info(`Environment set as ${process.env.NODE_ENV}`)

export default dotenv;