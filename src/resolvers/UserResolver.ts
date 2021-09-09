// import { User } from '../entity/User';
import { User } from '../entity/User';
import {
    Query,
    Resolver,
    InputType,
    Arg,
    Mutation,
    Field,
    Int,
} from 'type-graphql';

@InputType()
class UserInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => Int)
    age: number;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async createUser(@Arg('options', () => UserInput) options: UserInput) {
        const user = await User.create(options).save();
        return user;
    }

    @Query(() => [User])
    users() {
        return User.find();
    }
}
