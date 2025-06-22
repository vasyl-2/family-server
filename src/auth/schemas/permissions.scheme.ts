import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaType } from 'mongoose';
import { Role } from './role.schema';

export type PermissionsDocument = HydratedDocument<Permissions>;

@Schema({ collection: 'permissions' })
export class Permissions {
  @Prop({ unique: [true, 'Duplicated permission'], required: [true] })
  name: string;

  @Prop()
  displayName?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] })
  roles?: mongoose.Schema.Types.ObjectId[];
}

export const PermissionsSchema = SchemaFactory.createForClass(Permissions)
