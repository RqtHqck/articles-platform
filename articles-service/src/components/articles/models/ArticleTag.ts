import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey
} from 'sequelize-typescript';
import {NonAttribute} from "sequelize";
import Article from './Article';
import Tag from '@components/tags/models/Tag';

@Table({
    tableName: 'article_tags',
    schema: 'public',
    timestamps: false,
    underscored: true
})
class ArticleTag extends Model {
    @ForeignKey(() => Article)
    @Column(DataType.INTEGER)
    declare articleId: number;

    @ForeignKey(() => Tag)
    @Column(DataType.INTEGER)
    declare tagId: number;

    @BelongsTo(() => Tag)
    declare tag: NonAttribute<Tag>;

    @BelongsTo(() => Article)
    declare article: NonAttribute<Article>;
}


export default ArticleTag;
