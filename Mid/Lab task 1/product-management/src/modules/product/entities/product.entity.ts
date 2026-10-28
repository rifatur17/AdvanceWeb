import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", name: "name" })
  name!: string;

  @Column({ type: "varchar", name: "category" })
  category!: string;

  @Column({ type: "double precision", name: "price" })
  price!: number;

  @Column({ type: "integer", name: "quantity" })
  quantity!: number;
}
