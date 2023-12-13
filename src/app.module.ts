import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    UploadPhotoModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/gallery'), // localhost
    AuthModule,
    MulterModule.register({
      // dest: './files',
      dest: process.env.FILE_PATH,
    }),
    // MulterModule.registerAsync({
    //   useFactory: () => ({
    //     dest: './upload',
    //   }),
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      exclude: ['/api/(.*)'],
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    // MongooseModule.forRoot('mongodb+srv://vasya:bawnrRMjhiU84ZNH@cluster0.3lzisnz.mongodb.net/test'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// bawnrRMjhiU84ZNH
