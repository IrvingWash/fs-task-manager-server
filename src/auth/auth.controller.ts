import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UnauthorizedException,
	Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { AuthResult, AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './token.service';

const thirtyDays = 30 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
	private _logger = new Logger(AuthController.name);

	public constructor(
		private readonly _authService: AuthService
	) {}

	@Post('signup')
	public async signUp(
		@Body()
		dto: AuthDto,

		@Res({ passthrough: true })
		response: Response
	): Promise<AuthResult> {
		const signUpResult = await this._authService.signUp(dto);

		response.cookie(
			'refreshToken',
			signUpResult.tokens.refreshToken,
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
	): Promise<AuthResult> {
		const signInResult = await this._authService.signIn(dto);

		response.cookie(
			'refreshToken',
			signInResult.tokens.refreshToken,
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

	@Get('logout')
	public async logout(
		@Req()
		request: Request,

		@Res({ passthrough: true })
		response: Response
	): Promise<void> {
		const accessToken = this._getAccessToken(request);

		this._authService.logout(accessToken);

		response.cookie(
			'refreshToken',
			''
		);
	}

	private _getRefreshToken(request: Request): string {
		const refreshToken = request.cookies?.refreshToken as string | undefined;

		if (refreshToken === undefined) {
			this._logger.warn('Refresh token is undefined');
			throw new UnauthorizedException();
		}

		return refreshToken;
	}

	private _getAccessToken(request: Request): string {
		const accessToken = request.headers.authorization?.split(' ')[1];	

		if (accessToken === undefined) {
			this._logger.warn('Access token is undefined');
			throw new UnauthorizedException();
		}

		return accessToken;
	}
}
