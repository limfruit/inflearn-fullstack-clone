import { ApiProperty } from '@nestjs/swagger';
import { CourseType } from '@prisma/client';
import {
  IsEnum,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '코스 타입' })
  @IsEnum(CourseType)
  type: CourseType; // ONLINE | CHALLENGE
}