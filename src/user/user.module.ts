import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { Post } from 'src/post/post.entity';
import { User } from './user.entity';
import { PerfilComment } from 'src/perfilcomment/perfilcomment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([PerfilComment]), TypeOrmModule.forFeature([Post])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
