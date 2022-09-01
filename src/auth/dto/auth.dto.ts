import { IsString } from 'class-validator';

export class AuthDto {
	@IsString()
	public readonly username: string;

	@IsString()
	public readonly password: string;
}
