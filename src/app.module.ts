import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConstants } from './env-constants';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

const dbUrl = process.env[EnvConstants.DBURL];

if (dbUrl === undefined) {
	throw new Error('DB URL is not provided');
}

@Module({
	imports: [
		MongooseModule.forRoot(dbUrl),
		TaskModule,
		AuthModule,
	],
})
export class AppModule {}
