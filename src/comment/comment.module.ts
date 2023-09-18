import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';


@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
