import { Controller, Get, Post, Delete, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';


@Controller('comment')
export class CommentController {

    constructor(private CommentService: CommentService){}

    @Post()
    CreateComment(@Body() comment: any) {
      console.log(comment, "como le llega comentt")
        return this.CommentService.createComment(comment)
    }

    @Get(":id")
    async getOneUser(@Param("id") id: string) {
      const foundPost = await this.CommentService.getOnePost(id);
      if (!foundPost) {
        throw new NotFoundException('Post no encontrado');
      }
      return foundPost;
    }

}
