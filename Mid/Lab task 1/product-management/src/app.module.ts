import { Module } from "@nestjs/common";
import { PostgresDatabaseProviderModule } from "./providers/database/postgres/provider.module";
import { ProductModule } from "./modules/product/product.module";
import { EmployeeModule } from "./modules/employee/employee.module";

@Module({ imports: [PostgresDatabaseProviderModule, ProductModule, EmployeeModule] })
export class AppModule {}
