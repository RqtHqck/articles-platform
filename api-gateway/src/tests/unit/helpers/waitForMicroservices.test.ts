import { waitForMicroservices, ServiceInfo } from "@helpers/waitForMicroservices";
import axios from "axios";
import { retry } from "@helpers/retry";

// Мокаем axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Мокаем retry
jest.mock("@helpers/retry", () => ({
    retry: jest.fn(),
}));

// Мокаем логгер
jest.mock("@libs/logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
}));

// Мокаем process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
    throw new Error(`process.exit: ${code}`);
});


afterEach(() => {
    jest.clearAllMocks();
    mockExit.mockReset();
    delete process.env.NODE_ENV;
});

describe("waitForMicroservices", () => {
    const services: ServiceInfo[] = [
        { name: "Articles", url: "http://localhost:3001/health", port: "3001" },
        { name: "Logs", url: "http://localhost:3002/health", port: "3002" },
    ];

    it("дожидается запуска всех микросервисов", async () => {
        (retry as jest.Mock).mockImplementation(async (fn) => await fn());
        mockedAxios.get.mockResolvedValue({ status: 200 });

        await waitForMicroservices(services);

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3001/health");
        expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3002/health");
    });

    it("завершает процесс, если один из микросервисов не отвечает и NODE_ENV не test", async () => {
        process.env.NODE_ENV = "production";
        (retry as jest.Mock).mockRejectedValue(new Error("ECONNREFUSED"));

        let error: Error | undefined;
        try {
            // Запускаем в отдельном промиссе, чтобы поймать возможные ошибки
            await waitForMicroservices(services);
        } catch (err) {
            error = err as Error;
        }

        // Проверяем что была попытка выхода
        expect(mockExit).toHaveBeenCalledWith(1);

        // Ожидаем что либо waitForMicroservices бросит ошибку, либо process.exit будет вызван
        if (!error && !mockExit.mock.calls.length) {
            throw new Error("waitForMicroservices должен был вызвать process.exit");
        }

        // Если есть ошибка (от мока process.exit), проверяем её содержание
        if (error) {
            expect(error.message).toContain("process.exit: 1");
        }
    });

    it("выбрасывает ошибку, если один из микросервисов не отвечает и NODE_ENV=test", async () => {
        process.env.NODE_ENV = "test";

        (retry as jest.Mock).mockImplementation(async () => {
            throw new Error("ECONNREFUSED");
        });

        await expect(waitForMicroservices(services)).rejects.toThrow("ECONNREFUSED");
        expect(mockExit).not.toHaveBeenCalled();
    });

    it("повторяет попытки, если статус ответа не 200", async () => {
        let callCount = 0;

        mockedAxios.get.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({ status: 500 });
            } else {
                return Promise.resolve({ status: 200 });
            }
        });

        (retry as jest.Mock).mockImplementation(async (fn) => {
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    await fn();
                    return;
                } catch (e) {
                    if (attempt === 2) throw e;
                }
            }
        });

        await waitForMicroservices([
            { name: "Search", url: "http://localhost:3003/health", port: "3003" },
        ]);

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
});
