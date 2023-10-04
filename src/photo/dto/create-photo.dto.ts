import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty()
  @IsString()
  albumId: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  filePaths: string[];
}
