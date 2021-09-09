import { User } from '../../entity/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { createForgotPassword } from '../utils/createForgotPassword';
import { sendMail } from '../utils/sendEmail';

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(@Arg('email') email: string): Promise<boolean> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return true;
        }

        await sendMail(email, await createForgotPassword(user.id));

        return true;
    }
}
