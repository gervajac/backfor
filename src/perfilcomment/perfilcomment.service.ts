import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PerfilComment } from './perfilcomment.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import {Repository} from "typeorm"

@Injectable()
export class PerfilcommentService {

    constructor(@InjectRepository(PerfilComment) private PerfilcommentRepository: Repository<PerfilComment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService) {}

    async createPerfilComment(comment: any) {
        console.log(comment, "llega acass?")

        const newComment = this.PerfilcommentRepository.create(comment);
        return this.PerfilcommentRepository.save(newComment)
     }

     async getPerfilComments(id: any) {
        const getComments = await this.PerfilcommentRepository.find({
            where: {
                userId: id
            }
        })
        return getComments
     }



}
