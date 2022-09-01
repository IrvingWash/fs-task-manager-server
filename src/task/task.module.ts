import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../auth/schemas/user.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Task.name,
				schema: TaskSchema,
			},
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}
