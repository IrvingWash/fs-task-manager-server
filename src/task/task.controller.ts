import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Req,
	UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { ObjectId } from 'mongoose';

import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './schemas/task.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
	private _logger = new Logger(TaskController.name);

	public constructor(
		private readonly _taskService: TaskService,
	) {}

	@Post()
	public async createTask(
		@Req()
		request: Request,

		@Body()
		dto: CreateTaskDto,
	): Promise<Task> {
		const accessToken = this._getAccessToken(request);

		return await this._taskService.createTask(dto, accessToken);
	}

	@Get()
	public async getAllTasks(
		@Req()
		request: Request,
	): Promise<Task[]> {
		const accessToken = this._getAccessToken(request);

		return await this._taskService.getAllTasks(accessToken);
	}

	@Patch(':id')
	public async updateTask(
		@Req()
		request: Request,

		@Param('id')
		id: ObjectId,

		@Body()
		dto: UpdateTaskDto
	): Promise<Task> {
		const accessToken = this._getAccessToken(request);

		return await this._taskService.updateTask(accessToken, id, dto);
	}

	@Delete(':id')
	public async deleteTask(
		@Req()
		request: Request,

		@Param('id')
		id: ObjectId
	): Promise<Task> {
		const accessToken = this._getAccessToken(request);

		return await this._taskService.deleteTask(accessToken, id);
	}

	private _getAccessToken(request: Request): string {
		const accessToken = request.headers.authorization?.split(' ')[1];	

		if (accessToken === undefined) {
			this._logger.warn('Access token is undefined');
			throw new UnauthorizedException();
		}

		return accessToken;
	}
}
