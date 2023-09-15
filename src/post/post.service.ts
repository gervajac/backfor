import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import {Repository} from "typeorm"
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class PostService {

    constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

    createPost(post) {
       const newPost = this.postRepository.create(post)
       return this.postRepository.save(newPost)
    }

    getPost() {
        return this.postRepository.find();
    }

}
