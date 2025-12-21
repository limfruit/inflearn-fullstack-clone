import { ApiProperty } from "@nestjs/swagger";
import { UnitType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUnitDto {
    @ApiProperty({ description: '개별 유닛 제목' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: '개별 유닛 타입', required: false })
    @IsEnum(UnitType)
    @IsOptional()
    type?: UnitType; // LECTURE | MISSION
  }