import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(UserService: UserService){}

    @Get()
    helloworld() {
        return "Hello"
    }

}
