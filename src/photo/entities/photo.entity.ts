import { Album } from 'src/album/entities/album.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  upload_url: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date | null;

  @Column()
  albumId: string;

  @ManyToOne(() => Album, (album) => album.photos)
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
