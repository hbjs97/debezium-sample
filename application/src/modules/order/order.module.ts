import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product';
import { UserModule } from '../user';
import { OrderService } from './application';
import { Order } from './domain';
import { OrderCommandRepository, OrderQueryRepository } from './infrastructure';
import { OrderController } from './interface';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderQueryRepository, OrderCommandRepository],
})
export class OrderModule {}
