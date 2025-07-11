import { createLogger, format, transports, Logger as WinstonLogger, stream } from "winston";

interface LoggerWithStream extends WinstonLogger {
    morganStream: {
        write: (message: string) => void;
    };
}


class Logger {
    private static _instance: LoggerWithStream;

    public static get instance(): LoggerWithStream {
        if (!Logger._instance) {
            const logger = createLogger({
                level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
                format: format.combine(
                    format.timestamp(),
                    format.errors({ stack: true }),
                    format.splat(),
                    format.json()
                ),
                transports: [],
                exitOnError: false,
            }) as LoggerWithStream;

            logger.morganStream = {
                write(message: string): void {
                    logger.info(message.trim());
                },
            };

            Logger._instance = logger;
        }

        return Logger._instance;
    }


    public static addTransport(transport: any): void {
        Logger.instance.add(transport);
    }

    public static setLevel(level: string): void {
        Logger.instance.level = level;
    }
}

// Transports set
Logger.addTransport(
    new transports.File({
        level: "info",
        filename: "./logs/all-logs.log",
        handleExceptions: true,
        format: format.json(),
        maxsize: 5242880,
        maxFiles: 5,
    })
);

Logger.addTransport(
    new transports.Console({
        level: "debug",
        handleExceptions: true,
        format: format.combine(format.colorize(), format.simple()),
    })
);

export default Logger.instance;