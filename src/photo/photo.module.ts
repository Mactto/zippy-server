import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Album } from 'src/album/entities/album.entity';
import { AwsService } from 'src/aws/aws.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Album, Photo])],
  controllers: [PhotoController],
  providers: [PhotoService, AwsService],
})
export class PhotoModule {}
