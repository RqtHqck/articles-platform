import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey
} from 'sequelize-typescript';
import {NonAttribute} from "sequelize";
import ArticleModel from './Article.model';
import TagModel from '@components/tags/models/Tag.model';

@Table({
    tableName: 'article_tags',
    schema: 'public',
    timestamps: false,
    underscored: true
})
class ArticleTagModel extends Model {
    @ForeignKey(() => ArticleModel)
    @Column(DataType.INTEGER)
    declare articleId: number;

    @ForeignKey(() => TagModel)
    @Column(DataType.INTEGER)
    declare tagId: number;

    @BelongsTo(() => TagModel)
    declare tag: NonAttribute<TagModel>;

    @BelongsTo(() => ArticleModel)
    declare article: NonAttribute<ArticleModel>;
}


export default ArticleTagModel;
