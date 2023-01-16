import { Auth } from '@libs/decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto, ProductDto, ProductService } from '../application';

@ApiTags('product')
@Controller({ path: 'products', version: ['1'] })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 등록' })
  @ApiCreatedResponse({ type: ProductDto })
  @HttpCode(HttpStatus.CREATED)
  @Auth([])
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(createProductDto);
  }
}
