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
import {Article} from '@components/articles/models';
import {ArticleTag} from '@components/articles/models';

@Table({
    tableName: 'tags',
    schema: 'public',
    timestamps: false,
    underscored: true
})
class Tag extends Model {
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

    @BelongsToMany(() => Article, () => ArticleTag)
    declare articles: Article[];
}

export default Tag;
