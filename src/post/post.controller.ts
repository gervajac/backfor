import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private PostService: PostService){}

    @Post()
    createPost(@Body() newPost) {
       return this.PostService.createPost(newPost)
    }

    @Get()
    getPost() {
        return this.PostService.getPost();
    }

}
