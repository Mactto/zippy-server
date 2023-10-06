import { Album } from 'src/album/entities/album.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['albumId', 'filename'])
@Index('idx_albumId', ['albumId'])
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  imageType: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date | null;

  @Column()
  albumId: string;

  @ManyToOne(() => Album, (album) => album.photos)
  @JoinColumn({ name: 'albumId' })
  album: Album;

  get uploadUrl(): string {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${this.albumId}/${this.filename}`;
  }
}
