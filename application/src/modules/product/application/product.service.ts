import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Product } from '../domain';
import { ProductCommandRepository, ProductQueryRepository } from '../infrastructure';
import { CreateProductDto, ProductDto } from './dto';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(private readonly query: ProductQueryRepository, private readonly command: ProductCommandRepository) {}

  async create({ name, price }: CreateProductDto): Promise<ProductDto> {
    const exist = await this.query.exists({ name });
    if (exist) throw new ConflictException('중복된 상품명입니다.');
    const product = await this.command.save(Product.from({ name, price }));
    return ProductDto.from(product);
  }
}
