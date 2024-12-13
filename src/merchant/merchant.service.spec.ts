import { Test, TestingModule } from '@nestjs/testing';
import { MerchantService } from './merchant.service';
import { Merchant } from '../entities/merchant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('MerchantService', () => {
  let service: MerchantService; // The service under test
  let repository: Repository<Merchant>; // The mocked repository

  // Mock implementation of the repository methods
  const mockMerchantRepository = {
    findOne: jest.fn(), // Mock for finding an entity
    save: jest.fn(),    // Mock for saving an entity
    create: jest.fn(),  // Mock for creating a new entity
  };

  // Before each test, set up the testing module and inject mocks
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        {
          // Replace the real repository with a mock
          provide: getRepositoryToken(Merchant),
          useValue: mockMerchantRepository,
        },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
    repository = module.get<Repository<Merchant>>(getRepositoryToken(Merchant));
  });

  // Test Case 1: Create a new merchant if it does not exist
  it('should create a new merchant if it does not exist', async () => {
    // Arrange: Define test inputs and mock behavior
    const merchantName = 'Test Merchant';
    const isBezosRelated = true;

    // Mock findOne to return null (merchant does not exist)
    mockMerchantRepository.findOne.mockResolvedValue(null);
    const newMerchant = { merchant: merchantName, isBezosRelated };

    // Mock create and save methods
    mockMerchantRepository.create.mockReturnValue(newMerchant);
    mockMerchantRepository.save.mockResolvedValue(newMerchant);

    // Act: Call the service method
    const result = await service.markAsBezosRelated(merchantName, isBezosRelated);

    // Assert: Verify that repository methods were called with the right arguments
    expect(repository.findOne).toHaveBeenCalledWith({ where: { merchant: merchantName } });
    expect(repository.create).toHaveBeenCalledWith({ merchant: merchantName, isBezosRelated });
    expect(repository.save).toHaveBeenCalledWith(newMerchant);
    expect(result).toEqual(newMerchant);
  });

  // Test Case 2: Update the isBezosRelated status of an existing merchant
  it('should update the isBezosRelated status of an existing merchant', async () => {
    // Arrange: Define test inputs and mock existing merchant
    const merchantName = 'Existing Merchant';
    const isBezosRelated = false;

    const existingMerchant = {
      id: 1,
      merchant: merchantName,
      isBezosRelated: true, // Initial status
    };

    const updatedMerchant = {
      ...existingMerchant,
      isBezosRelated, // Updated status
    };

    // Mock findOne to return the existing merchant
    mockMerchantRepository.findOne.mockResolvedValue(existingMerchant);

    // Mock save to return the updated merchant
    mockMerchantRepository.save.mockResolvedValue(updatedMerchant);

    // Act: Call the service method to update the status
    const result = await service.markAsBezosRelated(merchantName, isBezosRelated);

    // Assert: Verify repository methods and in-memory updates
    expect(repository.findOne).toHaveBeenCalledWith({ where: { merchant: merchantName } });
    expect(existingMerchant.isBezosRelated).toBe(isBezosRelated); // In-memory update verification
    expect(repository.save).toHaveBeenCalledWith(existingMerchant);
    expect(result).toEqual(updatedMerchant);
  });
});
