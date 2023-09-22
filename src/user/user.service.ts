import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { User } from './user.entity';
import {Repository} from "typeorm";


@Injectable()
export class UserService {

constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(user) {
      const duplicateUser = await this.userRepository.findOne({
         where: {
            userName: user.userName 
         }
      })
      if(duplicateUser) return new HttpException("El usuario ya existe", HttpStatus.CONFLICT)
       const newUser = this.userRepository.create(user)
       return this.userRepository.save(newUser)
    }

    async loginUser(loginData) {
      console.log(loginData, "logindata")
      const user = await this.userRepository.findOne({
         where: {
            userName: "arnold" 
         }
      })
      console.log(user, "userfinded")
      console.log(user.password, loginData.password, "?")
      if(!user) return new HttpException("No se encontro usuario", HttpStatus.NOT_FOUND);
      if(user.password !== loginData.password) return new HttpException("Contraseña invalida", HttpStatus.UNAUTHORIZED);
       const savedUser = await this.userRepository.save(user)
       return{
         user: savedUser
       }
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
