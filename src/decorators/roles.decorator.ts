import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const ROLES_KEY = 'roles'
//nao entendi esse decorator... mas é para indicar que uma rota so pode acessar se for de um determinado Role
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)