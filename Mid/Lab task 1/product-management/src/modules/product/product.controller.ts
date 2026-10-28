import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { NonEmptyBodyPipe } from "../../common/pipes/non-empty-body.pipe";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Get(":id")
  getProduct(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.productService.getProduct(id);
  }

  @Patch(":id")
  updateProduct(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body(new NonEmptyBodyPipe()) dto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(":id")
  deleteProduct(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.productService.deleteProduct(id);
  }
}
