import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    BelongsToMany
} from 'sequelize-typescript';
import { TagEnum } from '@entities/enums';
import Article from './Article';
import ArticleTag from './ArticleTag';

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
    @Column({
        type: DataType.ENUM(...Object.values(TagEnum)),
        allowNull: false
    })
    declare label: TagEnum;

    @BelongsToMany(() => Article, () => ArticleTag)
    declare articles: Article[];
}

export default Tag;
