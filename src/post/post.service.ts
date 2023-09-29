import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import {Repository} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm";
import { UserService } from 'src/user/user.service';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {

    constructor(@InjectRepository(Post) private postRepository: Repository<Post>, @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private userService: UserService, private commentService: CommentService) {}


    async createPost(post: any) {
       const userFound = await this.userService.getOneUser(post.authorId);
       console.log(post.authorId)
       if(!userFound) return new HttpException("user not found", HttpStatus.NOT_FOUND);

       
       const newPost = this.postRepository.create(post)
       return this.postRepository.save(newPost)
    }

async getPost() {
    const [programacionPosts, empleosPosts, educacionPosts, post] = await Promise.all([
        this.postRepository.find({
            where: { section: 'Programacion' },
            relations: ["author", "comments", "likes"],
        }),
        this.postRepository.find({
            where: { section: 'Empleos' },
            relations: ["author", "comments", "likes"],
        }),
        this.postRepository.find({
            where: { section: 'Educacion' },
            relations: ["author", "comments", "likes"],
        }),
        this.postRepository.find({
            relations: ["author", "comments", "likes"],
        })
    ]);

    const getPostDetails = (posts) => posts.map(post => {
        const { author, likes, comments } = post;
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            author: {
                id: author.id,
                name: author.name,
                image: author.image,
                userName: author.userName
                // Añade más detalles del autor si es necesario
            },
            likesCount: likes.length,
            commentsCount: comments.length
        };
    });

    return {
        programacion: getPostDetails(programacionPosts),
        empleos: getPostDetails(empleosPosts),
        educacion: getPostDetails(educacionPosts),
        post: getPostDetails(post)
    };
}

    async getSectionPost(section) {

        const posts = await this.postRepository.find({
            where: {section: section},
            relations: ["author", "comments"],
        });
        console.log(posts, "POST OBTENIDOS")
        return {
            post: posts
        };
    }

    async getOnePost(id: string) {
        console.log(id)
        const postFound = await this.postRepository.findOne({
             where: {
                 id: id
             },
             relations: ["author", "comments", "likes"]
         })
         const commentsFound = await this.commentRepository.find({
            where: {postId: postFound.id},
        })
         console.log(postFound, "postencontrados")
         if(!postFound) return new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
 
         return {postFound: postFound, comments: commentsFound};
      }

}
