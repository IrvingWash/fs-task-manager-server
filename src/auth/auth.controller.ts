import {
	Body,
	Controller,
	Post,
	Res,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './token.service';

const thirtyDays = 30 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly _authService: AuthService
	) {}

	@Post('signup')
	public async signUp(
		@Body()
		dto: AuthDto,

		@Res({ passthrough: true })
		response: Response
	): Promise<Tokens> {
		const signUpResult = await this._authService.signUp(dto);

		response.cookie(
			'refreshToken',
			signUpResult.refreshToken,
			{
				maxAge: thirtyDays,
				httpOnly: true,
			}
		);

		return signUpResult;
	}

	@Post('signin')
	public async signIn(
		@Body()
		dto: AuthDto,

		@Res({ passthrough: true })
		response: Response
	): Promise<Tokens> {
		const signInResult = await this._authService.signUp(dto);

		response.cookie(
			'refreshToken',
			signInResult.refreshToken,
			{
				maxAge: thirtyDays,
				httpOnly: true,
			}
		);

		return signInResult;
	}
}
