import { Controller, Get, Post, Delete, Body, Patch, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {

    constructor(private UserService: UserService){}

    @Get()
    getUsers(): Promise<User[]> {
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
       return this.UserService.createUser(newUser)
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
    async updateUser(@Param("id") id: string, @Body() user: any) {
        const updatedUser = await this.UserService.updateUser(id, user);
        if (!updatedUser) {
            throw new NotFoundException('Usuario no encontrado');
          }
          return {user: updatedUser, message: "Usuario actualizado con exito"};
    }
}
