import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import axios from 'axios';
import { MOCK_API_URL, POLLING_INTERVAL_MS } from '../config';
import { TRANSACTIONS_UPDATED_EVENT } from './events';

/**
* TransactionService handles fetching transactions from an external API,
* monitoring for updates, and notifying subscribers through GraphQL subscriptions.
*/
@Injectable()
export class TransactionService implements OnModuleInit {
  private transactions = [];
  private readonly pubSub = new PubSub();

  /**
  * Lifecycle hook: Called when the module is initialized.
  * Starts polling the external API for transaction data.
  */
  async onModuleInit() {
    this.startPolling();
  }

  /**
   * Starts the polling mechanism:
   * 1. Fetches data immediately when the server starts.
   * 2. Polls the API every 10 seconds to check for updates.
  */
  startPolling() {
    this.fetchAndPublishTransactions(); // Immediate fetch on startup

    setInterval(async () => {
      this.fetchAndPublishTransactions();
    }, POLLING_INTERVAL_MS); // Poll every 10 seconds
  }
  
  /**
  * Filters transactions to only include those in January 2029.
  * @param transactions - Array of transactions with a date field.
  * @returns Filtered transactions occurring in January 2029.
  */
  filterTxByDate (TXs) {
    return TXs.filter((tx) => {
      const date = new Date(tx.date);
      return date.getUTCFullYear() === 2029 && date.getUTCMonth() === 0;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  /**
  * Fetches transactions from the Mock API and checks for updates.
  * If changes are detected, publishes the updated data to subscribers.
  */

  private async fetchAndPublishTransactions() {
    try {
      // Fetch transactions from the external API
      const response = await axios.get(MOCK_API_URL);
      const newTransactions = response.data;

      const filteredTxs = this.filterTxByDate(newTransactions);

      // Compare the fetched data with the current cache
      if (JSON.stringify(this.transactions) !== JSON.stringify(newTransactions)) {
        this.transactions = filteredTxs;

        // Publish updated transactions to subscribers
        await this.pubSub.publish(TRANSACTIONS_UPDATED_EVENT, {
          transactionsUpdated: this.transactions,
        });
      }
    } catch (error) {
      // Log errors if the API fetch fails
      console.error('Error fetching transactions:', error.message);
    }
  }

  /**
  * Returns the current list of transactions.
  * @returns The cached transaction data.
  */
  async getTransactions() {
    return this.transactions;
  }

  /**
  * Exposes the PubSub instance for use in GraphQL resolvers.
  * @returns The PubSub instance.
  */
  getPubSub() {
    return this.pubSub;
  }
}
