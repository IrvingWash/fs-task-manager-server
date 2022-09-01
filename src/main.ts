import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { EnvConstants } from './env-constants';

async function bootstrap(): Promise<void> {
	const port = process.env[EnvConstants.Port];

	if (port === undefined) {
		throw new Error('Port is not provided');
	}

	const logger = new Logger('Core');

	const app = await NestFactory.create(AppModule);

	await app.listen(port);

	logger.log(`App started on port ${port}`);
}

bootstrap();
