import { Controller, Get, Post, Delete, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { PerfilcommentService } from './perfilcomment.service';

@Controller('perfilcomment')
export class PerfilcommentController {

    constructor(private PerfilcommentService: PerfilcommentService){}

    @Post()
    CreateComment(@Body() comment: any) {
      console.log(comment, "como le llega comentt")
        return this.PerfilcommentService.createPerfilComment(comment)
    }

    @Get(":id")
    getPerfilComments(@Param("id") id: any) {

        return this.PerfilcommentService.getPerfilComments(id)
    }

}
