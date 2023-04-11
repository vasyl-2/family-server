import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    AuthModule,
    UploadPhotoModule,
    MongooseModule.forRoot('mongodb://localhost:27017/gallery'),
    AuthModule,
    MulterModule.register({
      dest: './files',
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
