import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { Chapter, ChapterDocument } from './chapter-schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoDocument } from './video-schema';


@Injectable()
export class UploadPhotoService {

  constructor(
    @InjectModel('Gallery') private readonly gallery: Model<GalleryDocument>,
    @InjectModel('Chapter') private readonly chapter: Model<ChapterDocument>,
    @InjectModel('Video') private readonly video: Model<VideoDocument>,
  ) {}

  async uploadPhoto(addPhotoDto: CreateUploadPhotoDto, fileName: string) {
    addPhotoDto.name = fileName;
    console.log('PHOTO__TO___SAVE____', addPhotoDto);

    const galleryE = new this.gallery(addPhotoDto);
    const result = await galleryE.save();

    return result;
  }

  async updatePhoto(updatedDto: CreateUploadPhotoDto) {

    console.log('PHOTO__TO___SAVE____', updatedDto);

    let result;
    // result = await this.gallery.updateOne({ _id: updatedDto._id }, updatedDto).exec();
    try {
      result = await this.gallery.updateOne({ _id: updatedDto._id }, updatedDto).exec();
      console.log('RESULT___UPDATE______', result);
    } catch (e) {
      console.log('ERROR___WHILE___UPDATE______', JSON.stringify(e));
    }

    return updatedDto;
  }

  async uploadVideo(addVideoDto: CreateVideoDto, fileName: string) {
    addVideoDto.name = fileName;
    console.log('VIDEO__TO___SAVE____', addVideoDto);

    const vid = new this.video(addVideoDto);
    const result = await vid.save();

    return result;
  }

  async createChapter(createChapter: CreateChapterDto) {
    const galleryE = new this.chapter(createChapter);
    let newChapter;
    try {
      newChapter = await galleryE.save();
    } catch (e) {
      console.error('Unable create chapter!');
    }

    if (newChapter) {
      const { title } = newChapter;
      try {
        if (newChapter.parent) {
          const { fullPath } = newChapter;
          if (!fs.existsSync(`${process.cwd()}/files/${fullPath}`)){
            fs.mkdirSync(`${process.cwd()}/files/${fullPath}`);
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

  async findAll(chapter: string): Promise<Gallery[]> {
    let result;

    try {
      result = await this.gallery.find({ chapter }).exec();
    } catch (e) {
      console.error('ERROR____', e);
    }

    return result.map((p) => {
      return p._doc;
    });
  }

  async findPhotosFiles(chapter) {
    const result = await this.gallery.find({ chapter }).exec();

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
