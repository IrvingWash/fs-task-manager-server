import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { EnvConstants } from '../env-constants';

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const secret = process.env[EnvConstants.Secret];

@Injectable()
export class TokenService {
	public generateTokens(payload: string): Tokens {
		if (secret === undefined) {
			throw new Error('Secret is not provided');
		}

		const accessToken = jwt.sign(
			{ payload },
			secret,
			{ expiresIn: '30m' }
		);

		const refreshToken = jwt.sign(
			{ payload },
			secret,
			{ expiresIn: '30d' }
		);

		return {
			accessToken,
			refreshToken,
		};
	}
}
