import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { ChapterDocument } from './chapter-schema';

@Injectable()
export class UploadPhotoService {

  constructor(
    @InjectModel('Gallery') private readonly gallery: Model<GalleryDocument>,
    @InjectModel('Chapter') private readonly chapter: Model<ChapterDocument>,
  ) {}

  async uploadPhoto(addPhotoDto: CreateUploadPhotoDto) {
    console.log('PHOTO__TO___SAVE____', addPhotoDto);

    const galleryE = new this.gallery(addPhotoDto);
    const result = await galleryE.save();

    return result;
  }

  async createChapter(createChapter: CreateChapterDto) {
    const galleryE = new this.chapter(createChapter);
    const result = await galleryE.save();

    return result;
  }

  create(createUploadPhotoDto: CreateUploadPhotoDto) {
    return 'This action adds a new uploadPhoto';
  }

  findAll() {
    return `This action returns all uploadPhoto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadPhoto`;
  }

  update(id: number, updateUploadPhotoDto: UpdateUploadPhotoDto) {
    return `This action updates a #${id} uploadPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadPhoto`;
  }
}
