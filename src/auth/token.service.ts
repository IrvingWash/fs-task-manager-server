import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { EnvConstants } from '../env-constants';

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const secret = process.env[EnvConstants.Secret];

@Injectable()
export class TokenService {
	public generateTokens(username: string): Tokens {
		if (secret === undefined) {
			throw new Error('Secret is not provided');
		}

		const accessToken = jwt.sign(
			{ username },
			secret,
			{ expiresIn: '30m' }
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
			throw new Error('Secret is not provided');
		}

		try {
			return jwt.verify(accessToken, secret) as jwt.JwtPayload;
		} catch {
			throw new UnauthorizedException();
		}
	}
}
