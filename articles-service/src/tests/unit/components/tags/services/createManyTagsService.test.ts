import {CreateManyTagsService} from "@components/tags/services";
import { Tag } from "@components/tags/models";
import { TagEnum } from "@entities/enums";

jest.mock("@components/tags/models", () => ({
    Tag: {
        bulkCreate: jest.fn(),
    },
}));

const mockedTag = Tag as jest.Mocked<typeof Tag>;

describe("CreateManyTagsService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should bulk create tags ignoring duplicates", async () => {
        mockedTag.bulkCreate.mockResolvedValue(undefined as unknown as any);

        await CreateManyTagsService();

        // Формируем ожидаемый массив из enum
        const expectedTags = Object.values(TagEnum).map(label => ({ label }));

        expect(mockedTag.bulkCreate).toHaveBeenCalledWith(expectedTags, { ignoreDuplicates: true });
    });
});
