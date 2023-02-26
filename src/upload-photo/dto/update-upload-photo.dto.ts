import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadPhotoDto } from './create-upload-photo.dto';

export class UpdateUploadPhotoDto extends PartialType(CreateUploadPhotoDto) {}
