import {
	Prop,
	Schema,
	SchemaFactory,
} from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';

import { Task } from '../../task/schemas/task.schema';

@Schema()
export class User {
	@Prop({ required: true })
	public username: string;

	@Prop({ required: true })
	public password: string;

	@Prop({
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task',
		}],
	})
	public tasks: Task[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
