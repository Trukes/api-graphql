import { User } from '../../entity/User';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { redis } from '../../../src/redis';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg('data') { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) {
            return null;
        }

        const user = await User.findOne(userId);

        if (!user) {
            return null;
        }

        await redis.del(forgotPasswordPrefix + token);

        user.password = password;

        await user.save();

        ctx.req.session!.userId = userId;

        return user;
    }
}
