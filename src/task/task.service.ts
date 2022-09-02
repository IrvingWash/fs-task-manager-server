import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { TokenService } from '../auth/token.service';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { throwTaskNotFoundException } from './exceptions/task.exceptions';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService {
	private _logger = new Logger(TaskService.name);

	public constructor(
		@InjectModel(Task.name)
		private readonly _taskModel: Model<TaskDocument>,

		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>,

		private readonly _tokenService: TokenService,
	) {}

	public async createTask(dto: CreateTaskDto, accessToken: string): Promise<Task> {
		const user = await this._getUser(accessToken);

		return await this._taskModel.create({ ...dto, user: user._id });
	}

	public async getAllTasks(accessToken: string): Promise<Task[]> {
		const user = await this._getUser(accessToken);

		return await this._taskModel.find({ user: user._id });
	}

	public async updateTask(accessToken: string, id: ObjectId, dto: UpdateTaskDto): Promise<Task> {
		const user = await this._getUser(accessToken);

		const updatedTask = await this._taskModel.findOneAndUpdate(
				{ $and: [
					{ user: user._id },
					{ _id: id },
				] },
				{ ...dto },
				{ new: true }
			);

		if (updatedTask === null) {
			this._logger.warn(`Task ${id} not found`);
			throwTaskNotFoundException(id);
		}

		return updatedTask;
	}

	public async deleteTask(accessToken: string, id: ObjectId): Promise<Task> {
		const user = await this._getUser(accessToken);

		const deletedTask = await this._taskModel.findOneAndDelete(
			{ $and: [
				{ user: user._id },
				{ _id: id },
			] }
		);

		if (deletedTask === null) {
			this._logger.warn(`Task ${id} not found`);
			throwTaskNotFoundException(id);
		}

		return deletedTask;
	}

	private async _getUser(accessToken: string): Promise<UserDocument> {
		const validationResult = this._tokenService.validateAccessToken(accessToken);

		const user = await this._userModel.findOne({ username: validationResult.username });

		if (user === null) {
			this._logger.warn('User not found');
			throw new UnauthorizedException();
		}

		return user;
	}
}
