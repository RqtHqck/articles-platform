import {Kafka as KafkaJs, Producer, Consumer, Message, ConsumerSubscribeTopics, ConsumerSubscribeTopic} from 'kafkajs';
import config from 'config';
import logger from '@libs/logger';

interface KafkaMessage {
    key: string | null;
    value: string | object;
}

class Kafka {
    private kafka: KafkaJs;
    private producer: Producer;
    private consumer: Consumer;
    private isProducerConnected = false;
    private isConsumerConnected = false;

    constructor() {
        this.kafka = new KafkaJs({
            clientId: config.get<string>('KAFKA.CLIENT'),
            brokers: [`${config.get<string>('KAFKA.HOST')}:${config.get<number>('KAFKA.PORT')}`],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: config.get<string>('KAFKA.GROUP_ID') });
    }


    private async connectProducer(): Promise<void> {
        if (this.isProducerConnected) return;
        await this.producer.connect();
        this.isProducerConnected = true;
        logger.info('Kafka producer connected');
    }


    private async connectConsumer(): Promise<void> {
        if (this.isConsumerConnected) return;
        await this.consumer.connect();
        this.isConsumerConnected = true;
        logger.info('Kafka consumer connected');
    }


    public async produce(topic: string, messages: KafkaMessage[]): Promise<void> {
        try {
            await this.connectProducer();

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


    public async subscribe(options: ConsumerSubscribeTopics |  ConsumerSubscribeTopic): Promise<void> {
        await this.connectConsumer();

        await this.consumer!.subscribe(options);
    }


    public async consume(callbackMap: Record<string, (msg: any) => Promise<void>>): Promise<void> {
        try {
            await this.connectConsumer();

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    logger.info(`topic: ${topic}, partition: ${partition}`);

                    if (!message.value) {
                        logger.warn('Received empty message value');
                        return;
                    }

                    const parsedMessage = JSON.parse(message.value.toString());
                    logger.info(`message: ${JSON.stringify(parsedMessage)}`);

                    const handler = callbackMap[topic];

                    if (!handler) {
                        logger.warn(`No handler for topic ${topic}`);
                        return;
                    }

                    await handler(parsedMessage);
                },
            });
        } catch (err) {
            logger.error(err as Error);
            throw err;
        }
    }
}

const kafka = new Kafka();

export default kafka;
