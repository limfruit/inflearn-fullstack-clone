-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('ONLINE', 'CHALLENGE');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('LECTURE', 'MISSION', 'QUIZ');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "uses_units" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "type" "UnitType" NOT NULL DEFAULT 'LECTURE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "section_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "duration" INTEGER,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "video_storage_info" JSONB,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_activities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "last_visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unit_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_submission_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_submission_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "units_course_id_idx" ON "units"("course_id");

-- CreateIndex
CREATE INDEX "units_section_id_idx" ON "units"("section_id");

-- CreateIndex
CREATE INDEX "unit_activities_course_id_idx" ON "unit_activities"("course_id");

-- CreateIndex
CREATE INDEX "unit_activities_unit_id_idx" ON "unit_activities"("unit_id");

-- CreateIndex
CREATE INDEX "unit_activities_user_id_idx" ON "unit_activities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "unit_activities_user_id_course_id_unit_id_key" ON "unit_activities"("user_id", "course_id", "unit_id");

-- CreateIndex
CREATE INDEX "unit_submissions_course_id_idx" ON "unit_submissions"("course_id");

-- CreateIndex
CREATE INDEX "unit_submissions_unit_id_idx" ON "unit_submissions"("unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "unit_submissions_user_id_unit_id_key" ON "unit_submissions"("user_id", "unit_id");

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_activities" ADD CONSTRAINT "unit_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_activities" ADD CONSTRAINT "unit_activities_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_activities" ADD CONSTRAINT "unit_activities_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_submissions" ADD CONSTRAINT "unit_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_submissions" ADD CONSTRAINT "unit_submissions_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_submission_comments" ADD CONSTRAINT "unit_submission_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_submission_comments" ADD CONSTRAINT "unit_submission_comments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "unit_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
