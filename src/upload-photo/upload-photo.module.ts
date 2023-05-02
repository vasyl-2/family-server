import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadPhotoService } from './upload-photo.service';
import { UploadPhotoController } from './upload-photo.controller';
import { GallerySchema, Gallery } from './gallery.schema';
import { ChapterSchema } from './chapter-schema';
import { PhotoValidatorService } from './photo-validator/photo-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
  ],
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService, PhotoValidatorService],
  exports: [],
})
export class UploadPhotoModule {}
