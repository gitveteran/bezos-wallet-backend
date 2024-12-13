import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Merchant } from './entities/merchant.entity';
import { MerchantResolver } from './merchant/merchant.resolver';
import { MerchantService } from './merchant/merchant.service';

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
export class AppModule {}
