import { Resolver, Query, Subscription } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { PubSub } from 'graphql-subscriptions';
import { TransactionDTO } from '../dto/transaction.dto';

/**
* TransactionResolver handles GraphQL queries and subscriptions for transaction data.
* It enables clients to fetch all transactions and listen for real-time updates.
*/
@Resolver()
export class TransactionResolver {
  private readonly pubSub: PubSub;

  /**
  * Initializes the TransactionResolver and PubSub instance.
  * @param transactionService - The service handling transaction logic.
  */
  constructor(private readonly transactionService: TransactionService) {
    // Retrieve the PubSub instance from the service
    this.pubSub = this.transactionService.getPubSub();
  }

  /**
  * Fetches all transaction data from the service.
  * @returns An array of TransactionDTO objects containing transaction details.
  */
  @Query(() => [TransactionDTO], { description: 'Fetch all transactions' })
  async transactions() {
    return await this.transactionService.getTransactions();
  }

  /**
  * Subscribes to real-time updates for transaction data.
  * When transactions are updated, the changes are pushed to the clients.
  * 
  * @returns An async iterator for the 'TRANSACTIONS_UPDATED' event.
  */
  @Subscription(() => [TransactionDTO], {
    description: 'Listen for transaction updates',
    resolve: (payload) => payload.transactionsUpdated, // Extract the updated transactions
  })
  transactionsUpdated() {
    // Subscribe to the TRANSACTIONS_UPDATED event and return the async iterator
    return this.pubSub.asyncIterableIterator('TRANSACTIONS_UPDATED');
  }
}
