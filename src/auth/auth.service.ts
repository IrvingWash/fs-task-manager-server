import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Tokens, TokenService } from './token.service';

export interface AuthResult {
	tokens: Tokens;
	username: string;
}

export interface LogoutResult {
	username: string;
}

@Injectable()
export class AuthService {
	private _logger = new Logger(AuthService.name);

	public constructor(
		@InjectModel(User.name)
		private readonly _userModel: Model<UserDocument>,

		private readonly _tokenService: TokenService,
	) {}

	public async signUp(dto: AuthDto): Promise<AuthResult> {
		const { username, password } = dto;

		const hashedPassword = await bcrypt.hash(password, 5);

		const tokens = this._tokenService.generateTokens(username);

		try {
			const user = await this._userModel.create({
				username,
				password: hashedPassword,
				refreshToken: tokens.refreshToken,
			});


			return {
				tokens,
				username: user.username,
			};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error?.code === 11000) {
				this._logger.warn(`Username ${username} already exists`);
				throw new BadRequestException('Duplicate username');
			}

			this._logger.error(error);
			throw new InternalServerErrorException();
		}
	}

	public async signIn(dto: AuthDto): Promise<AuthResult> {
		const { username, password } = dto;

		const user = await this._userModel.findOne({ username });

		if (user === null) {
			this._logger.warn(`User ${username} not found`);
			throw new UnauthorizedException();
		}

		const isCorrectPassword = bcrypt.compare(password, user.password);

		if (!isCorrectPassword) {
			this._logger.error(`Incorrect password for user ${user}`);
			throw new UnauthorizedException();
		}

		const tokens = this._tokenService.generateTokens(username);

		user.refreshToken = tokens.refreshToken;

		await user.save();

		return {
			tokens,
			username: user.username,
		};
	}

	public async refresh(refreshToken: string): Promise<Tokens> {
		const validationResult = this._tokenService.validateRefreshToken(refreshToken);

		const userWithToken = await this._userModel.findOne({ username: validationResult.username });

		if (userWithToken === null) {
			this._logger.warn(`Refresh token for user not found`);
			throw new UnauthorizedException();
		}

		const tokens = this._tokenService.generateTokens(userWithToken.username);

		userWithToken.refreshToken = tokens.refreshToken;

		await userWithToken.save();

		return tokens;
	}

	public async logout(accessToken: string): Promise<LogoutResult> {
		const validationResult = this._tokenService.validateAccessToken(accessToken);

		const user = await this._userModel.findOne({ username: validationResult.username });

		if (user === null) {
			this._logger.warn('User not found');
			throw new UnauthorizedException();
		}

		user.refreshToken = '';

		await user.save();

		return { username: user.username };
	}
}
