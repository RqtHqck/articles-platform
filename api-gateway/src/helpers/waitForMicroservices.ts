import axios from "axios";
import {retry} from "./retry";
import logger from "@libs/logger";

export interface ServiceInfo {
    name: string;
    url: string;
    port: string;
}

const attempts = 10;
const delay = 2500;

export async function waitForMicroservices(services: ServiceInfo[]): Promise<void> {
    const servicePromises = services.map(async (service) => {
        try {
            await retry(async () => {
                try {
                    const response = await axios.get(service.url);
                    if (response.status !== 200) {
                        throw new Error(`Invalid status code: ${response.status}`);
                    }
                } catch (error: any) {
                    logger.debug(`Attempt to reach ${service.name} failed: ${error.message}`);
                    throw error;
                }
            }, attempts, delay);

            logger.info(`${service.name} microservice is available on ${service.port}`);
        } catch (error) {
            logger.error(`${service.name} microservice failed after ${attempts} attempts.`);
            if (process.env.NODE_ENV === "test") {
                throw error;
            }
            process.exit(1);
        }
    });

    await Promise.all(servicePromises);
    logger.info("All required microservices are alive. Gateway is fully operational.");
}
