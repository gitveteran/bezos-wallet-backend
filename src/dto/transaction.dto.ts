import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class TransactionDTO {
  @Field(() => Int) // ID field
  id: number;

  @Field(() => Float, { nullable: true }) // Allow amount to be nullable
  amount: number;

  @Field(() => [String], { nullable: true }) // Category as an array of strings
  category: string[];

  @Field({ nullable: true }) // Date of transaction
  date: string;

  @Field({ nullable: true }) // Map "merchant_name" to this field
  merchant_name: string;
}
