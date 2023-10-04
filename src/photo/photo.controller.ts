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
    const { albumId, filePaths } = createPhotoDto;

    const presignedUrls = await this.awsService.generatePresignedUrls(
      albumId,
      filePaths,
    );

    return { presignedUrls };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('filter_album_id') filter_album_id: string | null,
    @Query('skip') skip: number,
    @Query('count') count: number,
  ) {
    return this.photoService.findAll(filter_album_id, skip, count);
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
