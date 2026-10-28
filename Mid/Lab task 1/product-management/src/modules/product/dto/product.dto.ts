import { IsString, IsNotEmpty, IsEmail, IsNumber, IsInt, Min, Max, MaxLength, Matches, ValidateIf } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "name must contain a non-whitespace character" })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/\S/, { message: "category must contain a non-whitespace character" })
  category!: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  @Max(2147483647)
  quantity!: number;

}

export class UpdateProductDto {
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
  @Matches(/\S/, { message: "category must contain a non-whitespace character" })
  category?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  price?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  @Max(2147483647)
  quantity?: number;

}
