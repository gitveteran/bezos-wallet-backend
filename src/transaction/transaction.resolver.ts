import { Resolver, Query, Subscription } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { PubSub } from 'graphql-subscriptions';
import { TransactionDTO } from '../dto/transaction.dto';

@Resolver()
export class TransactionResolver {
  private readonly pubSub: PubSub;

  constructor(private readonly transactionService: TransactionService) {
    // Use PubSub directly
    this.pubSub = this.transactionService.getPubSub();
  }

  @Query(() => [TransactionDTO], { description: 'Fetch all transactions' })
  async transactions() {
    return await this.transactionService.getTransactions();
  }

  @Subscription(() => [TransactionDTO], {
    description: 'Listen for transaction updates',
    resolve: (payload) => payload.transactionsUpdated,
  })
  transactionsUpdated() {
    // Properly use asyncIterator from PubSub
    return this.pubSub.asyncIterableIterator('TRANSACTIONS_UPDATED');
  }
}
