import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NonEmptyBodyPipe implements PipeTransform {
  transform(value: Record<string, unknown>) {
    if (!value || !Object.values(value).some((field) => field !== undefined)) {
      throw new BadRequestException("Provide at least one field to update");
    }
    return value;
  }
}
