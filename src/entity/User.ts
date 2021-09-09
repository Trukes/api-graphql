import { Field, Int, ObjectType, Root } from 'type-graphql';
import bcrypt from 'bcryptjs';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field(() => Int)
    @Column('int', { nullable: true })
    age: number;

    @Column()
    password: string;

    @Field({ complexity: 3 })
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    @Column('bool', { default: false })
    confirmed: boolean;
}
