import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MerchantService } from './merchant.service';
import { Merchant } from '../entities/merchant.entity';

@Resolver(() => Merchant)
export class MerchantResolver {
  constructor(private merchantService: MerchantService) {}

  /**
  * GraphQL Query to fetch all merchants marked as Bezos-related.
  * 
  * @returns An array of Merchant objects.
  */
  @Query(() => [Merchant])
  async bezosMerchants() {
    return await this.merchantService.getBezosRelatedMerchants();
  }

  /**
  * GraphQL Mutation to mark a merchant as Bezos-related or update its status.
  * 
  * @param merchant - The name of the merchant to be marked or updated.
  * @param isBezosRelated - indicating whether the merchant is Bezos-related or not.
  * @returns The updated or newly created Merchant object.
  */
  @Mutation(() => Merchant)
  async markMerchant(
    @Args('merchant') merchant: string, // the merchant name to be updated
    @Args('isBezosRelated') isBezosRelated: boolean, // the new Bezos-related status
  ) {
    return await this.merchantService.markAsBezosRelated(merchant, isBezosRelated);
  }
}
