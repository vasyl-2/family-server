import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
// import { ObjectSchema } from 'joi';

@Injectable()
export class PhotoValidatorService implements PipeTransform {

  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('VALUEEE______TO_____TRANSFORM___________', value);
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
