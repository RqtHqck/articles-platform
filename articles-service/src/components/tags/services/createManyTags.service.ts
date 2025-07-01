import logger from "@libs/logger";
import {TagEnum} from "@entities/enums";
import {Tag} from "@components/articles/models";
import {ITag} from "@entities/interfaces";
import {TTagCreation} from "@entities/types";


const CreateManyTagsService = async (): Promise<void> => {
    logger.info("RoleService::createMany")
    const allowedRoleNames: ITag[] = Object.values(TagEnum).map((label: TagEnum): ITag => ({label}));
    await Tag.bulkCreate(allowedRoleNames as TTagCreation[], { ignoreDuplicates: true });
}

export default CreateManyTagsService;