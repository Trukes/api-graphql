// import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import session from 'express-session';
import { redis } from './redis';
import connectRedis from 'connect-redis';
import { createSchema } from './utils/createSchema';
// import {
//     fieldExtensionsEstimator,
//     getComplexity,
//     simpleEstimator,
// } from 'graphql-query-complexity';

// dotenv.config();

(async () => {
    const app = express();

    const RedisStore = connectRedis(session as any);

    const options = await getConnectionOptions(
        process.env.NODE_ENV || 'development_postgres'
    );

    await createConnection({ ...options, name: 'default' });

    const schema = await createSchema();

    const apolloServer = new ApolloServer({
        schema: schema,
        context: ({ req, res }: any) => ({ req, res }),
        // Create a plugin that will allow for query complexity calculation for every request
        // plugins: [
        //     {
        //         requestDidStart: () => ({
        //             didResolveOperation({ request, document }) {
        //                 /**
        //                  * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
        //                  * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
        //                  * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
        //                  */
        //                 const complexity = getComplexity({
        //                     // Our built schema
        //                     schema: schema,
        //                     // To calculate query complexity properly,
        //                     // we have to check only the requested operation
        //                     // not the whole document that may contains multiple operations
        //                     operationName: request.operationName,
        //                     // The GraphQL query document
        //                     query: document,
        //                     // The variables for our GraphQL query
        //                     variables: {},
        //                     // Add any number of estimators. The estimators are invoked in order, the first
        //                     // numeric value that is being returned by an estimator is used as the field complexity.
        //                     // If no estimator returns a value, an exception is raised.
        //                     estimators: [
        //                         // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
        //                         fieldExtensionsEstimator(),
        //                         // Add more estimators here...
        //                         // This will assign each field a complexity of 1
        //                         // if no other estimator returned a value.
        //                         simpleEstimator({ defaultComplexity: 1 }),
        //                     ],
        //                 });
        //                 // Here we can react to the calculated complexity,
        //                 // like compare it with max and throw error when the threshold is reached.
        //                 if (complexity > 20) {
        //                     throw new Error(
        //                         `Sorry, too complicated query! ${complexity} is over 20 that is the max allowed complexity.`
        //                     );
        //                 }
        //                 // And here we can e.g. subtract the complexity point from hourly API calls limit.
        //                 console.log(
        //                     'Used query complexity points:',
        //                     complexity
        //                 );
        //             },
        //         }),
        //     },
        // ],
    });

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000',
        })
    );

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: 'qid',
            secret: 'aslkdfjoiq12312',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        } as any)
    );

    apolloServer.applyMiddleware({ app });
    const port = process.env.PORT || 4000;
    app.listen(port, async () => {
        console.log(`server started at http://localhost:${port}/graphql`);
    });
})();
