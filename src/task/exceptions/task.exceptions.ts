import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';

export function throwTaskNotFoundException(id: ObjectId): never {
	throw new NotFoundException(`Task ${id} not found`);
}
