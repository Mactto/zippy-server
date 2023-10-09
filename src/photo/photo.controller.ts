import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AwsService } from 'src/aws/aws.service';

@ApiTags('photo')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly awsService: AwsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  async create(@Body() createPhotoDto: CreatePhotoDto) {
    const presignedUrls =
      await this.awsService.generatePresignedUrls(createPhotoDto);

    await this.photoService.create(createPhotoDto);

    return { presignedUrls };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'filter_album_id', required: false })
  async findAll(
    @Query('skip') skip: number,
    @Query('count') count: number,
    @Query('filter_album_id') filter_album_id?: string,
  ) {
    const photos = await this.photoService.findAll(
      filter_album_id,
      skip,
      count,
    );

    const resulrPhotos = photos.map((photo) => ({
      ...photo,
      uploadUrl: photo.uploadUrl,
    }));

    return resulrPhotos;
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  count(@Query('filter_album_id') filter_album_id: string | null) {
    return this.photoService.count(filter_album_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}
