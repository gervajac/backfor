import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {

    @Get()
    helloworld() {
        return "Hello"
    }

}
