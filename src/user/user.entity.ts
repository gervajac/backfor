import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Post } from "src/post/post.entity";
import { Comment } from "src/comment/comment.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column({unique: true})
    userName: string

    @Column({nullable: true})
    image: string

    @Column()
    mail: string

    @Column()
    password: string

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @OneToMany(type => Post, post => post.author)
    posts: Post[];

    @OneToMany(type => Comment, comment => comment.author) // Un usuario puede tener muchos comentarios
    comments: Comment[]; // Agregado el campo 'comments'
}

const user = new User()