import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { User } from './user.entity';
import {Repository} from "typeorm";


@Injectable()
export class UserService {

constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(user) {
      console.log(user, "como le llega")
      const duplicateUser = await this.userRepository.findOne({
         where: {
            userName: user.userName 
         }
      })
      if(duplicateUser) return new HttpException("El usuario ya existe", HttpStatus.CONFLICT)
       const newUser = this.userRepository.create(user)
       return this.userRepository.save(newUser)
    }

    getUser() {
        return this.userRepository.find();
     }

     async getOneUser(id: string) {
       const userFound = await this.userRepository.findOne({
            where: {
                id: id
            }
        })
        if(!userFound) return new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

        return userFound;
     }

     async deleteUser(id: string) {
        const userFound = await this.userRepository.delete({id: id});
        if(userFound.affected === 0) {
         return new HttpException("Usuario no econtrado", HttpStatus.NOT_FOUND)
        }
        return userFound;
     }

     async updateUser(id: string, user: any) {
      const userFound = await this.userRepository.findOne({
         where: {
             id: id
            }
      })
      if(!userFound) return new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
      const updateUser = Object.assign(userFound, user)
        return this.userRepository.save(updateUser)
     }

}
