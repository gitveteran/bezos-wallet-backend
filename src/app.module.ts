import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Merchant } from './entities/merchant.entity';
import { MerchantResolver } from './merchant/merchant.resolver';
import { MerchantService } from './merchant/merchant.service';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',          // Database type
      database: 'bezos.sqlite',   // SQLite database file
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to entities
      synchronize: true,       // Auto sync DB schema (disable in production)
    }),
    TypeOrmModule.forFeature([Merchant]),

    // GraphQL Configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    })
  ],
  controllers: [AppController],
  providers: [AppService, MerchantResolver, MerchantService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const repository = this.dataSource.getRepository(Merchant);

    // Check if the table already contains any data
    const count = await repository.count();
    if (count > 0) {
      console.log('Database already initialized, skipping default data insert.');
      return; // Exit early if database is already initialized
    }

    // Insert default Bezos-related merchants if the table is empty
    const defaultMerchants = [
      { merchant: 'Amazon'},
      { merchant: 'Washington Post'},
      { merchant: 'Whole Foods'},
      { merchant: 'Blue Origin'},
    ];

    await repository.insert(defaultMerchants);
    console.log('Default Bezos-related merchants added to the database.');
  }
}
