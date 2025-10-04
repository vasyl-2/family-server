import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Chapter } from './chapter-schema';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ collection: 'photos' })
export class Gallery {

  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // _id?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }] })
  chapter: mongoose.Schema.Types.ObjectId;
  // chapter: Chapter;
  // chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' };

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop()
  date?: Date;

  @Prop()
  name: string;

  @Prop()
  fullPath?: string;

  @Prop()
  type?: 'photo' | 'video' | 'pdf';
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

