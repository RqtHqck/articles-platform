import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    CreatedAt,
    UpdatedAt, BelongsToMany, Unique
} from 'sequelize-typescript';
import TagModel from "@components/tags/models/Tag.model";
import ArticleTagModel from "./ArticleTag.model";


@Table({
    tableName: 'articles',
    schema: 'public',
    timestamps: true, // чтобы автоматически велись created_at / updated_at
    underscored: true // поля будут snake_case: created_at, updated_at
})
class ArticleModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(255),
        unique: true
    })
    declare title: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare content: string;

    @CreatedAt
    @Column({
        field: 'published_at'
    })
    declare publishedAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at'
    })
    declare updatedAt: Date;

    @BelongsToMany(() => TagModel, () => ArticleTagModel)
    declare tags: TagModel[];
}

export default ArticleModel;
