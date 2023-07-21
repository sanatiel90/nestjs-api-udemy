import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create({ email, name, password, role }: CreateUserDTO) {

    //salt é o nivel de dificuldade do hash; vc pode colocar um numero qualquer, como 5, 10, 12, etc; quanto maior o numero, mais complexo (e seguro) o hash ficará
    //porém ao msm tempo, vai consumir mais recursos do servidor; a funcao genSalt() do bcrypt retorna um valor de salt recomendado pelo servidor sendo executado no momento
    //é melhor do que simplesmente colocar um numero aleatorio 
    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt)

    try {
      return await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword,
          role
        }
      })
    } catch (error) {
      throw new BadRequestException('Dados inválidos')
    }
  }

  async list() {
    return await this.prisma.user.findMany()
  }

  async show(id: number) {

    await this.exists(id)

    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async update(data: UpdatePutUserDTO, id: number) {

    await this.exists(id)

    const { name, email, password, birthAt, role } = data

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt)

    return await this.prisma.user.update({
      data: {
        name,
        email,
        password: hashPassword,
        birthAt: birthAt ? new Date(birthAt) : null,
        role
      },
      where: {
        id
      }
    })
  }

  async updatePartial(data: UpdatePatchUserDTO, id: number) {

    await this.exists(id)

    const { name, email, password, birthAt, role } = data

    let passwordUpd = password;

    if (passwordUpd) {
      const salt = await bcrypt.genSalt();
      passwordUpd = await bcrypt.hash(password, salt)
    }

    return await this.prisma.user.update({
      data: {
        name,
        email,
        password: passwordUpd,
        birthAt: birthAt ? new Date(birthAt) : null,
        role
      },
      where: {
        id
      }
    })
  }

  async delete(id: number) {

    await this.exists(id)

    return await this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  async exists(id: number) {
    if (!(await this.prisma.user.count({
      where: {
        id
      }
    }))) {
      throw new NotFoundException('Usuário não encontrado')
    }
  }
} 