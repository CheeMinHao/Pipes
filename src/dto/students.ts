import { IsString } from 'class-validator';

export default class Students {
  @IsString() surname: string;
  @IsString() given_name: string;
  @IsString() intake: string;
  @IsString() course_name: string;
  @IsString() campus_name: string;
}
