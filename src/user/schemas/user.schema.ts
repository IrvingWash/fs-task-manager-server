import {
	Prop,
	Schema,
	SchemaFactory,
} from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class User {
	@Prop({ required: true })
	public username: string;

	@Prop({ required: true })
	public password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
