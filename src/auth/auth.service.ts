import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Tokens, TokenService } from './token.service';
import { MongoError } from 'mongodb';

@Injectable()
export class AuthService {
	public constructor(
		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>,

		private readonly _tokenService: TokenService,
	) {}

	public async signUp(dto: AuthDto): Promise<Tokens> {
		const { username, password } = dto;

		const hashedPassword = await bcrypt.hash(password, 5);

		const tokens = this._tokenService.generateTokens(username);

		try {
			await this._userModel.create({
				username,
				password: hashedPassword,
				refreshToken: tokens.refreshToken,
			});
		} catch (error: unknown) {
			if ((error instanceof MongoError) &&  error.code === 11000) {
				throw new BadRequestException('Duplicate username');
			}
		}

		return tokens;
	}

	public async signIn(dto: AuthDto): Promise<Tokens> {
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

		return tokens;
	}

	public async refresh(refreshToken: string): Promise<Tokens> {
		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		const validationResult = this._tokenService.validateRefreshToken(refreshToken);

		const userWithToken = await this._userModel.findOne({ username: validationResult.username });

		if (userWithToken === null) {
			throw new UnauthorizedException();
		}

		const tokens = this._tokenService.generateTokens(userWithToken.username);

		userWithToken.refreshToken = tokens.refreshToken;

		await userWithToken.save();

		return tokens;
	}
}
