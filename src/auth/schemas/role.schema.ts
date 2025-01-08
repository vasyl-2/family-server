import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: 'role' })
export class Role {
  @Prop({ unique: [true, 'Duplicated role'] })
  name: string;

  // @Prop([String])
  @Prop({
    type: [{ type: [mongoose.Schema.Types.ObjectId], ref: 'Permissions' }],
  })
  permissions: mongoose.Schema.Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
