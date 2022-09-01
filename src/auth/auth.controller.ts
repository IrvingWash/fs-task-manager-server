import {
	Body,
	Controller,
	Post,
} from '@nestjs/common';

import { AuthResult, AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly _authService: AuthService
	) {}

	@Post('signup')
	public async signUp(
		@Body()
		dto: AuthDto
	): Promise<AuthResult> {
		return await this._authService.signUp(dto);
	}
}
