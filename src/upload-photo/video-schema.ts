import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Chapter } from './chapter-schema';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ collection: 'videos' })
export class Video {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' })
  chapter: mongoose.Types.ObjectId;

  @Prop()
  title?: string;

  @Prop()
  type?: string; // mp4 ....TODO!!!!!!

  @Prop()
  description?: string;

  @Prop()
  name: string;

  @Prop()
  fullPath?: string;

  @Prop()
  date?: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
