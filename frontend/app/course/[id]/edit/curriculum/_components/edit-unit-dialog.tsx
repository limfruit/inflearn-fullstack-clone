"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileVideo } from "lucide-react";
import * as api from "@/lib/api";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const CKEditor = dynamic(() => import("@/components/ckeditor"), {
  ssr: false,
});

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
  courseId: string;
}

interface EditUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  courseId: string;
}

interface EditUnitForm {
  title: string;
  description: string;
  videoStorageInfo?: any;
  content?: string;
}

const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
const ACCEPTED_VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/x-matroska": [".mkv"],
  "video/x-m4v": [".m4v"],
  "video/quicktime": [".mov"],
};

export default function EditUnitDialog({
  isOpen,
  onClose,
  unit,
  courseId,
}: EditUnitDialogProps) {
  const queryClient = useQueryClient();
  const isLectureType = unit.type === "LECTURE";

  const [form, setForm] = useState<EditUnitForm>({
    title: unit.title,
    description: unit.description ?? "<p>수업의 설명을 적어주세요.</p>",
    videoStorageInfo: unit.videoStorageInfo,
    content: unit.content ?? "<p>미션 내용을 작성해주세요.</p>",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const { data, error } = await api.uploadMedia(file);
      if (!data || error) {
        toast.error(error as string);
        return;
      }
      setForm((prev) => ({ ...prev, videoStorageInfo: data }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const editUnitMutation = useMutation({
    mutationFn: async (data: EditUnitForm) => {
      const updateData: any = {
        title: data.title,
        description: data.description,
      };

      if (isLectureType) {
        if (data.videoStorageInfo) {
          updateData.videoStorageInfo = data.videoStorageInfo;
        }
      } else {
        updateData.content = data.content;
      }

      return api.updateUnit(unit.id, updateData);
    },
    onSuccess: () => {
      toast.success("수업이 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "수업 수정에 실패했습니다.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!isLectureType && !form.content?.trim()) {
      toast.error("미션 내용을 입력해주세요.");
      return;
    }

    editUnitMutation.mutate(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLectureType ? (
              <>
                <span className="text-xl">💻</span>
                강의 수정
              </>
            ) : (
              <>
                <span className="text-xl">🚀</span>
                미션 수정
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목을 입력해주세요"
              maxLength={200}
            />
          </div>

          {/* LECTURE 타입: 영상 업로드 */}
          {isLectureType && (
            <>
              <div className="space-y-2">
                <Label>강의 영상</Label>
                
                {/* 업로드된 영상 미리보기 */}
                {form.videoStorageInfo && (
                  <div className="w-full h-auto min-h-[200px] mb-2">
                    <video
                      autoPlay={true}
                      controls={true}
                      src={form.videoStorageInfo.cloudFront.url}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                {/* 권장 영상 형식 안내 */}
                <p className="text-sm text-gray-500 mb-2">
                  • 최대 파일 크기: 300MB
                  <br />
                  • 지원 형식: .mp4, .mkv, .m4v, .mov
                  <br />• 최소 해상도: 1080p 이상 (권장)
                </p>

                {/* 드래그앤드롭 업로드 영역 */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="py-8">
                    <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {form.videoStorageInfo
                        ? `선택된 파일: ${form.videoStorageInfo.fileName}`
                        : isDragActive
                        ? "파일을 여기에 놓아주세요"
                        : "클릭하거나 파일을 드래그하여 업로드하세요"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 수업 노트 */}
              <div className="space-y-2">
                <Label htmlFor="description">수업 노트</Label>
                <CKEditor
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>
            </>
          )}

          {/* MISSION 타입: 미션 내용 에디터 */}
          {!isLectureType && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">미션 설명</Label>
                <CKEditor
                  value={form.description}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  }
                />
                <p className="text-xs text-gray-500">
                  미션에 대한 간단한 설명을 작성해주세요
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  미션 내용 <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-lg overflow-hidden">
                  <CKEditor
                    value={form.content || ""}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, content: value }))
                    }
                  />
                </div>
                <p className="text-xs text-gray-500">
                  수강생이 수행해야 할 미션의 상세 내용을 작성해주세요
                </p>
              </div>
            </>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={editUnitMutation.isPending}>
              {editUnitMutation.isPending ? "수정 중..." : "수정"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}