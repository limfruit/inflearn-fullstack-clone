// "use client";

// import { Course } from "@/generated/openapi-client";
// import Image from "next/image";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { BookOpen } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Progress } from "@/components/ui/progress";

// interface MyCoursesUIProps {
//   courses: Course[];
// }

// export default function MyCoursesUI({ courses }: MyCoursesUIProps) {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("latest");

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("ko-KR").format(price);
//   };

//   // 필터링된 강의 목록
//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch = course.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     // 카테고리 및 상태 필터링은 추후 구현 가능
//     return matchesSearch;
//   });

//   // 정렬된 강의 목록
//   const sortedCourses = [...filteredCourses].sort((a, b) => {
//     switch (sortBy) {
//       case "latest":
//         return (
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//       case "oldest":
//         return (
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//       case "title":
//         return a.title.localeCompare(b.title);
//       default:
//         return 0;
//     }
//   });

//   const handleCourseClick = (courseId: string) => {
//     router.push(`/courses/lecture?courseId=${courseId}`);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* 헤더 */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">내 학습</h1>
//         <p className="text-gray-600">
//           수강중인 강의를 확인하고 학습을 이어가세요.
//         </p>
//       </div>

//       {sortedCourses.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="mb-4">
//             <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-600 mb-2">
//               수강중인 강의가 없습니다
//             </h3>
//             <p className="text-gray-500">새로운 강의를 찾아보세요!</p>
//           </div>
//           <Button
//             onClick={() => router.push("/")}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             강의 둘러보기
//           </Button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {sortedCourses.map((course) => (
//             <div
//               key={course.id}
//               className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleCourseClick(course.id)}
//             >
//               {/* 썸네일 */}
//               <div className="relative aspect-video">
//                 <Image
//                   src={course.thumbnailUrl || "/placeholder-course.jpg"}
//                   alt={course.title}
//                   fill
//                   className="rounded-t-lg object-cover"
//                 />
//                 {/* 진행률 배지 */}
//                 <div className="absolute top-2 left-2">
//                   <Badge variant="secondary" className="bg-black/70 text-white">
//                     진행률 0%
//                   </Badge>
//                 </div>
//               </div>

//               {/* 강의 정보 */}
//               <div className="p-4">
//                 <h3 className="font-semibold text-sm mb-2 line-clamp-2">
//                   {course.title}
//                 </h3>

//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
//                   <span className="bg-gray-100 px-2 py-1 rounded">
//                     {course.level}
//                   </span>
//                   <span>무제한</span>
//                 </div>

//                 <div className="text-xs text-gray-500 mb-2">
//                   {course.instructor?.name}
//                 </div>

//                 {/* 진행률 바 */}
//                 <div className="mb-3">
//                   <div className="flex justify-between text-xs text-gray-500 mb-1">
//                     <span>
//                       0 /{" "}
//                       {course.sections?.reduce(
//                         (total, section) =>
//                           total + (section.lectures?.length || 0),
//                         0
//                       ) || 0}
//                       강
//                     </span>
//                     <span>0%</span>
//                   </div>
//                   <Progress value={0} className="h-1" />
//                 </div>

//                 {/* 가격 */}
//                 <div className="text-right">
//                   {course.discountPrice &&
//                   course.discountPrice < course.price ? (
//                     <div className="text-xs text-gray-400 line-through">
//                       ₩{formatPrice(course.price)}
//                     </div>
//                   ) : null}
//                   <div className="text-sm font-bold">
//                     ₩{formatPrice(course.discountPrice || course.price)}
//                   </div>
//                 </div>
//               </div>

//               {/* 마지막 학습일 */}
//               <div className="px-4 pb-4">
//                 <div className="text-xs text-gray-400">무제한</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Course } from "@/generated/openapi-client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, GraduationCap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

interface MyCoursesUIProps {
  courses: Course[];
}

type CourseType = "ONLINE" | "CHALLENGE";

export default function MyCoursesUI({ courses }: MyCoursesUIProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [activeTab, setActiveTab] = useState<CourseType | "ALL">("ALL");

  // URL의 courseType 파라미터에 따라 activeTab 설정
  useEffect(() => {
    const courseType = searchParams.get("courseType");
    if (courseType === "ONLINE" || courseType === "CHALLENGE") {
      setActiveTab(courseType);
    } else {
      setActiveTab("ALL");
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 탭에 따른 필터링
  const filteredByTab = courses.filter((course) => {
    if (activeTab === "ALL") return true;
    return (course as any).type === activeTab;
  });

  // 검색어 필터링
  const filteredCourses = filteredByTab.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // 정렬
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/lecture?courseId=${courseId}`);
  };

  const handleTabChange = (tab: CourseType | "ALL") => {
    setActiveTab(tab);
    if (tab === "ALL") {
      router.push("/my/courses");
    } else {
      router.push(`/my/courses?courseType=${tab}`);
    }
  };

  // 각 탭별 강의 수
  const onlineCount = courses.filter((c) => (c as any).type === "ONLINE").length;
  const challengeCount = courses.filter((c) => (c as any).type === "CHALLENGE").length;
  const allCount = courses.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">내 학습</h1>
        <p className="text-gray-600">
          수강중인 강의를 확인하고 학습을 이어가세요.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6 border-b">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabChange("ALL")}
            className={`pb-3 px-1 relative transition-colors ${
              activeTab === "ALL"
                ? "text-green-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <GraduationCap className="size-5" />
              <span>전체</span>
              <span className="text-sm">({allCount})</span>
            </div>
            {activeTab === "ALL" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("ONLINE")}
            className={`pb-3 px-1 relative transition-colors ${
              activeTab === "ONLINE"
                ? "text-green-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="size-5" />
              <span>강의</span>
              <span className="text-sm">({onlineCount})</span>
            </div>
            {activeTab === "ONLINE" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("CHALLENGE")}
            className={`pb-3 px-1 relative transition-colors ${
              activeTab === "CHALLENGE"
                ? "text-green-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <Trophy className="size-5" />
              <span>챌린지</span>
              <span className="text-sm">({challengeCount})</span>
            </div>
            {activeTab === "CHALLENGE" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
            )}
          </button>
        </div>
      </div>

      {sortedCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4">
            {activeTab === "CHALLENGE" ? (
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            ) : (
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {activeTab === "CHALLENGE"
                ? "참여 중인 챌린지가 없습니다"
                : activeTab === "ONLINE"
                ? "수강중인 강의가 없습니다"
                : "수강중인 콘텐츠가 없습니다"}
            </h3>
            <p className="text-gray-500">
              {activeTab === "CHALLENGE"
                ? "새로운 챌린지에 도전해보세요!"
                : "새로운 강의를 찾아보세요!"}
            </p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700"
          >
            {activeTab === "CHALLENGE" ? "챌린지 둘러보기" : "강의 둘러보기"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCourses.map((course) => {
            const courseType = (course as any).type as CourseType;
            const isChallenge = courseType === "CHALLENGE";

            return (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                {/* 썸네일 */}
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnailUrl || "/placeholder-course.jpg"}
                    alt={course.title}
                    fill
                    className="rounded-t-lg object-cover"
                  />
                  
                  {/* 타입 배지 */}
                  <div className="absolute top-2 right-2">
                    {isChallenge ? (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
                        <Trophy className="size-3" />
                        챌린지
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
                        <BookOpen className="size-3" />
                        강의
                      </Badge>
                    )}
                  </div>

                  {/* 진행률 배지 */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      진행률 0%
                    </Badge>
                  </div>
                </div>

                {/* 강의 정보 */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span>무제한</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    {course.instructor?.name}
                  </div>

                  {/* 진행률 바 */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        0 /{" "}
                        {course.sections?.reduce(
                          (total, section) =>
                            total + (section.lectures?.length || 0),
                          0
                        ) || 0}
                        {isChallenge ? "개" : "강"}
                      </span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-1" />
                  </div>

                  {/* 가격 */}
                  <div className="text-right">
                    {course.discountPrice &&
                    course.discountPrice < course.price ? (
                      <div className="text-xs text-gray-400 line-through">
                        ₩{formatPrice(course.price)}
                      </div>
                    ) : null}
                    <div className="text-sm font-bold">
                      ₩{formatPrice(course.discountPrice || course.price)}
                    </div>
                  </div>
                </div>

                {/* 마지막 학습일 */}
                <div className="px-4 pb-4">
                  <div className="text-xs text-gray-400">무제한</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}