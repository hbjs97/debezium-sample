import { Injectable, Logger } from '@nestjs/common';
import { ProductQueryRepository } from 'src/modules/product';
import { UserQueryRepository } from 'src/modules/user';
import { Order } from '../domain';
import { OrderCommandRepository, OrderQueryRepository } from '../infrastructure';
import { OrderDto } from './dto';

@Injectable()
export class OrderService {
  private readonly logger: Logger = new Logger(OrderService.name);

  constructor(
    private readonly query: OrderQueryRepository,
    private readonly command: OrderCommandRepository,
    private readonly userQuery: UserQueryRepository,
    private readonly productQuery: ProductQueryRepository,
  ) {}

  async create(userId: string, productId: string): Promise<OrderDto> {
    const user = await this.userQuery.getById(userId);
    const product = await this.productQuery.getById(productId);
    await this.command.save(Order.of(user, product));
    return OrderDto.of(user, product);
  }
}
