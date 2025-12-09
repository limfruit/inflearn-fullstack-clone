import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cacheKey = 'categories:all';

    const cachedCategories = await this.cacheManager.get(cacheKey);
    if (cachedCategories) {
      // 캐시에서 조회
      console.log('캐시에서 조회');
      return cachedCategories;
    }

    const categories = this.prisma.courseCategory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    await this.cacheManager.set(cacheKey, categories, 10 * 1000);

    return categories;
  }

  async invalidateCache() {
    await this.cacheManager.del('categories:all');
  }
  // 서비스단에서 수동으로 구현했을때 장점 : 카테고리를 insert 했을 때 중간에 아무때나 invalidateCache 를 실행해서 캐시에 넣을 수 있음
}