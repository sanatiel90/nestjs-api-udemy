import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UserService } from 'src/user/user.service';

//guards servem para fazer uma verificacao antes da rota ser realmente ativada, permitindo ou nao o acesso a rota
@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly refletor: Reflector
  ) { }


  async canActivate(context: ExecutionContext) {

    //entendi foi nada... mas esta pegando as regras requeridas de acordo com os Decorator de Roles que foi colocado na rota
    const requiredRoles = this.refletor.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    //se nao foi definida regra de roles para a rota, simplesmente libera a requisicao
    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest();  //pega o user que esta na request

    const filteredRoles = requiredRoles.filter(role => role === user.role)

    return filteredRoles.length > 0;

  }
}