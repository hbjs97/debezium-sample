import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './application';
import { ProductCommandRepository, ProductQueryRepository } from './infrastructure';
import { ProductController } from './interface';
import { Product } from './domain';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductQueryRepository, ProductCommandRepository],
  exports: [ProductService, ProductQueryRepository],
})
export class ProductModule {}
