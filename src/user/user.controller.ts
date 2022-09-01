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

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	public constructor(
		private readonly _userService: UserService
	) {}

	@Post()
	public async createUser(
		@Body()
		dto: CreateUserDto
	): Promise<User> {
		console.log(dto);
		return await this._userService.createUser(dto);
	}

	@Get()
	public async getAllUsers(): Promise<User[]> {
		return await this._userService.getAllUsers();
	}

	@Get(':id')
	public async getUserById(
		@Param('id')
		id: ObjectId
	): Promise<User> {
		return await this._userService.getUserById(id);
	}

	@Patch(':id')
	public async updateUser(
		@Param('id')
		id: ObjectId,

		@Body()
		dto: UpdateUserDto
	): Promise<User> {
		return await this._userService.updateUser(id, dto);
	}

	@Delete(':id')
	public async deleteUser(
		@Param('id')
		id: ObjectId
	): Promise<User> {
		return await this._userService.deleteUser(id);
	}
}
