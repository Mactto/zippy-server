import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('bulk')
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
  }

  @Get()
  findAll(
    @Query('filter_album_id') filter_album_id: string | null,
    @Query('skip') skip: number,
    @Query('count') count: number,
  ) {
    return this.photoService.findAll(filter_album_id, skip, count);
  }

  @Get('count')
  count(@Query('filter_album_id') filter_album_id: string | null) {
    return this.photoService.count(filter_album_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}
