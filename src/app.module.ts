import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',          // Database type
      database: 'bezos.sqlite',   // SQLite database file
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to entities
      synchronize: true,       // Auto sync DB schema (disable in production)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
