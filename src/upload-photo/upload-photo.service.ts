import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as fsProm from 'fs/promises';
import * as chokidarA from 'chokidar'
import * as path from 'path';
import { FSWatcher } from 'fs';
import { Stats } from 'node:fs';

import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { UpdateUploadPhotoDto } from './dto/update-upload-photo.dto';
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { Chapter, ChapterDocument } from './chapter-schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoDocument } from './video-schema';
import { Video } from './video-schema';

@Injectable()
export class UploadPhotoService implements OnModuleInit {

  watcher: FSWatcher;
  rootFolder = './files';
  ignored = ['files/father', 'files/mother', 'files/Evgen', 'files/Igor', 'files/Eva', 'files/Vasya', 'files/Dina', 'files/grandfather', 'files/grandmother'];

  constructor(
    @InjectModel('Gallery') private readonly gallery: Model<GalleryDocument>,
    @InjectModel('Chapter') private readonly chapter: Model<ChapterDocument>,
    @InjectModel('Video') private readonly video: Model<VideoDocument>,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.seeFolder();
    this.watcher.on('addDir', async (folder, a) => {

      const parentToId = new Map<string, string>();

      let upperLevel = folder.replace(/\\/g, '/').replace(/^files\//, '');
      let parent: string;

      if (upperLevel.includes("/")) {
        let lastIndex = upperLevel.lastIndexOf("/");
        parent = upperLevel.substring(0, lastIndex).split("/").pop();
      }

      let parentId: string;

      if (parent) {
        let hasValue = false;
        for (const [key, value] of parentToId.entries()) {
          if (value === parent) {
            hasValue = true;
            break;
          }
        }

        console.log('PARENT_BY__TO__GET____', parent)
        const parentResp = await this.getChapterByName(parent);

        console.log('parentResp___________________', parentResp)
        parentId = parentResp._id.toString();
        console.log('PARENT___ID______________', parentId)
        parentToId.set(parent, parentId);
      }

      console.log('FOLDER____1', upperLevel);


      const createChapterUpperLevel: CreateChapterDto = {
        title: upperLevel.replace(/^.*\//, ''),
        readable_id: upperLevel.replace(/^.*\//, ''),
        nameForUI: upperLevel.replace(/^.*\//, ''),
        fullPath: upperLevel,
        parent: parentId ? parentId : '',
      }

      console.log('TODO_CREATE_________________', createChapterUpperLevel);

      try {
        const upperLevelChapter = await this.createChapterByFolder(createChapterUpperLevel);
        console.log('CREATED___UPPER____LEVEL____CHAPTER____', upperLevelChapter)

      } catch (e) {
        console.error('created_____ERROR', e);
      }

      await this.getAllFiles(folder);
    });
    this.watcher.on('ready', () => console.log('watching for changes'));
  }

  private async seeFolder(): Promise<void> {
    this.watcher = chokidarA.watch(
      this.rootFolder,
      { ignoreInitial: true, ignored: this.ignored.map(f => `${f}/**`) }
    );
  }

  private replaceUkrainianLettersWithEnglish(string: string, mapping: string): string {
    const ukrLetters: string[] = Object.values(mapping).map((letter: string) => letter.toLowerCase());
    const englishLetters: string[] = Object.keys(mapping);

    let result = '';

    for (let i = 0; i < string.length; i++) {
      const letterIndex = ukrLetters.indexOf(string[i].toLowerCase());
      if (letterIndex !== -1) {
        const replacement = englishLetters[letterIndex];
        if (string[i] === string[i].toUpperCase()) {
          result += replacement.toUpperCase();
        } else {
          result += replacement;
        }
      } else {
        result += string[i];
      }
    }

    return result;
  }

  private async getAllFiles(folder) {
    let allFiles: string[];

    try {
      allFiles = await fsProm.readdir(folder);
    } catch (e) {
      console.error('ERROR_WHILE_READ_DIR__', JSON.stringify(e));
    }

    if (allFiles.length) {
      console.log('ALL_FILES___________:', allFiles);

      for (const fileOrFolder of allFiles) {

        console.group(`start------${fileOrFolder}`)
        let metaInfo: Stats;
        const pathToFileOrFolder = path.join(folder, fileOrFolder).replace(/\\/g, "/").replace(/^files\//, '');
        const pathToFileOrFolderToCheck = path.join(folder, fileOrFolder).replace(/\\/g, "/");
        console.log('PATH______________________________________', pathToFileOrFolder);

        try {
          metaInfo = await fsProm.stat(pathToFileOrFolderToCheck);
        } catch (e) {
          console.error('ERROR_WHILE_GETTING_INFO_ABOUT_FOLDER/FILE', JSON.stringify(e));
        }

        const isDirectory = metaInfo.isDirectory();
        console.log('IS_DIRECTORY____', isDirectory);
        if (!isDirectory) {
          // const relativePath = path.relative(this.rootFolder, pathToFileOrFolder).replace(/\\/g, "/").replace(/^files\//, '');
          console.log('Image______________:', pathToFileOrFolder);

          let chapterName: string;
          let chapterId: string;

          if (pathToFileOrFolder.includes("/")) {
            let lastIndex = pathToFileOrFolder.lastIndexOf("/");
            chapterName = pathToFileOrFolder.substring(0, lastIndex).split("/").pop();
          } else {
            chapterName = pathToFileOrFolder;
          }

          try {
            const chapter = await this.getChapterByName(chapterName);
            console.log('CHAPTER__FOR__IMAGE____', chapter);
            chapterId = chapter._id.toString();
          } catch (e) {

          }



          let fullPath: string;

          let lastIndex = pathToFileOrFolder.lastIndexOf("/");
          if (lastIndex !== -1) {
            fullPath = pathToFileOrFolder.substring(0, lastIndex);
            console.log(fullPath);
          } else {
            fullPath = pathToFileOrFolder;
          }
          let photoName = pathToFileOrFolder.replace(/^.*\//, '');
          console.log('BEFORE____', photoName)
          // photoName = Buffer.from(photoName, 'latin1').toString('utf8');
          const createPhotoDTO: CreateUploadPhotoDto = {
            fullPath,
            title: pathToFileOrFolder.replace(/^.*\//, ''),
            name: photoName,
            chapter: chapterId

          }
          let resp;
          try {
            resp = await this.uploadPhoto(createPhotoDTO);
          } catch (e) {

          }
        }
        console.groupEnd();
      }
    }
  }

  async uploadPhoto(addPhotoDto: CreateUploadPhotoDto, fileName?: string) {
    if (fileName) {
      addPhotoDto.name = fileName;
    }

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

  async createChapterByFolder(createChapter: CreateChapterDto): Promise<Chapter> {
    const galleryE = new this.chapter(createChapter);

    console.log('BEFORE___CREATE________________', galleryE)
    let newChapter;
    try {
      newChapter = await galleryE.save();
    } catch (e) {
      console.error('Unable create chapter!');
    }

    return newChapter;
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
            // this.watcher.removeListener()
          }
        }
      } catch (e) {
        console.error('ERROR__________________________', e);
      }
    }

    return newChapter;

    // const allChapters = await this.getAllChapters();
    //
    //
    // return allChapters;
  }

  async getAllChapters() {
    let result;
    try {
      result = await this.chapter.find().exec();
    } catch (e) {
      console.error('CHAPTERS___ERROR_RR____', JSON.stringify(e));
    }

    // console.log('CHAPTERS__SUCCESS________', result);


    return result;
  }

  async getChapterByName(name: string): Promise<CreateChapterDto> {
    let result;
    try {
      result = await this.chapter.find({ title: name }).exec();
    } catch (e) {
      console.error('CHAPTERS___ERROR_RR____', JSON.stringify(e));
    }

    console.log('CHAPTER__SUCCESS__BY____NAME______', result);


    return result[0];
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

  async findAllVideos(chapter: string): Promise<Video[]> {
    let result;

    try {
      result = await this.video.find({ chapter }).exec();
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
