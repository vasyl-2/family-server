import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { ChapterDocument } from './chapter-schema';
import * as fs from 'fs';

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
    let newChapter;

    console.log('PWD______________', process.cwd());

    try {
      newChapter = await galleryE.save();
    } catch (e) {
      console.error('Unable create chapter!');
    }

    if (newChapter) {
      const { title } = newChapter;
      try {
        if (newChapter.parent) {
          const { parentTitle } = newChapter;
          if (!fs.existsSync(`${process.cwd()}/files/${parentTitle}/${title}`)){
            fs.mkdirSync(`${process.cwd()}/files/${parentTitle}/${title}`);
          }
        } else {
          if (!fs.existsSync(`${title}`)){
            fs.mkdirSync(`${process.cwd()}/files/${title}`);
          }
        }
      } catch (e) {
        console.error('ERROR__________________________', e);
      }
    }

    const allChapters = await this.getAllChapters();


    return allChapters;
  }

  async getAllChapters() {
    const result = await this.chapter.find().exec();
    return result;
  }

  create(createUploadPhotoDto: CreateUploadPhotoDto) {
    return 'This action adds a new uploadPhoto';
  }

  async findAll() {

    const result = await this.gallery.find().exec();
    return result;
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
