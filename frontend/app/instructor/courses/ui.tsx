// "use client";

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Pencil, X } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Course } from "@/generated/openapi-client";

// export default function UI({ courses }: { courses: Course[] }) {
//   const router = useRouter();

//   return (
//     <div className="w-full p-6">
//       <h1 className="text-2xl font-bold mb-6">강의 관리</h1>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>이미지</TableHead>
//             <TableHead>강의명</TableHead>
//             <TableHead>평점</TableHead>
//             <TableHead>총 수강생</TableHead>
//             <TableHead>질문</TableHead>
//             <TableHead>가격 (할인가)</TableHead>
//             <TableHead>총 수입</TableHead>
//             <TableHead>상태</TableHead>
//             <TableHead>관리</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {courses && courses.length > 0 ? (
//             courses.map((course: Course) => {
//               const avgRating = 0;
//               const totalStudents = 0;
//               const totalQuestions = 0;
//               const price = course.price;
//               const discountPrice = course.discountPrice;
//               const totalRevenue = 0;
//               const status =
//                 course.status === "PUBLISHED" ? "게시중" : "임시저장";
//               return (
//                 <TableRow key={course.id}>
//                   <TableCell>
//                     <Image
//                       src={course.thumbnailUrl || "/logo/inflearn.png"}
//                       alt={course.title}
//                       width={80}
//                       height={80}
//                       className="rounded bg-white border object-contain"
//                     />
//                   </TableCell>
//                   <TableCell>{course.title}</TableCell>
//                   <TableCell>{avgRating}</TableCell>
//                   <TableCell>{totalStudents}</TableCell>
//                   <TableCell>{totalQuestions}</TableCell>
//                   <TableCell>
//                     {discountPrice ? (
//                       <>
//                         <span className="line-through text-gray-400 mr-1">
//                           ₩{price.toLocaleString()}
//                         </span>
//                         <span className="text-green-700 font-bold">
//                           ₩{discountPrice.toLocaleString()}
//                         </span>
//                       </>
//                     ) : price ? (
//                       `₩${price.toLocaleString()}`
//                     ) : (
//                       "미설정"
//                     )}
//                   </TableCell>
//                   <TableCell>₩{totalRevenue.toLocaleString()}</TableCell>
//                   <TableCell>{status}</TableCell>
//                   <TableCell className="flex flex-col gap-2 justify-center h-full">
//                     <Button
//                       onClick={() => {
//                         const confirmed =
//                           window.confirm("정말 삭제하시겠습니까?");
//                         console.log(confirmed);
//                       }}
//                       variant="destructive"
//                       size="sm"
//                     >
//                       <X className="w-4 h-4 mr-1" /> 강의 삭제
//                     </Button>
//                     <Button
//                       onClick={() =>
//                         router.push(`/course/${course.id}/edit/course_info`)
//                       }
//                       variant="outline"
//                       size="sm"
//                     >
//                       <Pencil className="w-4 h-4 mr-1" /> 강의 수정
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               );
//             })
//           ) : (
//             <TableRow>
//               <TableCell colSpan={9} className="text-center text-gray-400">
//                 강의가 없습니다.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, X, BookOpen, Trophy, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Course } from "@/generated/openapi-client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";

type CourseType = "ONLINE" | "CHALLENGE";

export default function UI({ courses }: { courses: Course[] }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<CourseType | "ALL">("ALL");
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  // URL의 courseType 파라미터에 따라 activeTab 설정
  useEffect(() => {
    const courseType = searchParams.get("courseType");
    if (courseType === "ONLINE" || courseType === "CHALLENGE") {
      setActiveTab(courseType);
    } else {
      setActiveTab("ALL");
    }
  }, [searchParams]);

  const handleTabChange = (tab: CourseType | "ALL") => {
    setActiveTab(tab);
    if (tab === "ALL") {
      router.push("/instructor/courses");
    } else {
      router.push(`/instructor/courses?courseType=${tab}`);
    }
  };

  // 탭에 따른 필터링
  const filteredCourses = courses.filter((course) => {
    if (activeTab === "ALL") return true;
    return (course as any).type === activeTab;
  });

  // 각 탭별 강의 수
  const onlineCount = courses.filter((c) => (c as any).type === "ONLINE").length;
  const challengeCount = courses.filter((c) => (c as any).type === "CHALLENGE").length;
  const allCount = courses.length;


    const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      setDeletingCourseId(courseId);
      const { data, error } = await api.deleteCourse(courseId);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setDeletingCourseId(null);
      toast.success("강의가 삭제되었습니다.");
    },
  });


  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">강의 관리</h1>

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
              <span>일반 강의</span>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이미지</TableHead>
            <TableHead>강의명</TableHead>
            <TableHead>타입</TableHead>
            <TableHead>평점</TableHead>
            <TableHead>총 수강생</TableHead>
            <TableHead>질문</TableHead>
            <TableHead>가격 (할인가)</TableHead>
            <TableHead>총 수입</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course: Course) => {
              const avgRating = 0;
              const totalStudents = 0;
              const totalQuestions = 0;
              const price = course.price;
              const discountPrice = course.discountPrice;
              const totalRevenue = 0;
              const status =
                course.status === "PUBLISHED" ? "게시중" : "임시저장";
              const courseType = (course as any).type as CourseType;
              const isChallenge = courseType === "CHALLENGE";

              return (
                <TableRow key={course.id}>
                  <TableCell>
                    <Image
                      src={course.thumbnailUrl || "/logo/inflearn.png"}
                      alt={course.title}
                      width={80}
                      height={80}
                      className="rounded bg-white border object-contain"
                    />
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {isChallenge ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                        <Trophy className="size-3" />
                        챌린지
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        <BookOpen className="size-3" />
                        일반 강의
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{avgRating}</TableCell>
                  <TableCell>{totalStudents}</TableCell>
                  <TableCell>{totalQuestions}</TableCell>
                  <TableCell>
                    {discountPrice ? (
                      <>
                        <span className="line-through text-gray-400 mr-1">
                          ₩{price.toLocaleString()}
                        </span>
                        <span className="text-green-700 font-bold">
                          ₩{discountPrice.toLocaleString()}
                        </span>
                      </>
                    ) : price ? (
                      `₩${price.toLocaleString()}`
                    ) : (
                      "미설정"
                    )}
                  </TableCell>
                  <TableCell>₩{totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell className="flex flex-col gap-2 justify-center h-full">
                    <Button
                      onClick={() => {
                        const confirmed = window.confirm("정말 삭제하시겠습니까?");
                        if (!confirmed) return;

                        deleteCourseMutation.mutate(course.id);
                      }}
                      variant="destructive"
                      size="sm"
                      disabled={deleteCourseMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-1" /> 
                      {
                      deletingCourseId === course.id &&
                      deleteCourseMutation.isPending ? "삭제 중..." : "강의 삭제"}
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/course/${course.id}/edit/course_info`)
                      }
                      variant="outline"
                      size="sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> 강의 수정
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-400 py-8">
                {activeTab === "CHALLENGE"
                  ? "챌린지가 없습니다."
                  : activeTab === "ONLINE"
                  ? "일반 강의가 없습니다."
                  : "강의가 없습니다."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}