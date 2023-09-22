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
        const post = await this.postRepository.find({
            relations: ["author", "comments"],
        });

        const programacionPosts = await this.postRepository.find({
            where: { section: 'Programacion' },
            relations: ["author", "comments"],
        });
    
        const empleosPosts = await this.postRepository.find({
            where: { section: 'Empleos' },
            relations: ["author", "comments"],
        });
    
        const educacionPosts = await this.postRepository.find({
            where: { section: 'Educacion' },
            relations: ["author", "comments"],
        });

        return {
            programacion: programacionPosts,
            empleos: empleosPosts,
            educacion: educacionPosts,
            post: post
        };
    }

    async getSectionPost(section) {

        const posts = await this.postRepository.find({
            where: {section: section},
            relations: ["author", "comments"],
        });
        console.log(posts, "POST OBTENIDOS")
        return {
            posts: posts
        };
    }

    async getOnePost(id: string) {
        console.log(id)
        const postFound = await this.postRepository.findOne({
             where: {
                 id: id
             },
             relations: ["author", "comments"]
         })
         const commentsFound = await this.commentRepository.find({
            where: {postId: postFound.id},
        })
         console.log(commentsFound)
         if(!postFound) return new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
 
         return {postFound: postFound, comments: commentsFound};
      }

}
