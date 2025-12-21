import { Module } from '@nestjs/common';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { SectionsModule } from './sections/sections.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { QuestionsModule } from './questions/questions.module';
import { CartsModule } from './carts/carts.module';
import { PaymentsModule } from './payments/payments.module';
import { BatchModule } from './batch/batch.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UnitsModule } from './units/units.module';
import { UnitCoursesModule } from './unit-courses/unit-courses.module';

@Module({
  imports: [
    SentryModule.forRoot(),

    CacheModule.register({
      ttl: 60 * 1000, // 1분 유지
      max: 1000, // 최대 1000개의 항목이 캐시될 수 있음
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal : true }), AuthModule, PrismaModule, CoursesModule, LecturesModule, SectionsModule, CategoriesModule, MediaModule, UsersModule, CommentsModule, QuestionsModule, CartsModule, PaymentsModule, BatchModule, UnitsModule, UnitCoursesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  
})
export class AppModule {}
