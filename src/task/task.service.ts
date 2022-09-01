import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { throwUserNotFoundException } from '../user/exceptions/user.exceptions';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { throwTaskNotFoundException } from './exceptions/task.exceptions';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService {
	public constructor(
		@InjectModel(Task.name)
		private readonly _taskModel: Model<TaskDocument>,

		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>
	) {}

	public async createTask(userId: ObjectId, dto: CreateTaskDto): Promise<Task> {
		const user = await this._userModel.findById(userId);

		if (user === null) {
			throwUserNotFoundException(userId);
		}

		const newTask = await this._taskModel.create({ ...dto, user: userId });

		user.tasks.push(newTask);

		await user.save();

		return newTask;
	}

	public async getAllTasks(userId: ObjectId): Promise<Task[]> {
		return await this._taskModel.find({ user: userId });
	}

	public async updateTask(id: ObjectId, dto: UpdateTaskDto): Promise<Task> {
		const updatedTask = await this._taskModel.findByIdAndUpdate(id, { ...dto }, { new: true });

		if (updatedTask === null) {
			throwTaskNotFoundException(id);
		}

		return updatedTask;
	}

	public async deleteTask(id: ObjectId): Promise<Task> {
		const deletedTask = await this._taskModel.findByIdAndDelete(id);

		if (deletedTask === null) {
			throwTaskNotFoundException(id);
		}

		return deletedTask;
	}
}
