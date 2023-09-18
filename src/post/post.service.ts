import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import {Repository} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm";
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {

    constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UserService) {}

    async createPost(post: any) {
       const userFound = await this.userService.getOneUser(post.authorId);
       console.log(post.authorId)
       if(!userFound) return new HttpException("user not found", HttpStatus.NOT_FOUND);

       
       const newPost = this.postRepository.create(post)
       return this.postRepository.save(newPost)
    }

    getPost() {
        return this.postRepository.find({
            relations: ["author", "comments"],
        });
    }

    async getOnePost(id: string) {
        console.log(id)
        const postFound = await this.postRepository.findOne({
             where: {
                 id: id
             },
             relations: ["author"]
         })
         console.log(postFound)
         if(!postFound) return new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
 
         return postFound;
      }

}
