import { Account } from 'src/account/entities/account.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity()
@Index('idx_accountId', ['accountId'])
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date | null;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.albums)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];
}
