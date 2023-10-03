import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, id: string) {
    const { title } = createAlbumDto;

    const account = await this.accountRepository.findOneBy({ id });

    const album = new Album();
    album.title = title;
    album.account = account;

    await this.albumRepository.save(album);

    return album.id;
  }

  async findAll(filter_account_id: string | null, skip: number, count: number) {
    const query = this.albumRepository.createQueryBuilder('album');

    if (filter_account_id !== null) {
      query.where('album.account.id = :filter_account_id', {
        filter_account_id,
      });
    }

    query.skip(skip).take(count);

    return await query.getMany();
  }

  async count(filter_account_id: string | null) {
    const query = this.albumRepository.createQueryBuilder('album');

    if (filter_account_id !== null) {
      query.where('album.account.id = :filter_account_id', {
        filter_account_id,
      });
    }

    return await query.getCount();
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    const { title } = updateAlbumDto;

    album.title = title;

    await this.albumRepository.save(album);

    return album.id;
  }

  async remove(id: string) {
    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    await this.albumRepository.delete(album.id);

    return {};
  }
}
