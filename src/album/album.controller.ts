import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('album')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return await this.albumService.create(createAlbumDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'filter_account_id', required: false })
  findAll(
    @Query('skip') skip: number,
    @Query('count') count: number,
    @Query('filter_account_id') filter_account_id?: string,
  ) {
    return this.albumService.findAll(filter_account_id, skip, count);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  count(@Query('filter_account_id') filter_account_id?: string) {
    return this.albumService.count(filter_account_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}
