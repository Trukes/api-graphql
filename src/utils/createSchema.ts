import { buildSchema } from 'type-graphql';
import {
    CreateMovieResolver,
    CreateUserResolver,
} from '../modules/user/CreateUser';
import { ChangePasswordResolver } from '../modules/user/ChangePassword';
import { ComfirmUserResolver } from '../modules/user/ConfirmUser';
import { ForgotPasswordResolver } from '../modules/user/ForgotPassword';
import { LoginResolver } from '../modules/user/Login';
import { LogoutResolver } from '../modules/user/Logout';
import { MeResolver } from '../modules/user/Me';
import { RegisterResolver } from '../modules/user/Register';

export const createSchema = () =>
    buildSchema({
        resolvers: [
            ChangePasswordResolver,
            ComfirmUserResolver,
            ForgotPasswordResolver,
            LoginResolver,
            LogoutResolver,
            MeResolver,
            RegisterResolver,
            CreateUserResolver,
            CreateMovieResolver,
        ],
        validate: true,
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });
