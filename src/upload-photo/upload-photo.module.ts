import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UploadPhotoService } from './upload-photo.service';
import { UploadPhotoController } from './upload-photo.controller';
import { GallerySchema, Gallery } from './gallery.schema';
import { Chapter, ChapterSchema } from './chapter-schema';
import { PhotoValidatorService } from './photo-validator/photo-validator.service';
import { AuthModule } from '../auth/auth.module';
import { Video, VideoSchema } from './video-schema';
import { VideoChapter, VideoChapterSchema } from './video-chapter-schema';
import { PermissionGuard } from '../auth/guards/permission.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: VideoChapter.name, schema: VideoChapterSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    JwtModule,
    AuthModule
  ],
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService, PhotoValidatorService]
})
export class UploadPhotoModule {}
