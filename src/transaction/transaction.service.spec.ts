import { TransactionService } from './transaction.service';
import { PubSub } from 'graphql-subscriptions';
import axios from 'axios';
import { MOCK_API_URL, POLLING_INTERVAL_MS } from '../config';
import { TRANSACTIONS_UPDATED_EVENT } from './events';

jest.mock('axios'); // Mock Axios for HTTP requests
jest.useFakeTimers(); // Use Jest fake timers for interval testing

describe('TransactionService', () => {
  let service: TransactionService;

  const mockPubSub = {
    publish: jest.fn(),
  };

  const mockTransactions = [
    { id: 1, date: '2029-01-05T12:00:00Z', amount: 100 },
    { id: 2, date: '2029-01-10T12:00:00Z', amount: 200 },
    { id: 3, date: '2028-12-31T12:00:00Z', amount: 300 }, // Should be excluded
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    service = new TransactionService();
    (service as any).pubSub = mockPubSub as unknown as PubSub; // Replace PubSub with mock
  });

  /**
   * Test Case 1: Verify transactions are filtered correctly for January 2029.
   */
  it('should filter transactions occurring in January 2029', () => {
    // Act: Call the filterTxByDate method
    const result = service.filterTxByDate(mockTransactions);

    // Assert: Only transactions with date in January 2029 are included, sorted by date
    expect(result).toEqual([
      { id: 1, date: '2029-01-05T12:00:00Z', amount: 100 },
      { id: 2, date: '2029-01-10T12:00:00Z', amount: 200 },
    ]);
  });

  /**
   * Test Case 2: Ensure API data is fetched, compared, and published when updated.
   */
  it('should fetch transactions and publish updates when data changes', async () => {
    // Arrange: Mock axios response
    (axios.get as jest.Mock).mockResolvedValue({ data: mockTransactions });

    // Act: Call the fetchAndPublishTransactions method
    await (service as any).fetchAndPublishTransactions();

    // Assert: Verify PubSub publish is called with the correct event and filtered transactions
    expect(axios.get).toHaveBeenCalledWith(MOCK_API_URL);
    expect(mockPubSub.publish).toHaveBeenCalledWith(TRANSACTIONS_UPDATED_EVENT, {
      transactionsUpdated: [
        { id: 1, date: '2029-01-05T12:00:00Z', amount: 100 },
        { id: 2, date: '2029-01-10T12:00:00Z', amount: 200 },
      ],
    });
  });

  /**
   * Test Case 3: Verify getTransactions returns cached transactions.
   */
  it('should return the current list of transactions', async () => {
    // Arrange: Set transactions in service
    (service as any).transactions = mockTransactions;

    // Act: Call getTransactions
    const result = await service.getTransactions();

    // Assert: Verify it returns the cached transactions
    expect(result).toEqual(mockTransactions);
  });
});
