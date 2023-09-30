import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Post } from "src/post/post.entity";
import { Comment } from "src/comment/comment.entity";
import { PerfilComment } from "src/perfilcomment/perfilcomment.entity";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column({unique: true})
    userName: string
    
    @Column({nullable: true, default: "https://toppng.com/uploads/preview/vu-thi-ha-user-pro-icon-115534024853ae3gswzwd.png"})
    image: string

    @Column({nullable: true})
    mail: string

    @Column({nullable: true})
    sex: string

    @Column({nullable: true})
    fullName: string

    @Column({nullable: true})
    profession: string

    @Column({nullable: true})
    job: string

    @Column({nullable: true})
    university: string

    @Column({nullable: true})
    career: string

    @Column({nullable: true})
    city: string

    @Column({nullable: true})
    province: string

    @Column({nullable: true})
    country: string

    @Column({nullable: true, default: 0})
    points: number

    @Column()
    password: string

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @OneToMany(type => Post, post => post.author)
    posts: Post[];

    @OneToMany(type => Comment, comment => comment.author) // Un usuario puede tener muchos comentarios
    comments: Comment[]; // Agregado el campo 'comments'

    @OneToMany(type => PerfilComment, perfilComment => perfilComment.user)
    perfilComments: PerfilComment[];

    @ManyToMany(type => Post, post => post.likes)
    likedPosts: Post[];
    
}

const user = new User()