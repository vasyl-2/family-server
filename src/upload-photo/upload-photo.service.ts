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
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { Chapter, ChapterDocument } from './chapter-schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoDocument } from './video-schema';
import { Video } from './video-schema';
import { VideoChapterDocument } from './video-chapter-schema';
import { fileTypeFromFile } from 'file-type';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { DocDocument } from './doc.schema';

@Injectable()
export class UploadPhotoService implements OnModuleInit {

  watcher: FSWatcher;

  // rootFolder = './files';
  rootFolder =  `N:\\Users\\HP\\files`;

  // ignored = ['files/father', 'files/mother', 'files/Evgen', 'files/Igor', 'files/Eva', 'files/Vasya', 'files/Dina', 'files/grandfather', 'files/grandmother'];
  ignored = [`N:/Users/HP/files/father`, `N:/Users/HP/files/mother`, `N:/Users/HP/files/Evgen`, `N:/Users/HP/files/Igor`, `N:/Users/HP/files/Eva`, `N:/Users/HP/files/Vasya`, `N:/Users/HP/files/Dina`, `N:/Users/HP/files/grandfather`, `N:/Users/HP/files/grandmother`];

  constructor(
    @InjectModel('Gallery') private readonly gallery: Model<GalleryDocument>,
    @InjectModel('Chapter') private readonly chapter: Model<ChapterDocument>,
    @InjectModel('VideoChapter') private readonly videoChapter: Model<VideoChapterDocument>,
    @InjectModel('Video') private readonly video: Model<VideoDocument>,
    @InjectModel('Doc') private readonly pdf: Model<DocDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seeFolder();

    this.watcher.on('addDir', async (folder) => {

      const parentToId = new Map<string, string>();

      let upperLevel = folder.replace(/\\/g, '/').replace(/^N:\/Users\/HP\/files\//, '');

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

        let parentResp;

        try {
          parentResp = await this.getChapterByName(parent);
        } catch (e) {

        }

        parentId = parentResp._id.toString();
        parentToId.set(parent, parentId);
      }

      const createChapterUpperLevel: CreateChapterDto = {
        title: upperLevel.replace(/^.*\//, ''),
        readable_id: upperLevel.replace(/^.*\//, ''),
        nameForUI: upperLevel.replace(/^.*\//, ''),
        fullPath: upperLevel,
        parent: parentId ? parentId : '',
      }

      try {
        await this.createChapterByFolder(createChapterUpperLevel);
      } catch (e) {
        console.error('created', JSON.stringify(e));
      }

      setTimeout(async () => {
        await this.getAllFiles(folder);
      }, 40000)

    });

    this.watcher.on('ready', () => console.log('watching for changes'));
  }

  private async seeFolder(): Promise<void> {
    this.watcher = chokidarA.watch(
      this.rootFolder,
      { ignoreInitial: true,
        ignored: this.ignored.map(f => `${f}/**`),
        awaitWriteFinish: true
      }
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

      for (const fileOrFolder of allFiles) {

        let metaInfo: Stats;
        const pathToFileOrFolder = path.join(folder, fileOrFolder).replace(/\\/g, "/").replace(/^N:\/Users\/HP\/files\//, '');
        const pathToFileOrFolderToCheck = path.join(folder, fileOrFolder).replace(/\\/g, "/");

        try {
          metaInfo = await fsProm.stat(pathToFileOrFolderToCheck);
        } catch (e) {
          console.error('ERROR_WHILE_GETTING_INFO_ABOUT_FOLDER/FILE', JSON.stringify(e));
        }

        const isDirectory = metaInfo.isDirectory();
        if (!isDirectory) {
          const fileType = await fileTypeFromFile(`N:/Users/HP/files/${pathToFileOrFolder}`);

          if (!fileType) {
            continue;
          }
          const { mime } = fileType;

          if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
            continue;
          }

          let chapterName: string;
          let chapterId: string;

          if (pathToFileOrFolder.includes("/")) {
            let lastIndex = pathToFileOrFolder.lastIndexOf("/");
            chapterName = pathToFileOrFolder.substring(0, lastIndex).split("/").pop();
          } else {
            chapterName = pathToFileOrFolder;
          }

          let chapter;
          try {
            chapter = await this.getChapterByName(chapterName);
          } catch (e) {
            console.error('GET_CHAPTER__', JSON.stringify(e));
          }

          chapterId = chapter._id.toString();

          let fullPath: string;

          let lastIndex = pathToFileOrFolder.lastIndexOf("/");
          if (lastIndex !== -1) {
            fullPath = pathToFileOrFolder.substring(0, lastIndex);
            console.log(fullPath);
          } else {
            fullPath = pathToFileOrFolder;
          }
          let photoName = pathToFileOrFolder.replace(/^.*\//, '');
          const createMediaDTO: CreateUploadPhotoDto = {
            fullPath,
            title: pathToFileOrFolder.replace(/^.*\//, ''),
            name: photoName,
            chapter: chapterId
          }

          let resp;

          if (mime.startsWith('image/')) {
            try {
              resp = await this.uploadPhoto(createMediaDTO);
            } catch (e) {

            }
          } else if (mime.startsWith('video/')) {
            try {
              resp = await this.uploadVideo(createMediaDTO);
            } catch (e) {

            }
          }
        }
      }
    }
  }

  async updateVideo(updatedDto: CreateVideoDto) {
    const video = await this.video.findById(updatedDto._id);

    if (!video) {
      console.log('NO___VIDEO_____________');
      throw new Error('Video not found_________');
    }

    const isEqual = updatedDto.name === video.name;

    try {
      if (!isEqual) {
        await fsProm.rename(`N:/Users/HP/files/${video.fullPath}/${video.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
      }
      await this.video.updateOne({ _id: updatedDto._id }, updatedDto).exec();

    } catch (e) {
      console.log('ERROR_UPDATE_', JSON.stringify(e));
    }

    return updatedDto;
  }

  async updatePhoto(updatedDto: CreateUploadPhotoDto) {

    const photo = await this.gallery.findById(updatedDto._id);
    if (!photo) {
      console.log('NO___PHOTO_____________');
      throw new Error('Photo not found_________');
    }

    const isEqual = updatedDto.name === photo.name;

    try {
      if (!isEqual) {
        await fsProm.rename(`N:/Users/HP/files/${photo.fullPath}/${photo.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
      }
      await this.gallery.updateOne({ _id: updatedDto._id }, updatedDto).exec();
    } catch (e) {
      console.log('ERROR_UPDATE_', JSON.stringify(e));
    }

    return updatedDto;
  }

  async updatePdf(updatedDto: CreatePdfDto) {

    const pdf = await this.pdf.findById(updatedDto._id);
    if (!pdf) {
      console.log('NO___PDF_____________');
      throw new Error('Pdf not found_________');
    }

    const isEqual = updatedDto.name === pdf.name;

    try {
      if (!isEqual) {
        await fsProm.rename(`N:/Users/HP/files/${pdf.fullPath}/${pdf.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
      }
      await this.pdf.updateOne({ _id: updatedDto._id }, updatedDto).exec();
    } catch (e) {
      console.log('ERROR_UPDATE_', JSON.stringify(e));
    }

    return updatedDto;
  }

  async uploadPhoto(addPhotoDto: CreateUploadPhotoDto, fileName?: string) {
    console.log('PHOTO_TO_____', addPhotoDto);
    if (fileName) {
      addPhotoDto.name = fileName;
    }

    const media = new this.gallery(addPhotoDto);
    return await media.save();
  }

  async uploadVideo(addVideoDto: CreateVideoDto, fileName?: string) {
    if (fileName) {
      addVideoDto.name = fileName;
    }

    const media = new this.video(addVideoDto);
    return await media.save();
  }

  async uploadDoc(addDocDto: CreatePdfDto, fileName?: string) {
    if (fileName) {
      addDocDto.name = fileName;
    }

    const media = new this.pdf(addDocDto);
    console.log('PDF___ADDED___', media);
    return await media.save();
  }

  async createChapterByFolder(createChapter: CreateChapterDto): Promise<Chapter> {
    const chapterObject = new this.chapter(createChapter);

    let newChapter;
    try {
      newChapter = await chapterObject.save();
    } catch (e) {
      console.error('Unable create chapter!', JSON.stringify(e));
      throw e;
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
          if (!fs.existsSync(`N:/Users/HP/files/${fullPath}`)){
            fs.mkdirSync(`N:/Users/HP/files/${fullPath}`);
          }
        } else {
          if (!fs.existsSync(`${title}`)){
            fs.mkdirSync(`N:/Users/HP/files/${title}`);
            // this.watcher.removeListener()
          }
        }
      } catch (e) {
        console.error('ERROR______', JSON.stringify(e));
      }
    }

    return newChapter;
  }

  async createVideoChapter(createChapter: CreateChapterDto) {
    const videoChapters = new this.videoChapter(createChapter);
    let newChapter;
    try {
      newChapter = await videoChapters.save();
    } catch (e) {
      console.error('Unable to create video chapter!');
    }

    if (newChapter) {
      const { title } = newChapter;
      try {
        if (newChapter.parent) {
          const { fullPath } = newChapter;
          if (!fs.existsSync(`N:/Users/HP/files/videos/${fullPath}`)){
            fs.mkdirSync(`N:/Users/HP/files/videos/${fullPath}`);
          }
        } else {
          if (!fs.existsSync(`${title}`)){
            fs.mkdirSync(`N:/Users/HP/files/videos/${title}`);
            // this.watcher.removeListener()
          }
        }
      } catch (e) {
        console.error('ERROR__________________________', JSON.stringify(e));
      }
    }

    return newChapter;
  }

  async getAllChapters() {
    let result;
    try {
      result = await this.chapter.find().exec();
    } catch (e) {
      console.error('CHAPTERS___ERROR_RR____', JSON.stringify(e));
    }

    return result;
  }

  async getAllVideoChapters() {
    let result;
    try {
      result = await this.videoChapter.find().exec();
    } catch (e) {
      console.error('VIDEO_CHAPTERS___ERROR____', JSON.stringify(e));
    }

    return result;
  }

  async getChapterByName(name: string): Promise<CreateChapterDto> {
    let result;
    try {
      result = await this.chapter.find({ title: name }).exec();
    } catch (e) {
      console.error('CHAPTERS___ERROR_RR____', JSON.stringify(e));
    }

    return result[0];
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

  async findAllVideos(chapter: string): Promise<Video[]> {
    let result;

    try {
      result = await this.video.find({ chapter }).exec();
    } catch (e) {
      console.error('ERROR____', e);
    }

    return result.map((p) => {
      return p._doc;
    });
  }
}
