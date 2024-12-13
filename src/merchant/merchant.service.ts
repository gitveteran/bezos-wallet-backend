import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity'; // Import the Merchant entity.

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}
  
  /**
  * Marks a merchant as Bezos-related or updates the Bezos-related status of an existing merchant.
  * 
  * @param merchant - The merchant's name.
  * @param isBezosRelated - Boolean indicating whether the merchant is Bezos-related or not.
  * @returns The updated or newly created Merchant record.
  */
  async markAsBezosRelated(merchant: string, isBezosRelated: boolean) {
    if (!merchant) {
      throw new Error('Merchant name is required.');
    }

    try {
      // Check if a merchant with the given name already exists in the database.
      const existingMerchant = await this.merchantRepository.findOne({
        where: { merchant },
      });

      if (existingMerchant) {
        // Update the isBezosRelated property if the merchant already exists.
        existingMerchant.isBezosRelated = isBezosRelated;
        return await this.merchantRepository.save(existingMerchant);
      }

      // If no existing merchant is found, create a new one.
      const newMerchant = this.merchantRepository.create({ merchant, isBezosRelated });
      return await this.merchantRepository.save(newMerchant);
    } catch (error) {
      throw new Error(`Error while marking merchant as Bezos-related: ${error.message}`);
    }
  }

  /**
  * Retrieves all merchants that are marked as Bezos-related.
  * 
  * @returns List of Bezos-related merchants.
  */
  async getBezosRelatedMerchants(): Promise<Merchant[]> {
    try {
      return await this.merchantRepository.find({ where: { isBezosRelated: true } });
    } catch (error) {
      throw new Error(`Error while fetching Bezos-related merchants: ${error.message}`);
    }
  }
}
