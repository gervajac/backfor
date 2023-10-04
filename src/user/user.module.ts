import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { Post } from 'src/post/post.entity';
import { User } from './user.entity';
import { PerfilComment } from 'src/perfilcomment/perfilcomment.entity';
import { AuthMiddleware } from 'src/middleware/auth-middleware';



@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([PerfilComment]), TypeOrmModule.forFeature([Post])],
  controllers: [UserController],
  providers: [UserService, AuthMiddleware],
  exports: [UserService]
})
export class UserModule {  configure(consumer: MiddlewareConsumer) {
  consumer.apply(AuthMiddleware).forRoutes({ path: 'user/:id', method: RequestMethod.PATCH }, { path: 'user/like/:id', method: RequestMethod.POST })
}}
