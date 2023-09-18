import { Controller, Get, Post, Delete, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private PostService: PostService){}

    @Post()
    createPost(@Body() post: any) {
       return this.PostService.createPost(post)
    }

    @Get()
    getPost() {
        return this.PostService.getPost();
    }

    @Get(":id")
    async getOneUser(@Param("id") id: string) {
      const foundPost = await this.PostService.getOnePost(id);
      if (!foundPost) {
        throw new NotFoundException('Post no encontrado');
      }
      return foundPost;
    }

}
