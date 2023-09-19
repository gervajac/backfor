import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";
import { Post } from "src/post/post.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    description: string

    @Column({nullable: true})
    image: string

    @Column({nullable: true})
    authorId: string

    @Column({nullable: true})
    postId: string

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @ManyToOne(type => User, user => user.comments) // Un comentario pertenece a un usuario
    author: User;

    @ManyToOne(type => Post, post => post.comments) // Un comentario pertenece a un post
    post: Post;
}

const comment = new Comment()