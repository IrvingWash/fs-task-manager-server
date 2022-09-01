import { IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	public readonly username: string;

	@IsString()
	public readonly password: string;
}

export class UpdateUserDto {
	@IsString()
	public readonly password: string;
}
