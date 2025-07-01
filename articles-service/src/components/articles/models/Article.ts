import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    CreatedAt,
    UpdatedAt, BelongsToMany
} from 'sequelize-typescript';
import Tag from "./Tag";
import ArticleTag from "./ArticleTag";

@Table({
    tableName: 'articles',
    schema: 'public',
    timestamps: true, // чтобы автоматически велись created_at / updated_at
    underscored: true // поля будут snake_case: created_at, updated_at
})
class Article extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(255),
        unique: true
    })
    declare title: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare content: string;

    @AllowNull(true)
    @Column({
        type: DataType.DATE,
        field: 'published_at'
    })
    declare publishedAt: Date;

    @CreatedAt
    @Column({
        field: 'created_at'
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at'
    })
    declare updatedAt: Date;

    @BelongsToMany(() => Tag, () => ArticleTag)
    declare tags: Tag[];
}

export default Article;
