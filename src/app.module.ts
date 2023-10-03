import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { AlbumModule } from './album/album.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // synchronize is must set False in production
      }),
    }),
    AccountModule,
    AuthModule,
    AlbumModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
