import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Tokens, TokenService } from './token.service';

export interface AuthResult {
	user: User,
	tokens: Tokens;
}

@Injectable()
export class AuthService {
	public constructor(
		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>,

		private readonly _tokenService: TokenService,
	) {}

	public async signUp(dto: AuthDto): Promise<AuthResult> {
		const { username, password } = dto;

		const hashedPassword = await bcrypt.hash(password, 5);

		const tokens = this._tokenService.generateTokens(username);

		const newUser = await this._userModel.create({
			username,
			password: hashedPassword,
			refreshToken: tokens.refreshToken,
		});

		return {
			user: newUser,
			tokens,
		};
	}

	public async signIn(dto: AuthDto): Promise<AuthResult> {
		const { username, password } = dto;

		const user = await this._userModel.findOne({ username });

		if (user === null) {
			throw new UnauthorizedException();
		}

		const isCorrectPassword = bcrypt.compare(password, user.password);

		if (!isCorrectPassword) {
			throw new UnauthorizedException();
		}

		const tokens = this._tokenService.generateTokens(username);

		user.refreshToken = tokens.refreshToken;

		await user.save();

		return {
			user,
			tokens,
		};
	}
}
