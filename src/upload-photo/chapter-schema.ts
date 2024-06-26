import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ collection: 'chapters' })
export class Chapter {

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

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
