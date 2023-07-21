import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

//guards servem para fazer uma verificacao antes da rota ser realmente ativada, permitindo ou nao o acesso a rota
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }


  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();  //pega o request que esta sendo feito
    const { authorization } = request.headers;  //pega o cabecalho de authorization q esta no headers e que contem o token    

    try {
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1])  //verifica se o token é valido e retorna os dados contidos nele

      request.tokenPayload = data; //cria uma nova propriedade no ciclo da request, com os dados extraidos do token; essa nova prop vai ficar acessivel nas rotas que usarem esse guard

      request.user = await this.userService.show(data.id) //add tbm o usuario em si na request

      return true;
    } catch (error) {
      return false
    }


  }
}