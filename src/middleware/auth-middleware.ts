import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    console.log(token, "tokenn")
  //   if (token) {
  //     // Verifica y decodifica el token aquí
  //     jwt.verify(token, 'tu_secreto', (err, decoded) => {
  //       if (err) {
  //         return res.status(401).json({ message: 'Token inválido' });
  //       } else {
  //         // Si el token es válido, puedes agregar el objeto decodificado a la request
  //         req['user'] = decoded;
  //         next();
  //       }
  //     });
  //   } else {
  //     return res.status(401).json({ message: 'Token no proporcionado' });
  //   }
  // }
}}