import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as fsProm from 'fs/promises';

import * as path from 'path';

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

    const photo = await this.gallery.findById(updatedDto._id);
    console.log('PHOTO_____________', photo);
    if (!photo) {
      console.log('NO___PHOTO_____________');
      throw new Error('Photo not found_________');
    }
    console.log('PHOTO__TO___SAVE____', updatedDto);

    let result;
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = updatedDto.name.split('.').pop();
      let nameWithoutExtension = this.removeExtension(updatedDto.name);

      updatedDto.name = `${nameWithoutExtension}-${uniqueSuffix}.${extension}`;


      await fsProm.rename(`files/${photo.fullPath}/${photo.name}`, `files/${updatedDto.fullPath}/${updatedDto.name}`);


      result = await this.gallery.updateOne({ _id: updatedDto._id }, updatedDto).exec();
      console.log('RESULT___RENAMED_______________', result);

    } catch (e) {
      console.log('ERROR___WHILE___UPDATE______', JSON.stringify(e));
    }

    return updatedDto;
  }

  private removeExtension(imageString) {
    const lastDotIndex = imageString.lastIndexOf('.');
    if (lastDotIndex === -1) {
      // If there's no dot in the string, return the original string
      return imageString;
    } else {
      // Return the substring from the start of the string to the last dot
      return imageString.substring(0, lastDotIndex);
    }
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
      console.log('ALL___RESULTTSS________', result)
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
