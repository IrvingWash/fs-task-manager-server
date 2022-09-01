import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';

import { ObjectId } from 'mongoose';

import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './schemas/task.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
	public constructor(
		private readonly _taskService: TaskService,
	) {}

	@Post(':userId')
	public async createTask(
		@Param('userId')
		userId: ObjectId,

		@Body()
		dto: CreateTaskDto,
	): Promise<Task> {
		return await this._taskService.createTask(userId, dto);
	}

	@Get(':userId')
	public async getAllTasks(
		@Param('userId')
		userId: ObjectId
	): Promise<Task[]> {
		return await this._taskService.getAllTasks(userId);
	}

	@Patch(':id')
	public async updateTask(
		@Param('id')
		id: ObjectId,

		@Body()
		dto: UpdateTaskDto
	): Promise<Task> {
		return await this._taskService.updateTask(id, dto);
	}

	@Delete(':id')
	public async deleteTask(
		@Param('id')
		id: ObjectId
	): Promise<Task> {
		return await this._taskService.deleteTask(id);
	}
}
