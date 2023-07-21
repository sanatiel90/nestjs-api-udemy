import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

//criando um Decorator Personalizado
//esse filter é para caso vc queira acessar uma info especifica desse decorator
//nesse caso, caso queira acessar apenas uma info do user, como name ou email
export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest(); //pega a request
  if (request.user) { //se na request houver o param user (foi colocado no Guard), retorna ele, fazendo com que o decorator @User() retorne o user contido na request
    if (filter) {
      return request.user[filter] //user['email'], user['name'], etc
    } else {
      return request.user
    }

  } else {
    throw new NotFoundException('Usuário não encontrado no request. Use o AuthGuard nesta rota para obter o usuario')
  }

})