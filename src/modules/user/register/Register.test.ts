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

const registerMutation = `mutation Register($data: RegisterInput!) {
    register(
      data: $data
    ) {
      id
      name
      email
      firstName
      lastName
    }
  }`;

describe('Register', () => {
    it('create user', async () => {
        const user = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        };
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                data: user,
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            },
        });

        const dbUser = await User.findOne({ where: { email: user.email } });

        expect(dbUser).toBeDefined();

        expect(dbUser!.confirmed).toBeFalsy();

        expect(dbUser!.firstName).toBe(user.firstName);
    });
});
