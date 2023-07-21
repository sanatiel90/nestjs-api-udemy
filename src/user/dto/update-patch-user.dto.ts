import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.dto";

//PartialType: lib para poder modificar alguns atributos do DTO extendido; 
//com ele, os campos passados no DTO pai (CreateUserDTO) passam a nao ser mais obrigatorios aqui, mas se forem informados serao validados igual o DTO pai
//é indicado como dto de uma rota PATCH
export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {

}