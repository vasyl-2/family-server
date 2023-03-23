import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ collection: 'chapters' })
export class Chapter {

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: string;

  @Prop()
  title: string;

  @Prop()
  description?: string;

}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
