import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm"
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/post/post.entity';

@Injectable()
export class CommentService {

 constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>, @InjectRepository(Post) private postRepository: Repository<Post>,
 private userService: UserService) {}

 async createComment(comment: any) {
    const userFound = await this.userService.getOneUser(comment.authorId);
    if(!userFound) return new HttpException("user not found", HttpStatus.NOT_FOUND);
    const newComment = this.commentRepository.create(comment);
    return this.commentRepository.save(newComment)
 }

 async getOnePost(id: string) {
   console.log(id)
   const commentsFound = await this.commentRepository.find({
        where: {
            postId: id
        },
        relations: ["author", "post"]
    })
    const postFound = await this.postRepository.findOne({
        where: {
            id: id
        },
        relations: ["author", "likes"]
    })
    console.log(postFound, "postencontrado")
    if(!commentsFound) return new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
    const likesIDs = postFound.likes.map(like => like.id);
    return {commentsFound: commentsFound, postFound: postFound, likes: likesIDs};
 }

}
