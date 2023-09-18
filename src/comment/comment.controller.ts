import { Controller, Get, Post, Delete, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';


@Controller('comment')
export class CommentController {

    constructor(private CommentService: CommentService){}

    @Post()
    CreateComment(@Body() comment: any) {
        return this.CommentService.createComment(comment)
    }



}
