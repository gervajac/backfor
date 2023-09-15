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
    image: string

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @ManyToOne(type => User) // Cambiado a ManyToOne
    user: User; // Cambiado de users a user

    @JoinTable()
    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];
}

const post = new Post()