import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
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
    async getOneUser(@Param("id") id: string): Promise<User> {
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


}
