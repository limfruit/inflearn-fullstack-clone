import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiProperty({ description: '개별 유닛 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '개별 유닛 순서', required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: '개별 유닛 길이', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: '개별 유닛 무료(미리보기) 여부',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;

  @ApiProperty({ description: '개별 유닛 비디오 업로드 정보', required: false })
  @IsObject()
  @IsOptional()
  videoStorageInfo?: Record<string, any>;

  @ApiProperty({ description: '개별 유닛 내용', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}