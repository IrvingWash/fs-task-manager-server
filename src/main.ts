import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { EnvConstants } from './env-constants';

async function bootstrap(): Promise<void> {
	const port = process.env[EnvConstants.Port];
	const clientUrl = process.env[EnvConstants.ClientURL];

	if (port === undefined) {
		throw new Error('Port is not provided');
	}

	if (clientUrl === undefined) {
		throw new Error('Client url is not provided');
	}

	const logger = new Logger('Core');

	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: clientUrl,
	});

	app.use(cookieParser());

	app.setGlobalPrefix('api');

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	await app.listen(port);

	logger.log(`App started on port ${port}`);
}

bootstrap();
