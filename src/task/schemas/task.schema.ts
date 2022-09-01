import {
	Prop,
	Schema,
	SchemaFactory,
} from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';

import { User } from '../../auth/schemas/user.schema';

export enum TaskStatus {
	Open = 'Open',
	Done = 'Done',
}

@Schema({ timestamps: true })
export class Task {
	@Prop({ required: true })
	public title: string;

	@Prop()
	public description: string;

	@Prop({ default: TaskStatus.Open })
	public status: TaskStatus;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	public user: User;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
