import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty()
  @IsString()
  fullname?: string;
}
