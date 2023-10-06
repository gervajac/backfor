import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm"
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class CommentService {

 constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>, 
 @InjectRepository(Post) private postRepository: Repository<Post>,
 @InjectRepository(User) private userRepository: Repository<User>,
 private userService: UserService) {}

 async createComment(comment: any) {
    const userFound = await this.userRepository.findOne({
        where: {
            id: comment.authorId
        }
    });
    const postCreator = await this.postRepository.findOne({
        where: {
            id: comment.postId
        },
        relations:["author"]
    });
    if(!userFound || !postCreator) return new HttpException("user not found", HttpStatus.NOT_FOUND);
    const postCreatorSimplified = postCreator.author
    postCreatorSimplified.points += 1
    userFound.points += 1
    await this.userRepository.save(userFound)
    await this.userRepository.save(postCreatorSimplified)
    const newComment = this.commentRepository.create(comment);
    return this.commentRepository.save(newComment)
 }

 async getOnePost(id: string, page: number = 1, perPage: number = 10) {
    console.log(id)
    const skip = (page - 1) * perPage;
  
    const [commentsFound, totalComments] = await this.commentRepository.findAndCount({
      where: {
        postId: id
      },
      relations: ["author", "post"],
      skip,
      take: perPage
    });
  
    const postFound = await this.postRepository.findOne({
      where: {
        id: id
      },
      relations: ["author", "likes"]
    });
  
    console.log(postFound, "postencontrado");
  
    if(!commentsFound) return new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
    
    const likesIDs = postFound.likes.map(like => like.id);
    const totalPages = Math.ceil(totalComments / perPage);
  
    // Añadir el array con números
    const numbersArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return {
      pagination: {
        totalComments: totalComments,
        totalPages: totalPages,
        currentPage: page,
        numbersArray: numbersArray
      },
      commentsFound: commentsFound, 
      postFound: postFound, 
      likes: likesIDs,
      
    };
  }

}
