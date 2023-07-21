import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { FileModule } from "src/file/file.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
    forwardRef(() => UserModule), //usando a funcao forwardRef() ao importar o modulo AuthModule, para evitar erro de dependencia circular, q nesse caso é o UserModule importando o AuthModule e ao mesmo tempo o AuthModulo Importando o UserModule 
    PrismaModule,
    FileModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]

})
export class AuthModule {

}