import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "employees" })
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", name: "name" })
  name!: string;

  @Column({ type: "varchar", name: "email" })
  email!: string;

  @Column({ type: "varchar", name: "phone" })
  phone!: string;

  @Column({ type: "varchar", name: "password" })
  password!: string;

  @Column({ type: "integer", name: "age" })
  age!: number;

  @Column({ type: "integer", name: "years_of_working" })
  yearsOfWorking!: number;
}
