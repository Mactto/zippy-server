import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto) {
    const { albumId } = createPhotoDto;

    const album = await this.albumRepository.findOneBy({ id: albumId });

    const photo = new Photo();

    photo.upload_url = 'test';
    photo.album = album;

    await this.photoRepository.save(photo);

    return photo.id;
  }

  async findAll(filter_album_id: string | null, skip: number, count: number) {
    const query = this.photoRepository.createQueryBuilder('photo');

    if (filter_album_id !== null) {
      query.where('photo.album.id = :filter_album_id', {
        filter_album_id,
      });
    }

    query.skip(skip).take(count);

    return await query.getMany();
  }

  async count(filter_album_id: string | null) {
    const query = this.photoRepository.createQueryBuilder('photo');

    if (filter_album_id !== null) {
      query.where('photo.album.id = :filter_album_id', {
        filter_album_id,
      });
    }

    return await query.getCount();
  }

  async findOne(id: string) {
    const photo = await this.photoRepository.findOneBy({ id });

    if (!photo) {
      throw new NotFoundException();
    }

    return photo;
  }

  async remove(id: string) {
    const photo = await this.photoRepository.findOneBy({ id });

    if (!photo) {
      throw new NotFoundException();
    }

    await this.photoRepository.delete(photo.id);

    return {};
  }
}
