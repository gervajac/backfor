import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";
import { Post } from "src/post/post.entity";

@Entity()
export class PerfilComment {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    description: string

    @Column({nullable: true})
    image: string

    @Column({nullable: true})
    userName: string

    @Column({nullable: true})
    authorId: string

    @Column({nullable: true})
    userId: string

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date

    @ManyToOne(type => User, user => user.perfilComments)
@JoinColumn({ name: 'authorId' })
user: User;
}

const comment = new PerfilComment()