import { Test, TestingModule } from '@nestjs/testing';
import { MerchantResolver } from './merchant.resolver';
import { MerchantService } from './merchant.service';
import { Merchant } from '../entities/merchant.entity';

describe('MerchantResolver', () => {
  let resolver: MerchantResolver; // The resolver under test
  let service: MerchantService; // Mocked MerchantService

  // Mock merchant data used across the test cases
  const mockMerchant = {
    id: 1,
    merchant: 'Test Merchant',
    isBezosRelated: true,
  };

  // Mock implementation of MerchantService methods
  const mockMerchantService = {
    getBezosRelatedMerchants: jest.fn(), // Mock for the query
    markAsBezosRelated: jest.fn(), // Mock for the mutation
  };

  // Before each test, initialize the testing module and inject the mocks
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantResolver,
        {
          provide: MerchantService, // Replace MerchantService with the mock
          useValue: mockMerchantService,
        },
      ],
    }).compile();

    resolver = module.get<MerchantResolver>(MerchantResolver); // Resolver instance
    service = module.get<MerchantService>(MerchantService); // Mocked service instance
  });

  /**
   * Test Case 1: Query to fetch all Bezos-related merchants
   */
  it('should return all merchants marked as Bezos-related', async () => {
    // Arrange: Mock the service to return a list of merchants
    const bezosMerchants = [mockMerchant];
    mockMerchantService.getBezosRelatedMerchants.mockResolvedValue(bezosMerchants);

    // Act: Call the resolver method
    const result = await resolver.bezosMerchants();

    // Assert: Verify that the service method was called and the result is correct
    expect(service.getBezosRelatedMerchants).toHaveBeenCalled(); // Service call verification
    expect(result).toEqual(bezosMerchants); // Result verification
  });

  /**
   * Test Case 2: Mutation to mark a new merchant as Bezos-related
   */
  it('should mark a merchant as Bezos-related', async () => {
    // Arrange: Define input parameters and expected output
    const merchantName = 'New Merchant';
    const isBezosRelated = true;

    const updatedMerchant = {
      id: 2,
      merchant: merchantName,
      isBezosRelated,
    };

    // Mock the service to return the updated merchant
    mockMerchantService.markAsBezosRelated.mockResolvedValue(updatedMerchant);

    // Act: Call the resolver method with input arguments
    const result = await resolver.markMerchant(merchantName, isBezosRelated);

    // Assert: Verify service method is called with correct arguments and result matches
    expect(service.markAsBezosRelated).toHaveBeenCalledWith(merchantName, isBezosRelated);
    expect(result).toEqual(updatedMerchant);
  });

  /**
   * Test Case 3: Mutation to update an existing merchant's Bezos-related status
   */
  it('should update an existing merchant\'s Bezos-related status', async () => {
    // Arrange: Define input parameters and mock existing merchant
    const merchantName = 'Existing Merchant';
    const isBezosRelated = false;

    const updatedMerchant = {
      id: 1,
      merchant: merchantName,
      isBezosRelated,
    };

    // Mock the service to return the updated merchant
    mockMerchantService.markAsBezosRelated.mockResolvedValue(updatedMerchant);

    // Act: Call the resolver method with input arguments
    const result = await resolver.markMerchant(merchantName, isBezosRelated);

    // Assert: Verify the service method is called and the updated result is returned
    expect(service.markAsBezosRelated).toHaveBeenCalledWith(merchantName, isBezosRelated);
    expect(result).toEqual(updatedMerchant);
  });
});
