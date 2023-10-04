import { Controller, Get, Post, Delete, Body, Req, UseGuards, Patch, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthMiddleware } from 'src/middleware/auth-middleware';

@Controller('user')
export class UserController {

    constructor(private UserService: UserService){}

    @Get()
    getUsers() {
        return this.UserService.getUser();
    }

    @Get(":id")
    async getOneUser(@Param("id") id: string) {
      const foundUser = await this.UserService.getOneUser(id);
      if (!foundUser) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return foundUser;
    }

    @Post()
    createUser(@Body() newUser) {
      console.log(newUser, "newsuser")
       return this.UserService.createUser(newUser)
    }

    @Post("/comment/:id")
    CreateComment(@Param("id") id: any, @Body() comment: any) {
      console.log(id,  "como le llega comenttssss")
       // return this.UserService.createPerfilComment(id, comment)
    }

    @Post("/like/:id")
    like(@Param("id") id: any, @Body() idUser) {
      console.log(id, idUser)
        return this.UserService.like(id, idUser.userId)
    }

    @Post("/login")
    loginUser(@Body() newUser) {
      console.log(newUser, "newuser")
       return this.UserService.loginUser(newUser)
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string) {
        const deletedUser = await this.UserService.deleteUser(id);
        if (!deletedUser) {
            throw new NotFoundException('Usuario no encontrado');
          }
          return {userDeleted: deletedUser, message: "Usuario eliminado con exito"};
    }

    @Patch(":id")
    @UseGuards(AuthMiddleware)
    async updateUser(@Param("id") id: string, @Body() user: any) {
      console.log(id, "id")
      console.log(user, "user")
        const updatedUser = await this.UserService.updateUser(id, user);
        if (!updatedUser) {
            throw new NotFoundException('Usuario no encontrado');
          }
          return {user: updatedUser, message: "Usuario actualizado con exito"};
    }
}
