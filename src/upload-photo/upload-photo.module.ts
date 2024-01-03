import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UploadPhotoService } from './upload-photo.service';
import { UploadPhotoController } from './upload-photo.controller';
import { GallerySchema, Gallery } from './gallery.schema';
import { ChapterSchema } from './chapter-schema';
import { PhotoValidatorService } from './photo-validator/photo-validator.service';
import { AuthModule } from '../auth/auth.module';
import { Video, VideoSchema } from './video-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    JwtModule,
    AuthModule
  ],
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService, PhotoValidatorService],
  exports: [],
})
export class UploadPhotoModule {}
