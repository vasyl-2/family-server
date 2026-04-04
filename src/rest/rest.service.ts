import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { RestInterface } from './rest.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import FormData from 'form-data';
import * as fsProm from 'fs/promises';
import axios from 'axios';
import { CreateUploadPhotoDto } from '../upload-photo/dto/create-upload-photo.dto';
import { join } from 'path';

@Injectable()
export class RestService implements RestInterface {

  // url = 'http://localhost:8000/extract-date/';
  url = 'http://127.0.0.1:8000/extract-date/';

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
  }

  async setDate(newDate: Date, pathToMedia: string) {
    let resp;

    const body = { newDate, pathToMedia };
    console.log('body', body);
    try {
      resp = await axios.post(`http://127.0.0.1:8000/set-date/`, body);
    } catch (e) {
      this.logger.error('setDate______', e);
    }

    return resp;
  }

  async setVideoDate(newDate: Date, pathToMedia: string) {
    let resp;

    const body = { newDate, pathToMedia };
    console.log('body', body);
    try {
      resp = await axios.post('http://127.0.0.1:8000/set-video-date/', body);
    } catch (e) {
      this.logger.error('setDate______', e);
    }

    return resp;
  }

  async getDate(data: { fileBuffer: Buffer, fileName?: string }): Promise<{ extractedDate: string }> {

    const { fileBuffer, fileName } = data;
    // let resp: { extractedDate: string };
    let resp: any;

    const form = new FormData();
    form.append('file', fileBuffer, { filename: fileName });
    // form.append('file', new Blob(fileBuffer));
    // form.append('file', fileBuffer, {
    //   filename: fileName,
    //   contentType: 'image/jpeg', // adjust based on your file type
    // });

    console.log('FORM_FILE_NAME:', form);
    console.log('HEADERS:', form.getHeaders());

    try {
      resp = await axios.post(this.url, form);
      // resp = await axios.post(this.url, form, {
      //   headers: {
      //     ...form.getHeaders(),
      //     maxRedirects: 0
      //   }
      // });
    } catch (e) {
      this.logger.error('FETCH____ERROR______', e);
    }

    console.log('RESP_________1', resp.data);
    // console.log('RESP_________2', resp.json());
    return resp.data;
  }
}

// curl -X POST "http://127.0.0.1:8000/extract-date/" -H "Accept: application/json" -F"file=@image.jpg"