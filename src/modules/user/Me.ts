import { User } from '../../entity/User';
import { Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true, complexity: 5 })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
        }

        return User.findOne(ctx.req.session!.userId);
    }
}
