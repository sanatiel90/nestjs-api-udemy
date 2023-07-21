import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  /** exemplos de config opicionais do cors
   * {
      methods: ['GET'],
      origin: ['meusite.com.br', 'outrosite.com.br', '*']
     }
   */

  app.useGlobalPipes(new ValidationPipe()) //para utilizar pipes de validacao ou transform de dados em todo o app
  //app.useGlobalInterceptors(new LogInterceptor()) //para usar um determinado interceptor em todo o app
  await app.listen(3000);
}
bootstrap();
