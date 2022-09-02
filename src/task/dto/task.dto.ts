import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

import { TaskStatus } from '../schemas/task.schema';

abstract class TaskDtoBase {
	@IsString()
	@IsNotEmpty()
	public readonly title: string;

	@IsString()
	@IsOptional()
	public readonly description: string;

	@IsEnum(TaskStatus)
	@IsOptional()
	public readonly status: TaskStatus;
}

export class CreateTaskDto extends TaskDtoBase {}

export class UpdateTaskDto extends TaskDtoBase {
	@IsString()
	@IsOptional()
	public override readonly title: string;
}
