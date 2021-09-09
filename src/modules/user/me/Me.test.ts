import { Connection } from 'typeorm';
import { testConn } from '../../../test-utils/testConn';
import { gCall } from '../../../test-utils/gCall';
import faker from 'faker';
import { User } from '../../../entity/User';
import { redis } from '../../../../src/redis';

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
    if (redis.status == 'end') {
        await redis.connect();
    }
});

afterAll(async () => {
    await conn.close();
    redis.disconnect();
});

const meQuery = `{
    me {
        id
        firstName
        lastName
        email
        name
    }
}`;

describe('Me', () => {
    it('get user', async () => {
        const user = await User.create({
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        }).save();

        const response = await gCall({
            source: meQuery,
            userId: user.id,
        });

        expect(response).toMatchObject({
            data: {
                me: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        });
    });

    it('return null', async () => {
        const response = await gCall({
            source: meQuery,
        });

        expect(response.data!.me).toBeNull();
    });
});
