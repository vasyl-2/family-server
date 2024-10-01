import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema({ collection: 'auth' })
export class User {
  @Prop({ unique: [true, 'Duplicated email'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role?: string;

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
