import "dotenv/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { Product } from "../modules/product/entities/product.entity";
import { Employee } from "../modules/employee/entities/employee.entity";
import { CreateLabTables1793100000000 } from "../database/migrations/1793100000000-create-lab-tables";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "advanceweb_lab1",
  entities: [Product, Employee],
  migrations: [CreateLabTables1793100000000],
  synchronize: false,
  logging: false,
};

export default new DataSource(dataSourceOptions);
