import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType() // This makes the class a GraphQL Object Type
@Entity()
export class Merchant {
  @Field(() => ID) // Exposes 'id' as a GraphQL field
  @PrimaryGeneratedColumn()
  id: number;

  @Field() // Exposes 'merchant' field to the GraphQL schema
  @Column({ unique: true }) // Ensures no duplicate merchants
  merchant: string;

  @Field() // Exposes 'isBezosRelated' to the GraphQL schema
  @Column({ default: true }) // Defaults to "Bezos-related" when added
  isBezosRelated: boolean;
}
