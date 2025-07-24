import logger from "@libs/logger";

export async function retry<T>(
    callback: () => Promise<T>,
    times: number,
    interval: number
): Promise<T> {
    let attempt = 0;

    while (attempt < times) {
        try {
            attempt++;

            const result = await callback();
            logger.debug(`Retry operation successful on attempt ${attempt}`);

            return result;
        } catch (err) {
            logger.debug(`Attempt ${attempt} failed`);

            // Если лимит - выходим
            if (attempt >= times) {
                throw err;
            }
            // Ждём interval секунд
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }

    throw new Error("Unexpected error in retry loop");
}
