import { MiddlewareConsumer, NestModule, RequestMethod, forwardRef } from "@nestjs/common";
import { Module } from "@nestjs/common/decorators";
import { UserIdCheckMiddleware } from "src/middlewares/user-id-check-middleware";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "src/auth/auth.module";


@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)], //usando a funcao forwardRef() ao importar o modulo AuthModule, para evitar erro de dependencia circular, q nesse caso é o UserModule importando o AuthModule e ao mesmo tempo o AuthModulo Importando o UserModule 
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule implements NestModule {

  //metodo para aplicar um middleware
  configure(consumer: MiddlewareConsumer) {
    //aplicando um middleware para determinada rotas e verbo http
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL
    })
  }
}