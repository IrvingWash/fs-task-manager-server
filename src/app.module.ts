import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConstants } from './env-constants';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

const dbUrl = process.env[EnvConstants.DBURL];

if (dbUrl === undefined) {
	throw new Error('DB URL is not provided');
}

@Module({
	imports: [
		MongooseModule.forRoot(dbUrl),
		UserModule,
		TaskModule,
	],
})
export class AppModule {}
