import { Module } from '@nestjs/common';
import { UploadPhotoService } from './upload-photo.service';
import { UploadPhotoController } from './upload-photo.controller';

@Module({
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService],
})
export class UploadPhotoModule {}
