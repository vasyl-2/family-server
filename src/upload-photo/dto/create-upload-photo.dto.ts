export class CreateUploadPhotoDto {
  _id?: string;
  title: string;
  description?: string;
  chapter?: string;
  name?: string;
  fullPath?: string;
  date?: Date;
  type?: 'photo' | 'video' | 'pdf';
}

