import { ConflictError } from '@errors/index';
import { Article } from '@components/articles/models';
import {ICreateArticleDto} from "@entities/interfaces";

const CreateArticleService = async (
    updateData: ICreateArticleDto,
): Promise<void> => {
    const { title, content } = updateData;

    const [article, created] = await Article.findOrCreate({
        where: { title },
        defaults: {
            title,
            content,
        },
        raw: true,
    });

    if (!created) {
        throw new ConflictError({
            code: 'conflict_error',
            text: 'Курс с таким названием уже существует',
        });
    }
};

export default CreateArticleService;