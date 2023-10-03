import { IsEmail } from 'class-validator';
import { Album } from 'src/album/entities/album.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  fullname: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  password: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date | null;

  @OneToMany(() => Album, (album) => album.account)
  albums: Album[];
}
