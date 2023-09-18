import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm"
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {

 constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>,
 private userService: UserService, private postService: PostService) {}

 async createComment(comment: any) {
    const userFound = await this.userService.getOneUser(comment.authorId);
    if(!userFound) return new HttpException("user not found", HttpStatus.NOT_FOUND);
    const newComment = this.commentRepository.create(comment);
    return this.commentRepository.save(newComment)
 }

}
