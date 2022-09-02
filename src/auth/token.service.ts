import {
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

import { EnvConstants } from '../env-constants';

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const secret = process.env[EnvConstants.Secret];

@Injectable()
export class TokenService {
	private _logger = new Logger(TokenService.name);

	public generateTokens(username: string): Tokens {
		if (secret === undefined) {
			this._logger.error('Secret is not provided');
			throw new InternalServerErrorException();
		}

		const accessToken = jwt.sign(
			{ username },
			secret,
			{ expiresIn: '1h' }
		);

		const refreshToken = jwt.sign(
			{ username },
			secret,
			{ expiresIn: '30d' }
		);

		return {
			accessToken,
			refreshToken,
		};
	}

	public validateAccessToken(accessToken: string): jwt.JwtPayload {
		if (secret === undefined) {
			this._logger.error('Secret is not provided');
			throw new InternalServerErrorException();
		}

		try {
			return jwt.verify(accessToken, secret) as jwt.JwtPayload;
		} catch {
			this._logger.warn('Incorrect access token');
			throw new UnauthorizedException();
		}
	}

	public validateRefreshToken(refreshToken: string): jwt.JwtPayload {
		if (secret === undefined) {
			this._logger.error('Secret is not provided');
			throw new InternalServerErrorException();
		}

		try {
			return jwt.verify(refreshToken, secret) as jwt.JwtPayload;
		} catch {
			this._logger.warn('Incorrect refresh token');
			throw new UnauthorizedException();
		}
	}
}
