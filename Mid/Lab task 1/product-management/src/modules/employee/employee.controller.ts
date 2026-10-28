import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";
import { NonEmptyBodyPipe } from "../../common/pipes/non-empty-body.pipe";

@Controller("employees")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(dto);
  }

  @Get()
  getEmployees() {
    return this.employeeService.getEmployees();
  }

  @Get(":id")
  getEmployee(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.employeeService.getEmployee(id);
  }

  @Patch(":id")
  updateEmployee(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body(new NonEmptyBodyPipe()) dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.updateEmployee(id, dto);
  }

  @Delete(":id")
  deleteEmployee(@Param("id", new ParseUUIDPipe({ version: "4" })) id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
