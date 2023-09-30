import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/user.entity';
import { Post } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), 
  TypeOrmModule.forFeature([Comment]),
  TypeOrmModule.forFeature([User]),
  UserModule, 
  CommentModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
