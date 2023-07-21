import { IsString, IsEmail, IsStrongPassword, IsDate, IsOptional, IsDateString, IsEnum } from "class-validator"; //pipes de validacao de dados
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {

  //@IsString() é um pipe de validacao de dados
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  birthAt: string

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number
}