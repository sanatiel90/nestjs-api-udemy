import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { MailerService } from "@nestjs-modules/mailer/dist";

@Injectable()
export class AuthService {

  private issuer = 'loginMinhaApi'
  private audience = 'myusers'

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) { }

  createToken(user: User) {
    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email
    },
      {
        expiresIn: '7 days',
        subject: String(user.id),
        issuer: this.issuer, //info opcional, quem esta enviando
        audience: this.audience //info opcional, pra quem esta enviando
      })

    return { accessToken: token }
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch (e) {
      return false
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos')
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('E-mail ou senha incorretos')
    }

    //retorna o token de autenticacao
    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email
      }
    })

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto')
    }

    const token = this.jwtService.sign({
      id: user.id,
    }, {
      expiresIn: '30 minutes',
      subject: String(user.id),
      issuer: 'forget',
      audience: 'users'
    })

    await this.mailerService.sendMail({
      subject: 'Recuperação de senha',
      to: 'sanat@email.com',
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    })

    return true
  }

  async reset(password: string, token: string) {

    try {
      const data: any = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users'
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token inválido')
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt)

      const user = await this.prismaService.user.update({
        where: {
          id: Number(data.id)
        },
        data: {
          password
        }
      })

      return this.createToken(user)

    } catch (e) {
      throw new BadRequestException(e)
    }

  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data)

    return this.createToken(user);
  }

}