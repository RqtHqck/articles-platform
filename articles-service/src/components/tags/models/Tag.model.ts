import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    BelongsToMany, Unique
} from 'sequelize-typescript';
import { TagEnum } from '@entities/enums';
import {ArticleModel} from '@components/articles/models';
import {ArticleTagModel} from '@components/articles/models';

@Table({
    tableName: 'tags',
    schema: 'public',
    timestamps: false,
    underscored: true
})
class TagModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.ENUM(...Object.values(TagEnum)),
        allowNull: false
    })
    declare label: TagEnum;

    @BelongsToMany(() => ArticleModel, () => ArticleTagModel)
    declare articles: ArticleModel[];
}

export default TagModel;
