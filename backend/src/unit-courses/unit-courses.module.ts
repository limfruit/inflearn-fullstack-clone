import { Module } from '@nestjs/common';
import { UnitCoursesService } from './unit-courses.service';
import { UnitCoursesController } from './unit-courses.controller';

@Module({
  controllers: [UnitCoursesController],
  providers: [UnitCoursesService],
})
export class UnitCoursesModule {}
