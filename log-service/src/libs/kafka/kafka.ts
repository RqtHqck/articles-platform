import { Kafka as KafkaJs, Producer, Consumer } from 'kafkajs';
import logger from '@libs/logger';

interface KafkaMessage {
    key: string | null;
    value: string | object;
}

class Kafka {
    private kafka: KafkaJs;
    private producer: Producer;
    private consumer: Consumer | null = null;
    private isConnected = false;

    constructor() {
        this.kafka = new KafkaJs({
            clientId: process.env.KAFKA_CLIENT,
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
        });
        this.producer = this.kafka.producer();
    }

    public async connect(): Promise<void> {
        try {
            if (this.isConnected) return;

            logger.info('Connecting to Kafka broker...');
            await this.producer.connect();
            this.isConnected = true;
        } catch (error) {
            logger.error('Kafka connection failed', error as Error);
        }
    }

    public async produce(topic: string, messages: KafkaMessage[]): Promise<void> {
        try {
            await this.connect();

            const formattedMessages = messages.map(msg => ({
                key: msg.key,
                value: typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value),
            }));

            await this.producer.send({
                topic,
                messages: formattedMessages,
            });
        } catch (err) {
            logger.error(err as Error);
        }
    }

    public async consume(topic: string, callback: (msg: any) => Promise<void>): Promise<void> {
        try {
            if (!this.consumer) {
                this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID! });
                await this.consumer.connect();
            }

            await this.consumer.subscribe({ topic, fromBeginning: true });

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    logger.info(`topic: ${topic}, partition: ${partition}`);

                    if (!message.value) {
                        logger.warn('Received empty message value');
                        return;
                    }

                    const parsedMessage = JSON.parse(message.value.toString());
                    logger.info(`message: ${JSON.stringify(parsedMessage)}`);

                    await callback(parsedMessage);
                },
            });
        } catch (err) {
            logger.error(err as Error);
            throw err;
        }
    }
}

const kafka = new Kafka();

kafka.connect()
    .then(() => logger.info('Successful connect to Kafka'))
    .catch(err => logger.error(err as Error));

export default kafka;
