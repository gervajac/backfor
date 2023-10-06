import { Controller, Get, Post, Delete, Query, Body, UseGuards, UseInterceptors, Patch, Param, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthMiddleware } from 'src/middleware/auth-middleware';


@Controller('comment')
export class CommentController {

    constructor(private CommentService: CommentService){}

    @Post()
    @UseGuards(AuthMiddleware)
    CreateComment(@Body() comment: any) {
      console.log(comment, "como le llega comentt")
        return this.CommentService.createComment(comment)
    }

  @Get(':id')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ) {
    const foundPost = await this.CommentService.getOnePost(id, page, perPage);
    if (!foundPost) {
      throw new NotFoundException('Post no encontrado');
    }
    return foundPost;
  }

}
