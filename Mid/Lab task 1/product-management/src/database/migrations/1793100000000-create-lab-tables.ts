import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLabTables1793100000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(255) NOT NULL,
      category varchar(255) NOT NULL,
      price double precision NOT NULL CHECK (price>=0 AND price < 'Infinity'::float8),
      quantity integer NOT NULL CHECK (quantity>=0)
    )`);
    await queryRunner.query(`CREATE TABLE employees (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      phone varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      age integer NOT NULL CHECK (age>=0),
      years_of_working integer NOT NULL CHECK (years_of_working>=0)
    )`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE employees");
    await queryRunner.query("DROP TABLE products");
  }
}
