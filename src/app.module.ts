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
      host: "bck8ewbqw8ortwzafcbs-mysql.services.clever-cloud.com",
      port: 3306,
      username: "unkh2mpsjrorsy4v",
      password: "ECGVhaz8dXumWCPpQWQ3",
      database: "bck8ewbqw8ortwzafcbs",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
    PerfilcommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
