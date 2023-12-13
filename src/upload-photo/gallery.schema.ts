import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chapter } from './chapter-schema';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ collection: 'photos' })
export class Gallery {

  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // _id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' })
  chapter: Chapter;

  @Prop()
  title?: string;

  @Prop()
  description: string;

  @Prop()
  name: string;

  @Prop()
  fullPath?: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

