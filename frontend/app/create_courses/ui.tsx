"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import * as api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CourseType = "ONLINE" | "CHALLENGE";

export default function UI() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<CourseType>("ONLINE");

  const createCourseMutation = useMutation({
    mutationFn: () => api.createUnitCourse(title, selectedType),
    onSuccess: (res) => {
      if (res.data && !res.error) {
        router.push(`/course/${res.data.id}/edit/course_info`);
      }
      if (res.error) {
        toast.error(res.error as string);
      }
    },
  });

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    createCourseMutation.mutate();
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[90vh] flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          어떤 강의를 만드시겠어요?
        </h2>
        <p className="text-gray-500">
          너무 고민하지마세요. 제목은 언제든 수정 가능해요 :)
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedType("ONLINE")}
          className={`cursor-pointer relative p-8 rounded-lg border-2 transition-all ${
            selectedType === "ONLINE"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`text-4xl ${selectedType === "ONLINE" ? "scale-110" : ""} transition-transform`}>
              📚
            </div>
            <h3 className="font-bold text-lg">일반 강의</h3>
            {/* <p className="text-sm text-gray-600 text-center">
              온라인 강의를 만들어보세요
            </p> */}
          </div>
          {selectedType === "ONLINE" && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSelectedType("CHALLENGE")}
          className={`cursor-pointer relative p-8 rounded-lg border-2 transition-all ${
            selectedType === "CHALLENGE"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`text-4xl ${selectedType === "CHALLENGE" ? "scale-110" : ""} transition-transform`}>
              🏆
            </div>
            <h3 className="font-bold text-lg">챌린지</h3>
            {/* <p className="text-sm text-gray-600 text-center">
              챌린지로 함께 성장해요!
            </p> */}
          </div>
          {selectedType === "CHALLENGE" && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>
      </div>

      <div className="w-full space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {/* 제목을 입력해주세요 */}
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          className="bg-[#F6F6F6] py-6 rounded-lg text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
        />
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        <Button 
          variant="outline" 
          className="flex-1 py-6 text-base font-semibold rounded-lg"
          onClick={() => router.back()}
        >
          이전
        </Button>
        <Button
          onClick={handleCreate}
          disabled={createCourseMutation.isPending}
          variant="default"
          className="flex-1 py-6 text-base font-semibold rounded-lg bg-green-500 hover:bg-green-600"
        >
          {createCourseMutation.isPending ? "생성 중..." : "만들기"}
        </Button>
      </div>
    </div>
  );
}