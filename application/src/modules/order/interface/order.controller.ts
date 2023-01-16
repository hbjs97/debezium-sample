import { Auth, ReqUser } from '@libs/decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, OrderDto, OrderService } from '../application';

@ApiTags('order')
@Controller({ path: 'orders', version: ['1'] })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '주문' })
  @ApiCreatedResponse({ type: OrderDto })
  @HttpCode(HttpStatus.CREATED)
  @Auth([])
  @Post()
  async createProduct(@ReqUser() user: Payload, @Body() { productId }: CreateOrderDto): Promise<OrderDto> {
    return this.orderService.create(user.id, productId);
  }
}
