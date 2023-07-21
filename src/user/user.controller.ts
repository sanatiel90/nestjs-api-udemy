import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UserService } from "./user.service";
import { Role } from "src/enums/role.enum";
import { Roles } from "src/decorators/roles.decorator";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { ThrottlerGuard } from "@nestjs/throttler";

@UseGuards(ThrottlerGuard, AuthGuard, RoleGuard) //usando esses guards no controler; ThrottlerGuard é um guard de uma lib para evitar ataques de força bruta na app
@UseInterceptors(LogInterceptor)  //usando interceptors nesse controller
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(Role.Admin, Role.User)
  @Get()
  list() {
    return this.userService.list();
  }

  @Roles(Role.Admin)
  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) { //ParseIntPipe pipe de transform: vai converter o param ID em Integer, se nao for passado um valor int nesse param, vai responder com erro
    return this.userService.show(id)
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() body: CreateUserDTO) {
    return this.userService.create(body)
  }

  @Roles(Role.Admin)
  @Put(':id')
  update(@Body() body: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(body, id)
  }

  @Roles(Role.Admin)
  @Patch(':id')
  updatePartial(@Body() body: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
    return this.userService.updatePartial(body, id)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

}