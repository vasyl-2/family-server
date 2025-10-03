import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import * as fs from 'fs';
import * as fsProm from 'fs/promises';
// import * as chokidarA from 'chokidar'
import { WatchOptions, watch } from 'chokidar';
import * as path from 'path';
// import { FSWatcher } from 'fs';
import { Stats, FSWatcher, existsSync, mkdirSync } from 'node:fs';
import { fileTypeFromFile } from 'file-type';

import { CreateUploadPhotoDto } from './dto/create-upload-photo.dto';
import { Gallery, GalleryDocument } from './gallery.schema';
import { CreateChapterDto } from './dto/create-chapter';
import { Chapter, ChapterDocument } from './chapter-schema';
import { VideoDocument } from './video-schema';
import { Video } from './video-schema';
import { DocDocument } from './doc.schema';


@Injectable()
export class UploadPhotoService implements OnModuleInit {

  private watcher: FSWatcher;

  // rootFolder = 'files';
  private rootFolder = process.env.FILE_PATH;
  // rootFolder =  `N:\\Users\\HP\\files`;

  private ignored = [
    `${process.env.FILE_PATH_ROW}/father`,
    `${process.env.FILE_PATH_ROW}/mother`,
    `${process.env.FILE_PATH_ROW}/Evgen`,
    `${process.env.FILE_PATH_ROW}/Igor`,
    `${process.env.FILE_PATH_ROW}/Eva`,
    `${process.env.FILE_PATH_ROW}/Vasya`,
    `${process.env.FILE_PATH_ROW}/Dina`,
    `${process.env.FILE_PATH_ROW}/grandfather`,
    `${process.env.FILE_PATH_ROW}/grandmother`,
  ];
  // ignored = [`N:/Users/HP/files/father`, `N:/Users/HP/files/mother`, `N:/Users/HP/files/Evgen`, `N:/Users/HP/files/Igor`, `N:/Users/HP/files/Eva`, `N:/Users/HP/files/Vasya`, `N:/Users/HP/files/Dina`, `N:/Users/HP/files/grandfather`, `N:/Users/HP/files/grandmother`];

  constructor(
    @InjectModel('Gallery') private readonly gallery: Model<GalleryDocument>,
    @InjectModel('Chapter') private readonly chapter: Model<ChapterDocument>,
    @InjectModel('Video') private readonly video: Model<VideoDocument>,
    @InjectModel('Doc') private readonly pdf: Model<DocDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seeFolder();
    console.log('ROOTFOLDER!!!', this.rootFolder);
    console.log('PWD', process.env.PWD);

    this.watcher.on('addDir', async (folder) => {

      console.log('FOLDER____', folder);

      const parentToId = new Map<string, string>();

      let upperLevel: string;

      if (process.env.FILE_PATH.includes('/usr/src/app/files')) {
        upperLevel = folder.replace(/^\/usr\/src\/app\/files\//, '');
      } else {
        upperLevel = folder
          .replace(/\\/g, '/')
          .replace(/^N:\/Users\/HP\/files\//, '');
      }

      let parent: string;

      if (upperLevel.includes('/')) {
        const lastIndex = upperLevel.lastIndexOf('/');
        parent = upperLevel.substring(0, lastIndex).split('/').pop();
      }

      let parentId: string;

      if (parent) {
        for (const [key, value] of parentToId.entries()) {
          if (value === parent) {
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

  private getConfigForWatcher(): WatchOptions {
    return process.env.FILE_PATH.includes('/usr/src/app/files') ? {
      ignoreInitial: true,
      ignored: this.ignored.map((f) => `${f}/**`),
      awaitWriteFinish: true,
    } : {
      ignoreInitial: true,
      ignored: this.ignored.map((f) => `${f}/**`),
      awaitWriteFinish: true,
      persistent: true,
      usePolling: true,
      interval: 100,
      binaryInterval: 300,
    }
  }
  private async seeFolder(): Promise<void> {
    this.watcher = watch(this.rootFolder, this.getConfigForWatcher());
  }

  private replaceUkrainianLettersWithEnglish(
    string: string,
    mapping: string,
  ): string {
    const ukrLetters: string[] = Object.values(mapping).map((letter: string) =>
      letter.toLowerCase(),
    );
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
      console.log('allFiles', allFiles);
    } catch (e) {
      console.error('ERROR_WHILE_READ_DIR__', JSON.stringify(e));
    }

    if (allFiles.length) {

      for (const fileOrFolder of allFiles) {

        let metaInfo: Stats;
        let pathToFileOrFolder = path.join(folder, fileOrFolder);
        let pathToFileOrFolderToCheck = path.join(folder, fileOrFolder)

        if (process.env.FILE_PATH.includes('/usr/src/app/files')) {
          pathToFileOrFolder = pathToFileOrFolder.replace(
            /^\/usr\/src\/app\/files\//,
            '',
          );
        } else {
          pathToFileOrFolder = pathToFileOrFolder
            .replace(/\\/g, '/')
            .replace(/^N:\/Users\/HP\/files\//, '');

          pathToFileOrFolderToCheck = pathToFileOrFolderToCheck.replace(
            /\\/g,
            '/',
          );
        }

        try {
          metaInfo = await fsProm.stat(pathToFileOrFolderToCheck);
        } catch (e) {
          console.error(
            'ERROR_WHILE_GETTING_INFO_ABOUT_FOLDER/FILE',
            JSON.stringify(e),
          );
        }

        const isDirectory = metaInfo.isDirectory();
        if (!isDirectory) {
          // const fileType = await fileTypeFromFile(`N:/Users/HP/files/${pathToFileOrFolder}`);
          const fileType = await fileTypeFromFile(
            `${process.env.FILE_PATH_ROW}/${pathToFileOrFolder}`,
          );

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

          const lastIndex = pathToFileOrFolder.lastIndexOf('/');
          if (lastIndex !== -1) {
            fullPath = pathToFileOrFolder.substring(0, lastIndex);
            console.log(fullPath);
          } else {
            fullPath = pathToFileOrFolder;
          }
          const photoName = pathToFileOrFolder.replace(/^.*\//, '');
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

  async updateVideo(updatedDto: CreateUploadPhotoDto) {
    const video = await this.video.findById(updatedDto._id);

    if (!video) {
      console.log('NO___VIDEO_____________');
      throw new Error('Video not found_________');
    }

    const isEqual = updatedDto.name === video.name;

    try {
      if (!isEqual) {
        // await fsProm.rename(`N:/Users/HP/files/${video.fullPath}/${video.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
        await fsProm.rename(
          `${process.env.FILE_PATH_ROW}/${video.fullPath}/${video.name}`,
          `${process.env.FILE_PATH_ROW}/${updatedDto.fullPath}/${updatedDto.name}`,
        );
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
        // await fsProm.rename(`N:/Users/HP/files/${photo.fullPath}/${photo.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
        await fsProm.rename(
          `${process.env.FILE_PATH_ROW}/${photo.fullPath}/${photo.name}`,
          `${process.env.FILE_PATH_ROW}/${updatedDto.fullPath}/${updatedDto.name}`,
        );
      }
      await this.gallery.updateOne({ _id: updatedDto._id }, updatedDto).exec();
    } catch (e) {
      console.log('ERROR_UPDATE_', JSON.stringify(e));
    }

    return updatedDto;
  }

  async updatePdf(updatedDto: CreateUploadPhotoDto) {

    const pdf = await this.pdf.findById(updatedDto._id);
    if (!pdf) {
      console.log('NO___PDF_____________');
      throw new Error('Pdf not found_________');
    }

    const isEqual = updatedDto.name === pdf.name;

    try {
      if (!isEqual) {
        // await fsProm.rename(`N:/Users/HP/files/${pdf.fullPath}/${pdf.name}`, `N:/Users/HP/files/${updatedDto.fullPath}/${updatedDto.name}`);
        await fsProm.rename(
          `${process.env.FILE_PATH_ROW}/${pdf.fullPath}/${pdf.name}`,
          `${process.env.FILE_PATH_ROW}/${updatedDto.fullPath}/${updatedDto.name}`,
        );
      }
      await this.pdf.updateOne({ _id: updatedDto._id }, updatedDto).exec();
    } catch (e) {
      console.log('ERROR_UPDATE_', JSON.stringify(e));
    }

    return updatedDto;
  }

  // upload

  async uploadPhoto(addPhotoDto: CreateUploadPhotoDto, fileName?: string) {
    if (fileName) {
      addPhotoDto.name = fileName;
    }

    const media = new this.gallery(addPhotoDto);
    return await media.save();
  }

  async uploadVideo(addVideoDto: CreateUploadPhotoDto, fileName?: string) {
    if (fileName) {
      addVideoDto.name = fileName;
    }

    const media = new this.video(addVideoDto);
    return await media.save();
  }

  async uploadDoc(addDocDto: CreateUploadPhotoDto, fileName?: string) {
    if (fileName) {
      addDocDto.name = fileName;
    }

    const media = new this.pdf(addDocDto);
    return await media.save();
  }

  async createChapterByFolder(
    createChapter: CreateChapterDto,
  ): Promise<Chapter> {
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
          if (!existsSync(`${process.env.FILE_PATH_ROW}/${fullPath}`)){
            mkdirSync(`${process.env.FILE_PATH_ROW}/${fullPath}`);
          }
          // if (!existsSync(`N:/Users/HP/files/${fullPath}`)){
          //   mkdirSync(`N:/Users/HP/files/${fullPath}`);
          // }
        } else {
          if (!existsSync(`${title}`)){
            // mkdirSync(`N:/Users/HP/files/${title}`);
            mkdirSync(`${process.env.FILE_PATH_ROW}/${title}`);
            // this.watcher.removeListener()
          }
        }
      } catch (e) {
        console.error('ERROR______', JSON.stringify(e));
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

  async findAllDocs(chapter: string): Promise<Gallery[]> {
    let result;

    try {
      result = await this.pdf.find({ chapter }).exec();
      console.log('PDFS_FOUND__', result);
    } catch (e) {
      console.error('findAllDocs', JSON.stringify(e));
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
