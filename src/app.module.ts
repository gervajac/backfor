import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { PerfilcommentModule } from './perfilcomment/perfilcomment.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "password",
      database: "forodb",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    UserModule,
    PostModule,
    CommentModule,
    PerfilcommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
