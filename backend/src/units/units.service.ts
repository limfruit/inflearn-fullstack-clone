import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UpdateUnitActivityDto } from './dto/update-unit-activity.dto';

@Injectable()
export class UnitsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        sectionId: string,
        createUnitDto: CreateUnitDto,
        userId: string,
      ) {
        const section = await this.prisma.section.findUnique({
          where: { id: sectionId },
          include: {
            course: {
              select: {
                instructorId: true,
              },
            },
          },
        });
    
        if (!section) {
          throw new NotFoundException('섹션을 찾을 수 없습니다.');
        }
    
        if (section.course.instructorId !== userId) {
          throw new UnauthorizedException(
            '이 섹션에 강의를 추가할 권한이 없습니다.',
          );
        }
    
        const lastUnit = await this.prisma.unit.findFirst({
          where: { sectionId },
          orderBy: { order: 'desc' },
        });
    
        const order = lastUnit ? lastUnit.order + 1 : 0;
    
        return this.prisma.unit.create({
          data: {
            ...createUnitDto,
            order,
            section: {
              connect: {
                id: sectionId,
              },
            },
            course: {
              connect: {
                id: section.courseId,
              },
            },
          },
        });
      }

      async update(
        unitId: string,
        updateUnitDto: UpdateUnitDto,
        userId: string,
      ) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: unitId },
          include: {
            course: {
              select: {
                instructorId: true,
              },
            },
          },
        });
    
        if (!unit) {
          throw new NotFoundException('개별 유닛을 찾을 수 없습니다.');
        }
    
        if (unit.course.instructorId !== userId) {
          throw new UnauthorizedException('이 유닛을 수정할 권한이 없습니다.');
        }
    
        return this.prisma.unit.update({
          where: { id: unitId },
          data: updateUnitDto,
        });
      }
    
      async findOne(unitId: string, userId: string) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: unitId },
          include: {
            course: {
              select: {
                instructorId: true,
              },
            },
          },
        });
    
        if (!unit) {
          throw new NotFoundException('개별 유닛을 찾을 수 없습니다.');
        }
    
        if (unit.course.instructorId !== userId) {
          throw new UnauthorizedException('이 유닛을 조회할 권한이 없습니다.');
        }
    
        return unit;
      }
    
      async remove(unitId: string, userId: string) {
        const unit = await this.prisma.unit.findUnique({
          where: { id: unitId },
          include: {
            course: {
              select: {
                instructorId: true,
              },
            },
          },
        });
    
        if (!unit) {
          throw new NotFoundException('개별 유닛을 찾을 수 없습니다.');
        }
    
        if (unit.course.instructorId !== userId) {
          throw new UnauthorizedException('이 유닛을 삭제할 권한이 없습니다.');
        }
    
        await this.prisma.unit.delete({
          where: { id: unitId },
        });
    
        return unit;
      }
    
      async updateUnitActivity(
        unitId: string,
        userId: string,
        updateUnitActivityDto: UpdateUnitActivityDto,
      ) {
        const unit = await this.prisma.unit.findUnique({
          where: {
            id: unitId,
          },
        });
    
        if (!unit) {
          throw new NotFoundException('유닛을 찾을 수 없습니다.');
        }
    
        const result = await this.prisma.unitActivity.upsert({
          where: {
            userId_courseId_unitId: {
              userId,
              courseId: unit.courseId,
              unitId,
            },
          },
          create: {
            userId,
            courseId: unit.courseId,
            unitId,
            progress: updateUnitActivityDto.progress,
            duration: updateUnitActivityDto.duration,
            isCompleted: updateUnitActivityDto.isCompleted,
            lastVisitedAt: updateUnitActivityDto.lastVisitedAt,
          },
          update: {
            progress: updateUnitActivityDto.progress,
            duration: updateUnitActivityDto.duration,
            isCompleted: updateUnitActivityDto.isCompleted,
            lastVisitedAt: updateUnitActivityDto.lastVisitedAt,
          },
        });
    
        return result;
      }
    
      async getUnitActivity(unitId: string, userId: string) {
        const unit = await this.prisma.unit.findUnique({
          where: {
            id: unitId,
          },
        });
    
        if (!unit) {
          throw new NotFoundException('유닛을 찾을 수 없습니다.');
        }
    
        const result = await this.prisma.unitActivity.findUnique({
          where: {
            userId_courseId_unitId: {
              userId,
              courseId: unit.courseId,
              unitId,
            },
          },
        });
    
        return result;
      }
}
