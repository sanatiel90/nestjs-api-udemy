import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from "@nestjs/throttler";
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(), //modulo da lib @nestjs/config para usar var de ambiente
    ThrottlerModule.forRoot({  //ThrottlerModule: lib do @nestjs para proteger sua app de ataques de força bruta; vc pode definir por exemplo um tempo e quantas requisicoes dentro desse tempo seu app pode receber
      ttl: 60,  //tempo de solicitacoes
      limit: 10 //quantas solicitacoes dentro desse tempo
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ], //usando a funcao forwardRef() ao importar o modulo AuthModule, para evitar erro de dependencia circular, q nesse caso é o UserModule importando o AuthModule e ao mesmo tempo o AuthModulo Importando o UserModule 
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, //configuracao pra usar a ThrottlerModule em toda a aplicacao
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
