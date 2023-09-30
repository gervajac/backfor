import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { PerfilComment } from 'src/perfilcomment/perfilcomment.entity';
import { Post } from 'src/post/post.entity';
import { User } from './user.entity';
import {Repository} from "typeorm";


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
      console.log(loginData, "logindata")
      const user = await this.userRepository.findOne({
         where: {
            userName: loginData.userName
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
