import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find({ order: { id: "ASC" } });
  }

  async getEmployee(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException("Employee not found");
    return employee;
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(dto);
    return this.employeeRepository.save(employee);
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    // UPDATE ... RETURNING avoids recreating a concurrently deleted record.
    const result = await this.employeeRepository.createQueryBuilder()
      .update(Employee).set(dto).where("id = :id", { id }).returning("*").execute();
    if (!result.affected) throw new NotFoundException("Employee not found");
    return this.employeeRepository.create({
      ...result.raw[0],
      yearsOfWorking: result.raw[0].years_of_working,
    } as Employee);
  }

  async deleteEmployee(id: string): Promise<{ message: string; id: string }> {
    const result = await this.employeeRepository.delete({ id });
    if (!result.affected) throw new NotFoundException("Employee not found");
    return { message: "Employee deleted successfully", id };
  }
}
