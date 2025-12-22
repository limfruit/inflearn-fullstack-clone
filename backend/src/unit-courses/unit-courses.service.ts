import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import slugify from 'lib/slugify';
import { CourseDetailDto } from './dto/course-detail.dto';
import { SearchUnitCourseDto } from './dto/search-unit-course.dto';
import { SearchUnitCourseResponseDto } from './dto/search-unit-response.dto';

@Injectable()
export class UnitCoursesService {
    constructor(private prisma: PrismaService) {}

    async create(
        userId: string,
        createCourseDto: CreateCourseDto,
    ): Promise<Course> {

        return this.prisma.course.create({
            data: {
            title: createCourseDto.title,
            slug: slugify(createCourseDto.title),
            instructorId: userId,
            status: 'DRAFT',
            type: createCourseDto.type,
            usesUnits: true,
            },
        });
    }

    async findOne(id: string, userId?: string): Promise<CourseDetailDto | null> {
        const course = await this.prisma.course.findUnique({
          where: { id },
          include: {
            instructor: true,
            categories: true,
            reviews: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            enrollments: true,
            sections: {
              include: {
                lectures: {
                  select: {
                    id: true,
                    title: true,
                    isPreview: true,
                    duration: true,
                    order: true,
                    videoStorageInfo: true,
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
                units: {
                  select: {
                    id: true,
                    type: true,
                    title: true,
                    description: true,
                    order: true,
                    duration: true,
                    isPreview: true,
                    videoStorageInfo: true,
                    content: true,
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
            _count: {
              select: {
                lectures: true,
                units: true,
                enrollments: true,
                reviews: true,
              },
            },
          },
        });
      
        if (!course) {
          return null;
        }
      
        const isInstructor = course.instructorId === userId;
      
        const isEnrolled = userId
          ? !!(await this.prisma.courseEnrollment.findFirst({
              where: {
                userId,
                courseId: id,
              },
            }))
          : false;
      
        const averageRating =
          course.reviews.length > 0
            ? course.reviews.reduce((sum, review) => sum + review.rating, 0) /
              course.reviews.length
            : 0;
      
        // lecture와 unit(LECTURE 타입)의 총 시간 계산
        const totalDuration = course.sections.reduce((sum, section) => {
          // 기존 lecture 시간
          const lectureDuration = section.lectures.reduce(
            (lecSum, lecture) => lecSum + (lecture.duration || 0),
            0,
          );
          
          // unit 중 LECTURE 타입의 시간만 계산
          const unitLectureDuration = section.units
            .filter((unit) => unit.type === 'LECTURE')
            .reduce((unitSum, unit) => unitSum + (unit.duration || 0), 0);
          
          return sum + lectureDuration + unitLectureDuration;
        }, 0);
      
        // videoStorageInfo 필터링 (강사, 수강생, 미리보기만 접근 가능)
        const sectionsWithFilteredInfo = course.sections.map((section) => ({
          ...section,
          // 기존 lectures 필터링
          lectures: section.lectures.map((lecture) => ({
            ...lecture,
            videoStorageInfo:
              isInstructor || isEnrolled || lecture.isPreview
                ? lecture.videoStorageInfo
                : null,
          })),
          // units 필터링 (LECTURE 타입만 videoStorageInfo 필터링)
          units: section.units.map((unit) => ({
            ...unit,
            videoStorageInfo:
              unit.type === 'LECTURE' && (isInstructor || isEnrolled || unit.isPreview)
                ? unit.videoStorageInfo
                : null,
            // MISSION 타입은 content를 강사나 수강생만 볼 수 있도록
            content:
              unit.type === 'MISSION' && (isInstructor || isEnrolled)
                ? unit.content
                : null,
          })),
        }));
      
        // 총 강의 수 = 기존 lectures + unit 중 LECTURE 타입
        const totalLectureCount = course._count.lectures + 
          course.sections.reduce((sum, section) => 
            sum + section.units.filter(unit => unit.type === 'LECTURE').length, 0
          );
      
        // 총 미션 수 (선택적으로 추가)
        const totalMissionCount = course.sections.reduce((sum, section) => 
          sum + section.units.filter(unit => unit.type === 'MISSION').length, 0
        );
      
        const result = {
          ...course,
          sections: sectionsWithFilteredInfo,
          isEnrolled,
          totalEnrollments: course._count.enrollments,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: course._count.reviews,
          totalLectures: totalLectureCount,
          totalMissions: totalMissionCount, 
          totalDuration,
        };
      
        return result as unknown as CourseDetailDto;
      }

      async searchCourses(
        searchUnitCourseDto: SearchUnitCourseDto,
      ): Promise<SearchUnitCourseResponseDto> {
        const { q, category, priceRange, sortBy, order, page, pageSize, courseType } = searchUnitCourseDto;
      
        const where: Prisma.CourseWhereInput = {};
      
        if (q) {
          where.OR = [
            // title에 포함된 키워드
            {
              title: {
                contains: q,
                mode: 'insensitive', // 대소문자 구분없이 검색
              },
            },
            // instructor(지식공유자) 이름이 포함된 키워드
            {
              instructor: {
                name: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
            },
          ];
        }
      
        if (category) {
          where.categories = {
            some: { // 카테고리 중 어떤거라도 해당된다면,,
              slug: category,
            },
          };
        }

        // courseType 필터링 추가
        if (courseType) {
          where.type = courseType;
        }
      
        if (priceRange) {
          const priceConditions: any = {};
          if (priceRange.min !== undefined) {
            priceConditions.gte = priceRange.min;
          }
          if (priceRange.max !== undefined) {
            priceConditions.lte = priceRange.max;
          }
          if (Object.keys(priceConditions).length > 0) {
            where.price = priceConditions;
          }
        }
      
        const orderBy: Prisma.CourseOrderByWithRelationInput = {};
        if (sortBy === 'price') {
          orderBy.price = order as 'asc' | 'desc';
        }
      
        const skip = (page - 1) * pageSize;
        const totalItems = await this.prisma.course.count({ where });
        const courses = await this.prisma.course.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
            categories: true,
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              },
            },
          },
        });
      
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;
      
        return {
          courses: courses as any[],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            hasNext,
            hasPrev,
          },
        };
      }
    
}
