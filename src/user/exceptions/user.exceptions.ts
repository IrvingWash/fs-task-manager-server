import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';

export function throwUserNotFoundException(id: ObjectId): never {
	throw new NotFoundException(`User ${id} not found`);
}
