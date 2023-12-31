import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne, JoinTable } from "typeorm";
import { User } from "src/user/user.entity";
import { Comment } from "src/comment/comment.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({nullable: true}) 
    image: string;

    @Column({nullable: true})
    authorId: string

    @Column({
        type: "enum",
        enum: ["Programacion", "Educacion", "Empleos"]
    })
    section: string;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @ManyToOne(type => User, user => user.posts)
    author: User

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[]

    @ManyToMany(type => User, user => user.likedPosts)
    @JoinTable()
    likes: User[];

}

const post = new Post()