"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  CourseDetailDto,
  LectureActivity as LectureActivityEntity,
  Lecture as LectureEntity,
  Section as SectionEntity,
  UpdateLectureActivityDto,
} from "@/generated/openapi-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircle2,
  LockIcon,
  PlayCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PauseIcon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  MinimizeIcon,
  ListIcon,
  XIcon,
  StarIcon,
  MessageSquareIcon,
  Loader2,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import * as api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { User } from "next-auth";
import QuestionsSection from "./_components/questions-section";

function formatSecondsToMinSec(seconds: number | undefined) {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function LectureRow({
  lecture,
  isActive,
  onSelect,
  completed = false,
}: {
  lecture: LectureEntity;
  isActive: boolean;
  onSelect: () => void;
  completed?: boolean;
}) {
  return (
    <div
      onClick={lecture.videoStorageInfo ? onSelect : undefined}
      className={cn(
        "flex items-center justify-between text-sm px-4 py-2 cursor-pointer",
        isActive && "bg-primary/10 text-primary font-semibold",
        !isActive && "hover:bg-muted/50",
        lecture.videoStorageInfo ? "" : "cursor-default opacity-60"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        {completed ? (
          <CheckCircle2 className="size-4 text-green-500 shrink-0" />
        ) : lecture.isPreview ? (
          <PlayCircleIcon className="size-4 text-primary shrink-0" />
        ) : (
          <LockIcon className="size-4 text-muted-foreground shrink-0" />
        )}
        <span className="truncate">{lecture.title}</span>
      </div>
      <span className="shrink-0 pl-2 text-muted-foreground">
        {formatSecondsToMinSec(lecture.duration)}
      </span>
    </div>
  );
}

function Sidebar({
  sections,
  currentLectureId,
  onSelectLecture,
  course,
  onClose,
  user,
}: {
  sections: SectionEntity[];
  currentLectureId?: string;
  onSelectLecture: (lecture: LectureEntity) => void;
  course: CourseDetailDto;
  onClose: () => void;
  user?: User;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen bg-white border-l shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold" title={course.title}>
          {course.title}
        </h2>
        <button
          className="p-1 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="curriculum" className="flex-1 flex flex-col p-2">
        <TabsList className="grid w-full grid-cols-2 my-4 mb-2">
          <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
          <TabsTrigger value="qa">질문&답변</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="flex-1 overflow-y-auto mt-0">
          <Accordion type="multiple" className="w-full">
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger className="flex text-sm font-medium px-4 py-3 bg-muted/50 hover:no-underline">
                  <span className="flex-1 text-left truncate">
                    {section.title}
                  </span>
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {section.lectures.length}개
                  </span>
                </AccordionTrigger>
                <AccordionContent className="bg-background">
                  <div className="flex flex-col">
                    {section.lectures
                      .sort((a, b) => a.order - b.order)
                      .map((lecture) => (
                        <LectureRow
                          key={lecture.id}
                          lecture={lecture}
                          isActive={lecture.id === currentLectureId}
                          onSelect={() => onSelectLecture(lecture)}
                          completed={
                            false /* TODO: replace with real progress */
                          }
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="qa" className="flex-1 overflow-y-auto mt-0 px-4">
          <QuestionsSection courseId={course.id} user={user} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

// function LectureRow({
//   lecture,
//   isActive,
//   onSelect,
//   completed = false,
//   isUnit = false,
//   unitType,
// }: {
//   lecture: LectureEntity | any;
//   isActive: boolean;
//   onSelect: () => void;
//   completed?: boolean;
//   isUnit?: boolean;
//   unitType?: "LECTURE" | "MISSION";
// }) {
//   const isMission = isUnit && unitType === "MISSION";
  
//   return (
//     <div
//       onClick={lecture.videoStorageInfo || isMission ? onSelect : undefined}
//       className={cn(
//         "flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0",
//         isActive && "bg-green-50",
//         !isActive && "hover:bg-gray-50",
//         (lecture.videoStorageInfo || isMission) ? "" : "cursor-default opacity-50"
//       )}
//     >
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         {completed ? (
//           <CheckCircle2 className="size-5 text-green-500 shrink-0" />
//         ) : lecture.isPreview || isMission ? (
//           <div className="size-5 rounded-full border-2 border-green-500 shrink-0 flex items-center justify-center">
//             <PlayCircleIcon className="size-3 text-green-500" />
//           </div>
//         ) : (
//           <div className="size-5 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
//             <LockIcon className="size-3 text-gray-400" />
//           </div>
//         )}
//         <span className={cn(
//           "truncate text-sm",
//           isActive ? "font-semibold text-gray-900" : "text-gray-700"
//         )}>
//           {lecture.title}
//         </span>
//       </div>
//       <span className="shrink-0 text-xs text-gray-500">
//         {isMission ? "미션" : formatSecondsToMinSec(lecture.duration)}
//       </span>
//     </div>
//   );
// }

// function Sidebar({
//   sections,
//   currentLectureId,
//   onSelectLecture,
//   course,
//   onClose,
//   user,
// }: {
//   sections: SectionEntity[];
//   currentLectureId?: string;
//   onSelectLecture: (lecture: LectureEntity) => void;
//   course: CourseDetailDto;
//   onClose: () => void;
//   user?: User;
// }) {
//   const defaultOpenSections = sections.map(s => s.id);
  
//   return (
//     <aside className="hidden lg:flex flex-col w-[400px] h-screen bg-white border-l">
//       {/* Header - 고정 */}
//       <div className="flex items-center justify-between px-4 py-4 border-b bg-white flex-shrink-0">
//         <h2 className="text-base font-bold text-gray-900">커리큘럼</h2>
//         <button
//           className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
//           onClick={onClose}
//           aria-label="Close sidebar"
//         >
//           <XIcon className="size-5" />
//         </button>
//       </div>

//       {/* Course Title and Progress - 고정 */}
//       <div className="px-4 py-4 border-b bg-white flex-shrink-0">
//         <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
//           {course.title}
//         </h3>
        
//         <div className="space-y-2">
//           <div className="flex items-center justify-between text-xs">
//             <span className="text-gray-600">진도율</span>
//             <span className="font-semibold text-green-600">0%</span>
//           </div>
//           <Progress value={0} className="h-1.5" />
          
//           <div className="grid grid-cols-3 gap-2 pt-2">
//             <div className="text-center">
//               <div className="text-lg font-bold text-green-600">0</div>
//               <div className="text-xs text-gray-500">완료한 강의</div>
//             </div>
//             <div className="text-center border-x border-gray-200">
//               <div className="text-lg font-bold text-gray-400">
//                 {sections.reduce((acc, s) => {
//                   const sectionWithUnits = s as any;
//                   const lectureCount = s.lectures?.length || 0;
//                   const unitCount = sectionWithUnits.units?.length || 0;
//                   return acc + lectureCount + unitCount;
//                 }, 0)}
//               </div>
//               <div className="text-xs text-gray-500">전체 강의</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg font-bold text-gray-400">0%</div>
//               <div className="text-xs text-gray-500">평균 진행률</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs - 스크롤 가능 영역 */}
//       <Tabs defaultValue="curriculum" className="flex-1 flex flex-col min-h-0">
//         <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-12 bg-white flex-shrink-0">
//           <TabsTrigger 
//             value="curriculum"
//             className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none"
//           >
//             수업
//           </TabsTrigger>
//           <TabsTrigger 
//             value="qa"
//             className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-none"
//           >
//             질문&답변
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="curriculum" className="flex-1 overflow-y-auto mt-0 min-h-0">
//           <Accordion 
//             type="multiple" 
//             className="w-full"
//             defaultValue={defaultOpenSections}
//           >
//             {sections.map((section, sectionIdx) => {
//               const sectionWithUnits = section as any;
//               const allItems = [
//                 ...(section.lectures || []).map(l => ({ ...l, itemType: 'lecture' as const })),
//                 ...(sectionWithUnits.units || []).map((u: any) => ({ ...u, itemType: 'unit' as const }))
//               ].sort((a, b) => (a.order || 0) - (b.order || 0));
              
//               return (
//                 <AccordionItem
//                   key={section.id}
//                   value={section.id}
//                   className="border-b"
//                 >
//                   <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center justify-between w-full pr-2">
//                       <span className="text-sm font-semibold text-gray-900 text-left">
//                         섹션 {sectionIdx + 1}. {section.title}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {allItems.length}개
//                       </span>
//                     </div>
//                   </AccordionTrigger>
//                   <AccordionContent className="pb-0">
//                     <div className="bg-gray-50">
//                       {allItems.map((item, idx) => {
//                         if (item.itemType === 'lecture') {
//                           const lecture = item as LectureEntity & { itemType: 'lecture' };
//                           return (
//                             <LectureRow
//                               key={`lecture-${lecture.id}`}
//                               lecture={lecture}
//                               isActive={lecture.id === currentLectureId}
//                               onSelect={() => onSelectLecture(lecture)}
//                               completed={false}
//                             />
//                           );
//                         } else {
//                           const unit = item as any;
//                           return (
//                             <LectureRow
//                               key={`unit-${unit.id}`}
//                               lecture={unit}
//                               isActive={unit.id === currentLectureId}
//                               onSelect={() => onSelectLecture(unit)}
//                               completed={false}
//                               isUnit={true}
//                               unitType={unit.type}
//                             />
//                           );
//                         }
//                       })}
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               );
//             })}
//           </Accordion>
//         </TabsContent>

//         <TabsContent value="qa" className="flex-1 overflow-y-auto mt-0 px-4 py-4 min-h-0">
//           <QuestionsSection courseId={course.id} user={user} />
//         </TabsContent>
//       </Tabs>
//     </aside>
//   );
// }

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const _p = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${_p(h)}:${_p(m)}:${_p(s)}` : `${_p(m)}:${_p(s)}`;
}

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-black text-white">
      Loading player...
    </div>
  ),
});

function InteractiveStarRating({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hoverRating || rating);

        return (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-colors"
          >
            <StarIcon
              className={cn(
                "size-8 transition-colors",
                isActive
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-300 hover:stroke-yellow-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewModal({
  courseId,
  isOpen,
  onClose,
  setShowReviewModal,
}: {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  setShowReviewModal: (show: boolean) => void;
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setContent("");
    }
  }, [isOpen]);

  const createReviewMutation = useMutation({
    mutationFn: () =>
      api.createReview(courseId, {
        content,
        rating,
      }),
    onSuccess: () => {
      toast.success("수강평이 등록되었습니다.");
      setShowReviewModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "수강평 등록에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("수강평을 작성해주세요.");
      return;
    }

    createReviewMutation.mutate();
  };

  const isLoading = createReviewMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            힘이 되는 수강평을 남겨주세요!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <InteractiveStarRating rating={rating} onRatingChange={setRating} />
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="수강평을 작성해보세요!"
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <DialogFooter className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <span>저장하기</span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VideoPlayer({
  lecture,
  lectureActivity,
  courseId,
  user,
}: {
  lecture: LectureEntity;
  lectureActivity?: LectureActivityEntity;
  courseId: string;
  user?: User;
}) {
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const updateLectureActivityMutation = useMutation({
    mutationFn: (updateLectureActivityDto: UpdateLectureActivityDto) =>
      api.updateLectureActivity(lecture.id, updateLectureActivityDto),
    onSuccess: (result) => {
      console.log("Update Lecture Activity Success");
      console.log(result);
    },
  });

  const videoUrl = (lecture.videoStorageInfo as any)?.cloudFront?.url as
    | string
    | undefined;

  const playerRef = React.useRef<any>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const hasSeekOnReadyRef = React.useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0); // fraction 0~1
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [iconType, setIconType] = useState<'play' | 'pause'>('play');

  useEffect(() => {
    hasSeekOnReadyRef.current = false;
    setPlayed(0);
    setPlayedSeconds(0);
  }, [lecture.id]);

  const handlePlayPause = () => {
    setPlaying((p) => {
      setIconType(!p ? 'pause' : 'play'); 
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 500);
      return !p;
    });

    updateLectureActivityMutation.mutate({
      duration: playedSeconds,
      isCompleted: played >= 0.95,
      lastWatchedAt: new Date().toISOString(),
      progress: Math.round(played * 100),
    });
  };

  const handleMute = () => {
    setMuted((m) => !m);
  };

  const handleVolumeChange = (values: number[]) => {
    const v = values[0] / 100;
    setVolume(v);
    setMuted(v === 0);
  };

  const handleSeekChange = (values: number[]) => {
    setPlayed(values[0] / 100);
  };

  const handleSeekCommit = (values: number[]) => {
    const fraction = values[0] / 100;
    playerRef.current?.seekTo(fraction, "fraction");
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) setPlayed(state.played);
    setPlayedSeconds(Math.floor(state.playedSeconds));
    updateLectureActivityMutation.mutate({
      duration: playedSeconds,
      isCompleted: played >= 0.95,
      lastWatchedAt: new Date().toISOString(),
      progress: Math.round(played * 100),
    });
  };

  const handleEnded = () => {
    updateLectureActivityMutation.mutate({
      duration: Math.round(totalDuration),
      isCompleted: true,
      lastWatchedAt: new Date().toISOString(),
      progress: 100,
    });
  };

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-black text-white">
        영상이 준비되지 않았습니다.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative flex-1 h-full bg-black">
      <div
        onClick={handlePlayPause}
        className="relative"
      >
        {/* ReactPlayer maintains 16:9 responsiveness by padding */}
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          muted={muted}
          volume={volume}
          width="100%"
          height="100%"
          style={{ backgroundColor: "black" }}
          onProgress={handleProgress}
          onDuration={setTotalDuration}
          onEnded={handleEnded}
          playbackRate={playbackRate}
          onReady={() => {
            if (lectureActivity && !hasSeekOnReadyRef.current) {
              hasSeekOnReadyRef.current = true;
              playerRef.current?.seekTo(lectureActivity.duration, "seconds");
            }
          }}
        />

        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-in fade-in zoom-in duration-200">
              {iconType === 'play' ? (
                <PauseIcon className="size-20 text-green-300 drop-shadow-2xl" strokeWidth={1.5} />
              ) : (
                <PlayIcon className="size-20 text-green-300 drop-shadow-2xl" strokeWidth={1.5} />
              )}
            </div>
          </div>
        )}
      </div>

        {/* Lecture title overlay */}
        <div className="absolute top-2 left-2 flex items-center">
          <button className="cursor-pointer" onClick={() => router.back()}>
            <ArrowLeftIcon color="white" size={20} />
          </button>
          <span className="text-sm md:text-base font-semibold text-white bg-black/60 px-3 py-1 rounded-md">
            {lecture.title}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-2 bg-black/70 backdrop-blur flex flex-col gap-2 text-white">
          <Slider
            min={0}
            max={100}
            value={[played * 100]}
            onValueChange={(v) => {
              setSeeking(true);
              handleSeekChange(v);
            }}
            onValueCommit={(v) => {
              handleSeekCommit(v);
              setSeeking(false);
            }}
          />
          <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">          
              <button onClick={handlePlayPause} aria-label="play-pause">
                {playing ? (
                  <PauseIcon className="size-4" />
                ) : (
                  <PlayIcon className="size-4" />
                )}
              </button>

              {/* time */}
              <span className="tabular-nums text-xs">
                {formatTime(played * totalDuration)} / {formatTime(totalDuration)}
              </span>

              {/* volume */}
              <button onClick={handleMute} aria-label="mute">
                {muted || volume === 0 ? (
                  <VolumeXIcon className="size-4" />
                ) : (
                  <Volume2Icon className="size-4" />
                )}
              </button>
              <Slider
                className="w-24"
                min={0}
                max={100}
                value={[muted ? 0 : volume * 100]}
                onValueChange={handleVolumeChange}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* 수강평 버튼 */}
              {user && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors"
                  aria-label="수강평 작성"
                >
                  <MessageSquareIcon className="size-3" />
                  <span>수강평</span>
                </button>
              )}

              {/* speed select */}
              <Select
                value={playbackRate.toString()}
                onValueChange={(v) => setPlaybackRate(parseFloat(v))}
              >
                <SelectTrigger className="w-16 h-8 bg-black/20 border border-white/20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border border-white/20">
                  {[0.5, 1, 1.25, 1.5, 2].map((r) => (
                    <SelectItem key={r} value={r.toString()} className="text-xs">
                      {r}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* fullscreen */}
              <button onClick={toggleFullscreen} aria-label="fullscreen">
                {isFullscreen ? (
                  <MinimizeIcon className="size-4" />
                ) : (
                  <MaximizeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <ReviewModal
          courseId={courseId}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          setShowReviewModal={setShowReviewModal}
        />
      </div>
  );
}

function LectureHeader({
  title,
  sections,
  currentLectureIndex,
}: {
  title: string;
  sections: SectionEntity[];
  currentLectureIndex: number;
}) {
  // Mock progress: pretend 37% complete
  const totalLectures = useMemo(
    () => sections.reduce((acc, s) => acc + s.lectures.length, 0),
    [sections]
  );
  const completedLectures = Math.floor(totalLectures * 0.37);
  const progressValue = (completedLectures / totalLectures) * 100;

  return (
    <header className="space-y-2 mb-4">
      <h1 className="text-lg font-semibold truncate" title={title}>
        {title}
      </h1>
      <Progress value={progressValue} />
      <p className="text-xs text-muted-foreground">
        {completedLectures} / {totalLectures} 강의 완료 · 현재{" "}
        {currentLectureIndex + 1}
        번째 강의
      </p>
    </header>
  );
}

/*****************
 * Main Component *
 *****************/
export default function UI({
  course,
  lectureId,
  lectureActivities,
  user,
}: {
  course: CourseDetailDto;
  lectureId?: string;
  lectureActivities: LectureActivityEntity[];
  user?: User;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLectureId = lectureId ?? course.sections[0].lectures[0].id;

  const allLectures = useMemo(() => {
    return course.sections.flatMap((section) => section.lectures);
  }, [course.sections]);

  const currentLecture = useMemo(() => {
    if (currentLectureId) {
      const found = allLectures.find((l) => l.id === currentLectureId);
      if (found) return found;
    }
    // fallback to first lecture
    return allLectures[0];
  }, [currentLectureId, allLectures]);

  const handleSelectLecture = (lecture: LectureEntity) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("courseId", course.id);
    params.set("lectureId", lecture.id);
    router.push(`/courses/lecture?${params.toString()}`);
  };

  const currentLectureIndex = allLectures.findIndex(
    (l) => l.id === currentLecture.id
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex w-full h-screen bg-black fixed inset-0">
      <div className="flex-1 relative">
        <VideoPlayer
          lecture={currentLecture}
          lectureActivity={lectureActivities.find(
            (activity) => activity.lectureId === currentLectureId
          )}
          courseId={course.id}
          user={user}
        />

        {/* Floating button to open sidebar when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow"
            aria-label="Open curriculum"
          >
            <ListIcon className="size-5" />
          </button>
        )}
      </div>

      {sidebarOpen && (
        <Sidebar
          sections={course.sections}
          currentLectureId={currentLecture.id}
          onSelectLecture={handleSelectLecture}
          course={course}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}