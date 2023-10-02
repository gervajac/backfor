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

    @Get("/sections/:section")
    async getSectionPost(@Param("section") section: string) {
      console.log(section, "le lñlega?")
      const foundedPosts = await this.PostService.getSectionPost(section);
      if (!foundedPosts) {
        throw new NotFoundException('Post no encontrado');
      }
      return foundedPosts;
    }

    @Get(":id")
    async getOneUser(@Param("id") id: string) {
      const foundPost = await this.PostService.getOnePost(id);
      if (!foundPost) {
        throw new NotFoundException('Post no encontrado');
      }
      return foundPost;
    }

    @Get("/filter/:word")
    async getPostByWord(@Param("word") word: string) {
      console.log(word, "wordd")
      const foundPost = await this.PostService.filterPost(word);
      if (!foundPost) {
        throw new NotFoundException('Post no encontrado');
      }
      return foundPost;
    }

}
