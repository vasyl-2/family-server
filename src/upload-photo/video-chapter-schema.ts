import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoChapterDocument = HydratedDocument<VideoChapter>;

@Schema({ collection: 'video-chapters' })
export class VideoChapter {
  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // _id?: string;

  @Prop()
  title: string;

  @Prop()
  nameForUI: string;

  @Prop()
  description?: string;

  @Prop()
  parent?: string;

  @Prop()
  parentTitle?: string;

  @Prop()
  fullPath?: string;
}

export const VideoChapterSchema = SchemaFactory.createForClass(VideoChapter);
