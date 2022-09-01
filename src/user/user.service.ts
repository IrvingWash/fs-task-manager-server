import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { throwUserNotFoundException } from './exceptions/user.exceptions';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
	public constructor(
		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>
	) {}

	public async createUser(dto: CreateUserDto): Promise<User> {
		const { username, password } = dto;

		const hashedPassword = await bcrypt.hash(password, 5);

		return await this._userModel.create({ username, password: hashedPassword });
	}

	public async getAllUsers(): Promise<User[]> {
		return await this._userModel.find().select('-password');
	}

	public async getUserById(id: ObjectId): Promise<User> {
		const user = await this._userModel.findById(id).populate('tasks');

		if (user === null) {
			throwUserNotFoundException(id);
		}

		return user;
	}

	public async updateUser(id: ObjectId, dto: UpdateUserDto): Promise<User> {
		const updatedUser = await this._userModel.findByIdAndUpdate(id, { ...dto }, { new: true });

		if (updatedUser === null) {
			throwUserNotFoundException(id);
		}

		return updatedUser;
	}

	public async deleteUser(id: ObjectId): Promise<User> {
		const deletedUser = await this._userModel.findByIdAndDelete(id);
		
		if (deletedUser === null) {
			throwUserNotFoundException(id);
		}

		return deletedUser;
	}
}
