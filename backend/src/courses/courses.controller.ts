import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Request } from 'express';
import { CreateCourseDto } from './dto/create-course.dto';
import { Prisma } from '@prisma/client';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course as CourseEntity } from 'src/_gen/prisma-class/course';
import { SearchCourseResponseDto } from './dto/search-response.dto';
import { SearchCourseDto } from './dto/search-course.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optional-access-token.guard';
import { GetFavoriteResponseDto } from './dto/favorite.dto';
import { CourseFavorite as CourseFavoriteEntity } from 'src/_gen/prisma-class/course_favorite';
import { LectureActivity as LectureActivityEntity } from 'src/_gen/prisma-class/lecture_activity';
import { CourseReview as CourseReviewEntity } from 'src/_gen/prisma-class/course_review';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InstructorReplyDto } from './dto/instructor-reply.dto';
import { CourseReviewsResponseDto } from './dto/course-reviews-response.dto';

@ApiTags('코스') // swagger 태그
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token') //ll 엑세스토큰을 받아야하는 api 임을 알려줌
  @ApiOkResponse({
    description: '코스 생성',
    type: CourseEntity
  })
  create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(req.user!.sub, createCourseDto); // req.user.sub - 실제 유저의 id
  }

  @Get('instructor')
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 목록',
    type: CourseEntity,
    isArray: true
  })
  findAllInstructorCourses(
    @Req() req: Request,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.coursesService.findAll({
      where: {
        instructorId: req.user.sub,
      },
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get('my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '수강하는 코스 목록',
    type: CourseEntity,
    isArray: true,
  })
  findAllMyCourses(@Req() req: Request) {
    return this.coursesService.findAllMyCourses(req.user.sub);
  }


  // @Get(':id')
  // @ApiQuery({
  //   name: 'include',
  //   required: false,
  //   description: 'sections,lectures,courseReviews 등 포함할 관계 지정',
  // })
  // @ApiOkResponse({
  //   description: '코스 상세 정보',
  //   type: CourseEntity // Course 그대로는 type으로 쓸 수 없음
  // })
  // findOne(
  //   @Param('id', ParseUUIDPipe) id: string, // ParseUUIDPipe - uuid 인지 검사해주는 pipe 함수
  //   @Query('include') include?: string,
  // ) {
  //   const includeArray = include ? include.split(',') : undefined;

  //   let includeObject: Prisma.CourseInclude;

  //   if (
  //     includeArray?.includes('sections') &&
  //     includeArray?.includes('lectures')
  //   ) {
  //     const otherInclude = includeArray.filter(
  //       (item) => !['sections', 'lectures'].includes(item),
  //     );
  //     includeObject = {
  //       sections: {
  //         include: {
  //           lectures: {
  //             orderBy: {
  //               order: 'asc',
  //             },
  //           },
  //         },
  //         orderBy: {
  //           order: 'asc',
  //         },
  //       },
  //       ...otherInclude.map((item) => ({
  //         [item]: true,
  //       })),
  //     };
  //   } else {
  //     includeObject = {
  //       ...includeArray?.map((item) => ({
  //         [item]: true,
  //       })),
  //     } as Prisma.CourseInclude;
  //   }

  //   return this.coursesService.findOne(id, includeObject);
  // }

  @Get(':id')
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 상세 정보',
    type: CourseDetailDto,
  })
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id, req.user?.sub);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 수정',
    type: CourseEntity
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, req.user!.sub, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 삭제',
    type: CourseEntity
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.coursesService.delete(id, req.user!.sub);
  }

  @Post('search')
  @ApiOkResponse({
    description: '코스 검색',
    type: SearchCourseResponseDto,
  })
  search(@Body() searchCourseDto: SearchCourseDto) {
    return this.coursesService.searchCourses(searchCourseDto);
  }

  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  addFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.addFavorite(id, req.user.sub);
  }

  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  removeFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.removeFavorite(id, req.user.sub);
  }

  @Get(':id/favorite')
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: GetFavoriteResponseDto })
  getFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getFavorite(id, req.user?.sub);
  }

  @Get('favorites/my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: CourseFavoriteEntity, isArray: true })
  getMyFavorites(@Req() req: Request) {
    return this.coursesService.getMyFavorites(req.user.sub);
  }

  @Post(':id/enroll')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  enrollCourse(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.enrollCourse(id, req.user.sub);
  }

  @Get(':courseId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '개별 강의 활동 이벤트 조회',
    type: LectureActivityEntity,
    isArray: true,
  })
  getLectureActivity(@Req() req: Request, @Param('courseId') courseId: string) {
    return this.coursesService.getAllLectureActivities(courseId, req.user.sub);
  }

  @Get(':courseId/reviews')
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 리뷰 조회',
    type: CourseReviewsResponseDto,
  })
  getCourseReviews(
    @Req() req: Request,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort') sort: 'latest' | 'oldest' | 'rating_high' | 'rating_low',
  ) {
    return this.coursesService.getCourseReviews(
      courseId,
      page,
      pageSize,
      sort,
      req.user?.sub,
    );
  }

  @Post(':courseId/reviews')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '수강평 작성',
    type: CourseReviewEntity,
  })
  createReview(
    @Req() req: Request,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.coursesService.createReview(
      courseId,
      req.user.sub,
      createReviewDto,
    );
  }

  @Put('reviews/:reviewId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '수강평 수정',
    type: CourseReviewEntity,
  })
  updateReview(
    @Req() req: Request,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.coursesService.updateReview(
      reviewId,
      req.user.sub,
      updateReviewDto,
    );
  }

  @Delete('reviews/:reviewId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '수강평 삭제',
  })
  deleteReview(
    @Req() req: Request,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ) {
    return this.coursesService.deleteReview(reviewId, req.user.sub);
  }

  @Put('reviews/:reviewId/instructor-reply')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강사 답변 작성/수정',
    type: CourseReviewEntity,
  })
  createInstructorReply(
    @Req() req: Request,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() instructorReplyDto: InstructorReplyDto,
  ) {
    return this.coursesService.createInstructorReply(
      reviewId,
      req.user.sub,
      instructorReplyDto,
    );
  }

  @Get('reviews/instructor')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강사의 모든 강의의 리뷰 조회',
    type: CourseReviewEntity,
    isArray: true,
  })
  getInstructorReviews(@Req() req: Request) {
    return this.coursesService.getInstructorReviews(req.user.sub);
  }
}

