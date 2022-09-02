import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';

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
		const signInResult = await this._authService.signIn(dto);

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

	@Get('refresh')
	public async refresh(
		@Req()
		request: Request,

		@Res({ passthrough: true })
		response: Response
	): Promise<Tokens> {
		const refreshToken = this._getRefreshToken(request);

		const refreshResult = await this._authService.refresh(refreshToken);

		response.cookie(
			'refreshToken',
			refreshResult.refreshToken,
			{
				maxAge: thirtyDays,
				httpOnly: true,
			}
		);

		return refreshResult;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _getRefreshToken(request: Request): string {
		const refreshToken = request.cookies?.refreshToken as string | undefined;

		if (refreshToken === undefined) {
			throw new UnauthorizedException();
		}

		return refreshToken;
	}
}
