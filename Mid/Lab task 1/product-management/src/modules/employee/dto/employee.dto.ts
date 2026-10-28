import { IsString, IsNotEmpty, IsEmail, IsNumber, IsInt, Min, Max, MaxLength, Matches, ValidateIf } from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "name must contain a non-whitespace character" })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "email must contain a non-whitespace character" })
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "phone must contain a non-whitespace character" })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "password must contain a non-whitespace character" })
  password!: string;

  @IsInt()
  @Min(0)
  @Max(2147483647)
  age!: number;

  @IsInt()
  @Min(0)
  @Max(2147483647)
  yearsOfWorking!: number;

}

export class UpdateEmployeeDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "name must contain a non-whitespace character" })
  name?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "email must contain a non-whitespace character" })
  @IsEmail()
  email?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "phone must contain a non-whitespace character" })
  phone?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "password must contain a non-whitespace character" })
  password?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  age?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  yearsOfWorking?: number;

}
