import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({ order: { id: "ASC" } });
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    // UPDATE ... RETURNING avoids recreating a concurrently deleted record.
    const result = await this.productRepository.createQueryBuilder()
      .update(Product).set(dto).where("id = :id", { id }).returning("*").execute();
    if (!result.affected) throw new NotFoundException("Product not found");
    return this.productRepository.create({
      ...result.raw[0],

    } as Product);
  }

  async deleteProduct(id: string): Promise<{ message: string; id: string }> {
    const result = await this.productRepository.delete({ id });
    if (!result.affected) throw new NotFoundException("Product not found");
    return { message: "Product deleted successfully", id };
  }
}
