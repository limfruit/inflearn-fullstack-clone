import { Body, Controller, Post, Get, Req, UseGuards, ParseUUIDPipe, Param } from '@nestjs/common';
import { Request } from 'express';
import { UnitCoursesService } from './unit-courses.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { Course as CourseEntity } from 'src/_gen/prisma-class/course';
import { CreateCourseDto } from './dto/create-course.dto';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optional-access-token.guard';
import { CourseDetailDto } from './dto/course-detail.dto';

@ApiTags('UnitCourse')
@Controller('unit-courses')
export class UnitCoursesController {
  constructor(private readonly unitCoursesService: UnitCoursesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
      description: '코스 생성',
      type: CourseEntity
    })
    create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
      return this.unitCoursesService.create(req.user!.sub, createCourseDto);
    }

    @Get(':id')
    @UseGuards(OptionalAccessTokenGuard)
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
      description: '코스 상세 정보',
      type: CourseDetailDto,
    })
    findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
      return this.unitCoursesService.findOne(id, req.user?.sub);
    }

    
}
