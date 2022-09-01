import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';

export interface AuthResult {
	user: User,
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class AuthService {
	public constructor(
		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>
	) {}

	public async signUp(dto: AuthDto): Promise<AuthResult> {
		const { username, password } = dto;

		const hashedPassword = await bcrypt.hash(password, 5);

		const newUser = await this._userModel.create({ username, password: hashedPassword });

		return {
			user: newUser,
			accessToken: 'test',
			refreshToken: 'test',
		};
	}
}
