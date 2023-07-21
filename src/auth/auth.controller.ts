import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user-decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { writeFile } from "fs/promises";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() body: AuthForgetDTO) {
    const { email } = body
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO) {
    const { password, token } = body
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard) //guards servem para fazer uma verificacao antes da rota ser realmente ativada, permitindo ou nao o acesso a rota
  @Post('me')
  async me(@User() user) {
    //return this.authService.checkToken(token.split(' ')[1])
  }

  @UseInterceptors(FileInterceptor('file')) //para capturar o arquivo enviado, usando multer
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(new ParseFilePipe({ //usando pipe ParseFilePipe para fazer validacoes no arquivo q vai ser recebido
      validators: [
        new FileTypeValidator({
          fileType: 'image/png' //tipo do arquivo
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 20 //maximo 20 KB
        })
      ]
    })) photo: Express.Multer.File) {
    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`);

    try {
      await this.fileService.upload(photo, path)
    } catch (e) {
      throw new BadRequestException(e)
    }

    return { sucess: true }
  }


  ///ABAIXO TEM 2 FORMAS DE RECEBIMENTO DE MULTIPLOS ARQUIVOS
  //nessa forma captura mais de um arquivo enviado no body como 'files'
  @UseInterceptors(FilesInterceptor('files')) //para capturar os arquivos enviados, usando multer
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
    return files
  }

  //nessa forma captura um conjunto de arquivos definidos no body com names diferentes (nesse exemplo, 1 arquivo com name 'photo' e ate 10 arquivos com name 'documents')
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 1
  }, {
    name: 'documents',
    maxCount: 10
  }]))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFilesFields(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, documents: Express.Multer.File[] }) {
    return files
  }
}