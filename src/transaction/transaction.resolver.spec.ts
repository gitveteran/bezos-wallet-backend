import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { PubSub } from 'graphql-subscriptions';
import { TransactionDTO } from '../dto/transaction.dto';
import { TRANSACTIONS_UPDATED_EVENT } from './events';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let service: TransactionService;

  // Mock PubSub instance
  const mockPubSub = {
    asyncIterableIterator: jest.fn(),
  };

  // Mock TransactionService
  const mockTransactionService = {
    getTransactions: jest.fn(),
    getPubSub: jest.fn(() => mockPubSub),
  };

  const mockTransactions: TransactionDTO[] = [
    { id: 1, date: '2029-01-05T12:00:00Z', amount: 100, category: [], merchant_name: "Amazon" },
    { id: 2, date: '2029-01-10T12:00:00Z', amount: 200, category: [], merchant_name: "Spyware" },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    service = module.get<TransactionService>(TransactionService);
  });

  /**
   * Test Case 1: Verify transactions query returns the list of transactions.
   */
  it('should fetch all transactions', async () => {
    // Arrange: Mock service response
    mockTransactionService.getTransactions.mockResolvedValue(mockTransactions);

    // Act: Call the resolver's transactions query
    const result = await resolver.transactions();

    // Assert: Verify the service is called and returns the correct data
    expect(service.getTransactions).toHaveBeenCalled();
    expect(result).toEqual(mockTransactions);
  });

  /**
   * Test Case 2: Verify subscription to transactionsUpdated event.
   */
  it('should subscribe to transactionsUpdated event', () => {
    // Arrange: Mock PubSub's async iterator
    const mockIterator = { next: jest.fn(), return: jest.fn(), throw: jest.fn() };
    mockPubSub.asyncIterableIterator.mockReturnValue(mockIterator);

    // Act: Call the resolver's transactionsUpdated subscription
    const result = resolver.transactionsUpdated();

    // Assert: Verify the subscription event is returned correctly
    expect(mockPubSub.asyncIterableIterator).toHaveBeenCalledWith(TRANSACTIONS_UPDATED_EVENT);
    expect(result).toEqual(mockIterator);
  });
});
