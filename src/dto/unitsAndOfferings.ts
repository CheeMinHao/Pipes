import { IsNumber, IsString, IsArray } from 'class-validator';

export default class UnitsAndOfferings {
  @IsString() name: string;
  @IsString() overview: string;
  @IsString() unit_code: string;
  @IsString() faculty_name: string;
  @IsString() categories: string;
  @IsString() credit_point: string;
  @IsArray() offerings: Object[];
}
