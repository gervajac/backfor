import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { Comment } from 'src/comment/comment.entity';
import { AuthMiddleware } from 'src/middleware/auth-middleware';
import { User } from 'src/user/user.entity';
import { Post } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), 
  TypeOrmModule.forFeature([Comment]),
  TypeOrmModule.forFeature([User]),
  UserModule, 
  CommentModule],
  controllers: [PostController],
  providers: [PostService, AuthMiddleware],
  exports: [PostService]
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: 'post', method: RequestMethod.POST })
  }
}
