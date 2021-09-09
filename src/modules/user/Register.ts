import { User } from '../../entity/User';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';
import { sendMail } from '../utils/sendEmail';

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth, logger)
    @Query(() => String)
    async hello() {
        return 'hello world';
    }

    @Mutation(() => User)
    async register(
        @Arg('data')
        { email, firstName, lastName, password }: RegisterInput
    ): Promise<User> {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        }).save();

        await sendMail(email, await createConfirmationUrl(user.id));

        return user;
    }

    @Query(() => [User])
    users() {
        return User.find();
    }
}
