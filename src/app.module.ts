import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConstants } from './env-constants';

const dbUrl = process.env[EnvConstants.DBURL];

if (dbUrl === undefined) {
	throw new Error('DB URL is not provided');
}

@Module({
	imports: [
		MongooseModule.forRoot(dbUrl),
	],
})
export class AppModule {}
