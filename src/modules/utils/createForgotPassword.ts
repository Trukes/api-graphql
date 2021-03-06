import { v4 } from 'uuid';
import { redis } from '../../redis';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';

export const createForgotPassword = async (userId: number) => {
    const token = v4();
    await redis.set(forgotPasswordPrefix + token, userId, 'ex', 60 * 60 * 24); // 1 day expiration

    return `http://localhost:3000/user/change-password/${token}`;
};
