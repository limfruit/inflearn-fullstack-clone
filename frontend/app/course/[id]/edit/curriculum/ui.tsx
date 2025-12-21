"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Lock, LockOpen, Plus, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Course,
  Section,
  Lecture,
} from "@/generated/openapi-client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import * as api from "@/lib/api";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { EditLectureDialog } from "@/app/course/[id]/edit/curriculum/_components/edit-lecture-dialog";
import EditUnitDialog from "@/app/course/[id]/edit/curriculum/_components/edit-unit-dialog";

type UnitType = "LECTURE" | "MISSION";

interface Unit {
  id: string;
  type: UnitType;
  title: string;
  description?: string;
  order: number;
  duration?: number;
  isPreview: boolean;
  videoStorageInfo?: any;
  content?: string;
}

export default function UI({ initialCourse }: { initialCourse: Course }) {
  const queryClient = useQueryClient();

  const [addLectureSectionId, setAddLectureSectionId] = useState<string | null>(null);
  const [addLectureTitle, setAddLectureTitle] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType>("LECTURE");
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  const [addSectionTitle, setAddSectionTitle] = useState("");
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({});
  const [editLecture, setEditLecture] = useState<Lecture | null>(null);
  const [isEditLectureDialogOpen, setIsEditLectureDialogOpen] = useState(false);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [isEditUnitDialogOpen, setIsEditUnitDialogOpen] = useState(false);

  const { data: course } = useQuery<Course>({
    queryKey: ["course", initialCourse.id],
    queryFn: async () => {
      const { data } = await api.getUnitCourseById(initialCourse.id);
      if (!data) {
        notFound();
      }
      return data;
    },
  });

  const isChallenge = (course as any)?.type === "CHALLENGE";

  const addSectionMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await api.createSection(initialCourse.id, title);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("섹션이 생성되었습니다.");
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const { data, error } = await api.deleteSection(sectionId);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("섹션이 삭제되었습니다.");
    },
  });

  const addUnitMutation = useMutation({
    mutationFn: async ({
      sectionId,
      title,
      type,
    }: {
      sectionId: string;
      title: string;
      type?: UnitType;
    }) => {
      const { data, error } = await api.createUnit(sectionId, title, type);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("수업이 생성되었습니다.");
    },
  });

  const deleteUnitMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const { data, error } = await api.deleteUnit(unitId);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("수업이 삭제되었습니다.");
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: async ({ lectureId }: { lectureId: string }) => {
      const { data, error } = await api.deleteLecture(lectureId);
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("강의가 삭제되었습니다.");
    },
  });

  const updateSectionTitleMutation = useMutation({
    mutationFn: async ({
      sectionId,
      title,
    }: {
      sectionId: string;
      title: string;
    }) => {
      const { data, error } = await api.updateSectionTitle(sectionId, title);
      if (error) {
        toast.error(error as string);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", initialCourse.id] });
      toast.success("섹션 제목이 수정되었습니다.");
    },
  });

  const toggleLecturePreviewMutation = useMutation({
    mutationFn: async (lecture: Lecture) => {
      const { data, error } = await api.updateLecturePreview(
        lecture.id,
        !lecture.isPreview
      );
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", initialCourse.id],
      });
    },
  });

  const toggleUnitPreviewMutation = useMutation({
    mutationFn: async (unit: Unit) => {
      const { data, error } = await api.updateUnitPreview(
        unit.id,
        !unit.isPreview
      );
      if (error) {
        toast.error(error as string);
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", initialCourse.id],
      });
    },
  });

  const handleAddSection = () => {
    addSectionMutation.mutate("섹션 제목을 작성해주세요");
    setAddSectionTitle("");
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSectionMutation.mutate(sectionId);
  };

  const openLectureDialog = (sectionId: string) => {
    setAddLectureSectionId(sectionId);
    setAddLectureTitle("");
    setSelectedUnitType("LECTURE");
    setLectureDialogOpen(true);
  };

  const handleAddUnit = () => {
    if (!addLectureTitle.trim() || !addLectureSectionId) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    
    const unitType = isChallenge ? selectedUnitType : "LECTURE";
    
    addUnitMutation.mutate({
      sectionId: addLectureSectionId,
      title: addLectureTitle,
      type: unitType,
    });
    
    setLectureDialogOpen(false);
    setAddLectureTitle("");
    setAddLectureSectionId(null);
  };

  const handleToggleLecturePreview = (lecture: Lecture) => {
    toggleLecturePreviewMutation.mutate(lecture);
  };

  const handleToggleUnitPreview = (unit: Unit) => {
    toggleUnitPreviewMutation.mutate(unit);
  };

  const handleDeleteLecture = (lectureId: string) => {
    deleteLectureMutation.mutate({ lectureId });
  };

  const handleDeleteUnit = (unitId: string) => {
    deleteUnitMutation.mutate(unitId);
  };

  if (!course) return <div>코스 정보를 불러올 수 없습니다.</div>;

  const courseTypeConfig = {
    ONLINE: {
      label: "일반 강의",
      icon: "📚",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    CHALLENGE: {
      label: "챌린지",
      icon: "🏆",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200"
    }
  };

  const typeInfo = courseTypeConfig[(course as any).type as keyof typeof courseTypeConfig] || courseTypeConfig.ONLINE;

  return (
    <div className="space-y-8 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <h1 className="text-2xl font-bold">커리큘럼</h1>
            </CardTitle>
            {/* <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${typeInfo.bgColor} ${typeInfo.borderColor}`}>
              <span className="text-xl">{typeInfo.icon}</span>
              <span className={`font-semibold ${typeInfo.textColor}`}>
                {typeInfo.label}
              </span>
            </div> */}
          </div>
        </CardHeader>
      </Card>

      {course.sections?.map((section: Section, sectionIdx: number) => {
        const sectionWithUnits = section as Section & { units?: Unit[] };
        
        // 안전하게 items 생성
        const lectureItems = (section.lectures || [])
          .filter(l => l && l.id) // null/undefined 체크
          .map(l => ({ ...l, itemType: 'lecture' as const }));
        
        const unitItems = (sectionWithUnits.units || [])
          .filter(u => u && u.id && u.type) // null/undefined 및 type 체크
          .map(u => ({ ...u, itemType: 'unit' as const }));
        
        const allItems = [...lectureItems, ...unitItems]
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
          <div key={section.id} className="border rounded-lg p-4 bg-white w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">
                  섹션 {sectionIdx + 1}
                </span>
                <Input
                  className="w-64"
                  value={sectionTitles[section.id] ?? section.title}
                  onChange={(e) => {
                    setSectionTitles((prev) => ({
                      ...prev,
                      [section.id]: e.target.value,
                    }));
                  }}
                  onBlur={(e) => {
                    const newTitle = e.target.value.trim();
                    if (newTitle && newTitle !== section.title) {
                      updateSectionTitleMutation.mutate({
                        sectionId: section.id,
                        title: newTitle,
                      });
                    }
                  }}
                  placeholder="섹션 제목을 입력하세요."
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-red-500 hover:bg-red-100"
                  aria-label="섹션 삭제"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {allItems.map((item, idx) => {
                if (item.itemType === 'lecture') {
                  const lecture = item as Lecture & { itemType: 'lecture' };
                  return (
                    <div
                      key={`lecture-${lecture.id}`}
                      className="flex items-center justify-between px-2 py-2 border rounded-md bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-5 text-center">
                          {idx + 1}
                        </span>
                        <span className="text-blue-600 text-xs px-2 py-0.5 bg-blue-50 rounded">
                          강의
                        </span>
                        <span className="font-medium">{lecture.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleLecturePreview(lecture)}
                          aria-label="미리보기 토글"
                        >
                          {lecture.isPreview ? (
                            <LockOpen className="text-green-600" size={18} />
                          ) : (
                            <Lock className="text-gray-400" size={18} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditLecture(lecture);
                            setIsEditLectureDialogOpen(true);
                          }}
                          aria-label="강의 수정"
                        >
                          <Edit size={18} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLecture(lecture.id)}
                          className="text-red-500 hover:bg-red-100"
                          aria-label="강의 삭제"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  );
                } else {
                  const unit = item as Unit & { itemType: 'unit' };
                  
                  // unit이나 type이 없으면 스킹
                  if (!unit || !unit.type) {
                    return null;
                  }
                  
                  const isLectureType = unit.type === 'LECTURE';
                  return (
                    <div
                      key={`unit-${unit.id}`}
                      className="flex items-center justify-between px-2 py-2 border rounded-md bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-5 text-center">
                          {idx + 1}
                        </span>
                        {isLectureType ? (
                          <span className="text-blue-600 text-xs px-2 py-0.5 bg-blue-50 rounded flex items-center gap-1">
                            강의
                          </span>
                        ) : (
                          <span className="text-purple-600 text-xs px-2 py-0.5 bg-purple-50 rounded flex items-center gap-1">
                            미션
                          </span>
                        )}
                        <span className="font-medium">{unit.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLectureType && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleUnitPreview(unit)}
                            aria-label="미리보기 토글"
                          >
                            {unit.isPreview ? (
                              <LockOpen className="text-green-600" size={18} />
                            ) : (
                              <Lock className="text-gray-400" size={18} />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditUnit(unit);
                            setIsEditUnitDialogOpen(true);
                          }}
                          aria-label="수업 수정"
                        >
                          <Edit size={18} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-red-500 hover:bg-red-100"
                          aria-label="수업 삭제"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            
            <div className="mt-3 flex w-full justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openLectureDialog(section.id)}
                className="bg-gray-50"
              >
                <Plus size={16} className="mr-1" /> 수업 추가
              </Button>
            </div>
          </div>
        );
      })}
      
      <Button
        onClick={handleAddSection}
        variant="default"
        size="lg"
        className="mx-auto text-md font-bold"
      >
        섹션 추가
      </Button>

      <Dialog open={lectureDialogOpen} onOpenChange={setLectureDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">수업 추가</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {isChallenge && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUnitType("LECTURE")}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedUnitType === "LECTURE"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">💻</span>
                      <span className="font-semibold">강의</span>
                    </div>
                    {selectedUnitType === "LECTURE" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUnitType("MISSION")}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedUnitType === "MISSION"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">🚀</span>
                      <span className="font-semibold">미션</span>
                    </div>
                    {selectedUnitType === "MISSION" && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Input
                value={addLectureTitle}
                onChange={(e) => setAddLectureTitle(e.target.value)}
                placeholder="제목을 입력해주세요. (최대 200자)"
                maxLength={200}
                className="h-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddUnit();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setLectureDialogOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button 
              onClick={handleAddUnit} 
              variant="default"
              className="flex-1 hover:bg-green-600"
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editLecture && (
        <EditLectureDialog
          isOpen={isEditLectureDialogOpen}
          onClose={() => {
            setIsEditLectureDialogOpen(false);
            setEditLecture(null);
          }}
          lecture={editLecture}
        />
      )}

      {editUnit && (
        <EditUnitDialog
          isOpen={isEditUnitDialogOpen}
          onClose={() => {
            setIsEditUnitDialogOpen(false);
            setEditUnit(null);
          }}
          unit={editUnit}
          courseId={initialCourse.id}
        />
      )}
    </div>
  );
}