import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '코스 제목' }) // 실제 swagger 문서에 해당 설명이 따라붙음
  @IsString()
  title: string;
}