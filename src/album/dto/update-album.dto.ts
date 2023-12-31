import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty()
  @IsString()
  title?: string;
}
