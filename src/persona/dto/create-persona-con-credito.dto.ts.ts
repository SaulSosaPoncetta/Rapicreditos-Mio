import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreatePersonaDto } from './create-persona.dto';
import { CreateCreditoDto } from 'src/credito/dto/create-credito.dto';

export class CreatePersonaConCreditoDto {
  @ValidateNested()
  @Type(() => CreatePersonaDto)
  persona: CreatePersonaDto;

  @ValidateNested()
  @Type(() => CreateCreditoDto)
  credito: CreateCreditoDto;
}
