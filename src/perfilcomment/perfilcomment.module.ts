import { Module } from '@nestjs/common';
import { PerfilcommentController } from './perfilcomment.controller';
import { PerfilcommentService } from './perfilcomment.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilComment } from './perfilcomment.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilComment]),TypeOrmModule.forFeature([User]), UserModule],
  controllers: [PerfilcommentController],
  providers: [PerfilcommentService],
  exports: [PerfilcommentService]
  

})
export class PerfilcommentModule {}
