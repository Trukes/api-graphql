import { Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloWorldResolver {
    @Authorized()
    @Query(() => String)
    hello() {
        return 'hi!';
    }
}
