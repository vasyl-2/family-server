import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = HydratedDocument<User>

@Schema({ collection: 'auth' })
export class User {
  @Prop({ unique: [true, 'Duplicated email'], required: [true, 'Must be set'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' } ] })
  role?: mongoose.Schema.Types.ObjectId[];

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
