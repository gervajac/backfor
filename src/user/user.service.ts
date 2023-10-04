import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import * as jwt from 'jsonwebtoken'
import { PerfilComment } from 'src/perfilcomment/perfilcomment.entity';
import { Post } from 'src/post/post.entity';
import { User } from './user.entity';
import {Repository} from "typeorm";
require('dotenv').config();


@Injectable()
export class UserService {

constructor(@InjectRepository(User) private userRepository: Repository<User>,
@InjectRepository(PerfilComment) private perfilCommentRepository: Repository<PerfilComment>,
@InjectRepository(Post) private postRepository: Repository<Post>) {}

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
      try {
        const user = await this.userRepository.findOne({
          where: [
            { userName: loginData.userName },
            { mail: loginData.userName }
          ]
        });
        console.log(user, "userenc")
        if (!user) {
          throw new HttpException("No se encontró usuario", HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = user.password === loginData.password;
        if (!isPasswordValid) {
          throw new HttpException("Contraseña inválida", HttpStatus.UNAUTHORIZED);
        }
        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "4h"})
        user.token = token
        await this.userRepository.save(user);
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return {
          user: userWithoutPassword
        };
      } catch (error) {
        // Manejo de errores
        throw new HttpException("Error al autenticar usuario", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    async getUser() {
      try{
         const rank = await this.userRepository.createQueryBuilder("user").orderBy("points", "DESC").getMany()
         return rank;
      } catch(err){
         throw new HttpException("Error al encontrar usuarios", HttpStatus.INTERNAL_SERVER_ERROR);
      }
     }

     async getOneUser(id: string) {
       const userFound = await this.userRepository.findOne({
            where: {
                id: id
            },
            relations: ["posts", "comments", "perfilComments", "perfilComments.user"]
        })
        if(!userFound) return new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);

        return userFound;
     }

     async createPerfilComment(id: string, commentData: any) {
      // 1. Buscar el usuario al que pertenecerá el comentario de perfil
      const user = await this.userRepository.findOne({
         where: {
            id: id
         }
      });
      
      if (!user) {
          throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
      }
  
      // 2. Crear un nuevo comentario de perfil
      const newPerfilComment = this.perfilCommentRepository.create({
          description: commentData.description,
          image: commentData.image,
          authorId: commentData.authorId,
          userName: commentData.userName,
          user: user, // Asociar el comentario de perfil con el usuario
      });
  
      // 3. Guardar el comentario de perfil en la base de datos
      const savedPerfilComment = await this.perfilCommentRepository.save(newPerfilComment);
      console.log(savedPerfilComment, "guardado")
      return savedPerfilComment;
  }

  async like(idPost: any, idUser: any){
      const findedUser = await this.userRepository.findOne({
         where: {
            id: idUser
         },
         relations: ["likedPosts"]
      })
      const findedPost = await this.postRepository.findOne({
         where: {
            id: idPost
         },
         relations: ["author"]
      })
      console.log(findedPost.author, "postt")
      if (findedUser && findedPost) {
         findedPost.author.points += 2; // Incrementar los puntos del autor del post
         findedUser.likedPosts = [...findedUser.likedPosts, findedPost];
         
         await this.userRepository.save(findedUser);
         await this.userRepository.save(findedPost.author); // Guardar los puntos del autor
       }
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
