import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import {Repository} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm";
import { UserService } from 'src/user/user.service';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostService {

    constructor(@InjectRepository(Post) private postRepository: Repository<Post>, 
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService, private commentService: CommentService) {}


    async createPost(post: any) {

        try{
            const userFound = await this.userService.getOneUser(post.authorId);
     
            if (userFound instanceof User) {
                userFound.points += 5;
            } else {
                return new HttpException("User not found", HttpStatus.NOT_FOUND);
            }
            const newPost = this.postRepository.create(post);

            console.log(newPost, "nuyevospostt")
            console.log(userFound)
            await this.userRepository.save(userFound)
            return this.postRepository.save(newPost);
        }catch(err){
            throw new HttpException("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }

     }

     async getPost() {
        const [programacionPosts, empleosPosts, educacionPosts, post] = await Promise.all([
            this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.comments', 'comments')
                .leftJoinAndSelect('post.likes', 'likes')
                .where('post.section = :section', { section: 'Programacion' })
                .addSelect(subQuery => {
                    return subQuery
                        .select('COUNT(*)', 'commentsCount')
                        .from('comment', 'comment')
                        .where('comment.postId = post.id');
                }, 'commentsCount')
                .orderBy('commentsCount', 'DESC')
                .getMany(),
            this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.comments', 'comments')
                .leftJoinAndSelect('post.likes', 'likes')
                .where('post.section = :section', { section: 'Empleos' })
                .addSelect(subQuery => {
                    return subQuery
                        .select('COUNT(*)', 'commentsCount')
                        .from('comment', 'comment')
                        .where('comment.postId = post.id');
                }, 'commentsCount')
                .orderBy('commentsCount', 'DESC')
                .getMany(),
            this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.comments', 'comments')
                .leftJoinAndSelect('post.likes', 'likes')
                .where('post.section = :section', { section: 'Educacion' })
                .addSelect(subQuery => {
                    return subQuery
                        .select('COUNT(*)', 'commentsCount')
                        .from('comment', 'comment')
                        .where('comment.postId = post.id');
                }, 'commentsCount')
                .orderBy('commentsCount', 'DESC')
                .getMany(),
            this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'author')
                .leftJoinAndSelect('post.comments', 'comments')
                .leftJoinAndSelect('post.likes', 'likes')
                .orderBy('post.id', 'DESC')
                .take(8)
                .getMany()
        ]);
    
        const getPostDetails = (posts) => posts.map(post => {
            const { author, likes, commentsCount, comments } = post;
            return {
                id: post.id,
                title: post.title,
                description: post.description,
                image: post.image,
                author: {
                    id: author.id,
                    name: author.name,
                    image: author.image,
                    userName: author.userName
                },
                likesCount: likes.length,
                commentsCount: commentsCount,
                comments: comments // Mantener las relaciones cargadas
            };
        });
    
        const rank = await this.userRepository.find({
            select: ["id", "userName", "points"],
            order: {
                points: 'DESC'
            },
            take: 5 
        });
        console.log(rank);
    
        return {
            programacion: getPostDetails(programacionPosts),
            empleos: getPostDetails(empleosPosts),
            educacion: getPostDetails(educacionPosts),
            post: getPostDetails(post),
            rank: rank
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

    async filterPost(word) {
        const user = await this.userRepository.createQueryBuilder("user")
        .where("user.userName LIKE :word", { word: `%${word}%` })
        .getMany();
        const posts = await this.postRepository.createQueryBuilder("post")
            .leftJoinAndSelect("post.author", "author")
            .leftJoinAndSelect("post.comments", "comments")
            .where("post.title LIKE :word", { word: `%${word}%` })
            .getMany();
        console.log(user)
        return {
            post: posts,
            user: user
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
