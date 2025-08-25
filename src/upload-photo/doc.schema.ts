import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DocDocument = HydratedDocument<Doc>;

@Schema({ collection: 'pdf' })
export class Doc {

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }] })

  chapter: mongoose.Schema.Types.ObjectId;

  @Prop()
  title?: string;

  @Prop()
  description: string;

  @Prop()
  date?: Date;

  @Prop()
  name: string;

  @Prop()
  fullPath?: string;
}

export const DocSchema = SchemaFactory.createForClass(Doc);
