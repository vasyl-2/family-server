import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadPhotoModule } from './upload-photo/upload-photo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UploadPhotoModule,
    MongooseModule.forRoot('mongodb://localhost:27017/gallery'),
    AuthModule,
    // MongooseModule.forRoot('mongodb+srv://vasya:bawnrRMjhiU84ZNH@cluster0.3lzisnz.mongodb.net/test'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// bawnrRMjhiU84ZNH
