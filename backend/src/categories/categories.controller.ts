import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseCategory as CourseCategoryEntity } from 'src/_gen/prisma-class/course_category';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('카테고리')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  @ApiOperation({ summary: '카테고리 리스트' })
  @ApiOkResponse({
    description: '카테고리를 성공적으로 가져옴',
    type: CourseCategoryEntity,
    isArray: true,
  })
  @UseInterceptors(CacheInterceptor) // 중간에 캐시가 요청을 가로채라고 알려주는 부분
  @CacheTTL(5 * 60 * 1000) // 처음 DB에서 조회한 후 5분 동안은 DB 조회 없이 인메모리 캐시를 사용해서 저장되어 있는걸 꺼내줌
  findAll() {
    console.log('카테고리 DB에서 조회');
    return this.categoriesService.findAll();
  }
}