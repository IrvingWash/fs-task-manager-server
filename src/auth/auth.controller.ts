import {
	Body,
	Controller,
	Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './token.service';

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly _authService: AuthService
	) {}

	@Post('signup')
	public async signUp(
		@Body()
		dto: AuthDto
	): Promise<Tokens> {
		return await this._authService.signUp(dto);
	}

	@Post('signin')
	public async signIn(
		@Body()
		dto: AuthDto
	): Promise<Tokens> {
		return await this._authService.signIn(dto);
	}
}
