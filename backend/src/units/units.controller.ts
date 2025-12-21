import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit as UnitEntity } from 'src/_gen/prisma-class/unit';
import { UnitActivity as UnitActivityEntity } from 'src/_gen/prisma-class/unit_activity';
import { Request } from 'express';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UpdateUnitActivityDto } from './dto/update-unit-activity.dto';

@ApiTags('Unit')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post('sections/:sectionId/units')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '새 유닛 생성' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiBody({ type: CreateUnitDto })
  @ApiOkResponse({
    description: '유닛 생성 성공',
    type: UnitEntity,
  })
  create(
    @Param('sectionId') sectionId: string,
    @Body() createUnitDto: CreateUnitDto,
    @Req() req: Request,
  ) {
    return this.unitsService.create(
      sectionId,
      createUnitDto,
      req.user.sub,
    );
  }

  @Get(':unitId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 유닛 상세 정보' })
  @ApiParam({ name: 'unitId', description: '개별 유닛 ID' })
  @ApiOkResponse({
    description: '개별 유닛 상세 정보 조회',
    type: UnitEntity,
  })
  findOne(@Param('unitId') unitId: string, @Req() req: Request) {
    return this.unitsService.findOne(unitId, req.user.sub);
  }

  @Patch(':unitId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 유닛 수정' })
  @ApiParam({ name: 'unitId', description: '개별 유닛 ID' })
  @ApiBody({ type: UpdateUnitDto })
  @ApiOkResponse({
    description: '개별 유닛 수정 성공',
    type: UnitEntity,
  })
  update(
    @Param('unitId') unitId: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @Req() req: Request,
  ) {
    return this.unitsService.update(
      unitId,
      updateUnitDto,
      req.user.sub,
    );
  }

  @Delete(':unitId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 유닛 삭제' })
  @ApiParam({ name: 'unitId', description: '개별 유닛 ID' })
  @ApiOkResponse({
    description: '개별 유닛 삭제 성공',
    type: UnitEntity,
  })
  delete(@Param('unitId') unitId: string, @Req() req: Request) {
    return this.unitsService.remove(unitId, req.user.sub);
  }

  @Put(':unitId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '유닛 강의 활동 이벤트 업데이트',
    type: UnitActivityEntity,
  })
  updateUnitActivity(
    @Req() req: Request,
    @Param('unitId') unitId: string,
    @Body() updateUnitActivityDto: UpdateUnitActivityDto,
  ) {
    return this.unitsService.updateUnitActivity(
      unitId,
      req.user.sub,
      updateUnitActivityDto,
    );
  }

  @Get(':unitId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '유닛 강의 활동 이벤트 조회',
    type: UnitActivityEntity,
  })
  getUnitActivity(
    @Req() req: Request,
    @Param('unitId') unitId: string,
  ) {
    return this.unitsService.getUnitActivity(unitId, req.user.sub);
  }
}
