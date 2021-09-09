import { User } from '../../entity/User';
import { Movie } from '../../entity/Movie';
import {
    Arg,
    ClassType,
    Field,
    InputType,
    Mutation,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { RegisterInput } from './register/RegisterInput';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';

function createBaseResolver<T extends ClassType, X extends ClassType>(
    suffix: string,
    returnType: T,
    inputType: X,
    entity: any,
    middleware?: Middleware<any>[]
) {
    @Resolver()
    class BaseResolver {
        @Mutation(() => returnType, { name: `create${suffix}` })
        @UseMiddleware(...(middleware || []))
        async create(@Arg('data', () => inputType) data: any) {
            return await entity.create(data).save();
        }
    }

    return BaseResolver;
}

@InputType()
class ProductType {
    @Field()
    title: string;
}

export const CreateUserResolver = createBaseResolver(
    'User',
    User,
    RegisterInput,
    User
);
export const CreateMovieResolver = createBaseResolver(
    'Movie',
    Movie,
    ProductType,
    Movie
);

// @Resolver()
// export class CreateUserResolver extends UserBaseResolver {
//     // ...
// }

// @Resolver()
// export class CreateMovieResolver extends MovieBaseResolver {
//     // ...
// }
