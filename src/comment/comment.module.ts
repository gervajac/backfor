import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CommentService } from './comment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { forwardRef } from '@nestjs/common/utils';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { Post } from 'src/post/post.entity';
import { AuthMiddleware } from 'src/middleware/auth-middleware';



@Module({
  imports: [TypeOrmModule.forFeature([Comment]),TypeOrmModule.forFeature([Post]), UserModule, forwardRef(() => PostModule)],
  controllers: [CommentController],
  providers: [CommentService, AuthMiddleware],
  exports: [CommentService]
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: 'comment', method: RequestMethod.POST })
  }
}
