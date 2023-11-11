import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ collection: 'chapters' })
export class Chapter {

  // @Prop({ type: mongoose.Schema.Types.ObjectId })
  // _id?: string;

  @Prop()
  title: string;

  @Prop()
  nameForUI?: string;

  @Prop()
  description?: string;

  @Prop()
  parent?: string;

  @Prop()
  parentTitle?: string;

}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
