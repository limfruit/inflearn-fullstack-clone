"use client";

import { CourseCategory, User } from "@/generated/openapi-client";
import { Globe, Grid3X3, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CATEGORY_ICONS } from "@/app/constants/category-icons";
import React, { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import LoginModal from "./login-modal";
// import * as Sentry from "@sentry/nextjs";

function RollingPlaceholder() {
  const messages = [
    "우리는 성장 기회의 평등을 추구합니다.",
    "성장하는 모든 사람을 응원합니다.",
    "실전에 필요한 지식을 지금 배워보세요.",
    "우리는 성장 기회의 평등을 추구합니다.",
    "요즘 관심 있는 주제나 기술이 있나요?",
    "진짜 성장을 도와줄 강의를 찾아보세요",
    "실전에서 쓸 지식을 지금 배워보세요.",
    "인프런에서 성장 여정을 시작해보세요.",
    "성장을 위한 콘텐츠가 여기 있어요.",
    "AI 시대에 필요한 무기, 지금 배워보세요.",
    "지금 배우고싶은 지식을 찾아보세요.",
  ];

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index === messages.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, messages.length]);

  return (
    <div className="relative h-[32px] overflow-hidden w-full">
      <div
        className="flex flex-col"
        style={{
          transform: `translateY(-${index * 30}px)`,
          transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} className="h-[30px] text-base text-gray-500 opacity-80 flex items-center pl-2">
            {msg}
          </div>
        ))}
        <div className="h-[30px] text-base text-gray-500 opacity-80 flex items-center pl-2">
          {messages[0]}
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader({
  session,
  profile,
  categories,
}: {
  session: Session | null;
  profile?: User;
  categories: CourseCategory[];
}) {
  const pathname = usePathname();
  const isSiteHeaderNeeded =
    !pathname.match(/^\/signup/) &&
    !pathname.match(/^\/course\/[0-9a-f-]+(\/edit|\/edit\/.*)$/) &&
    !pathname.match(/^\/courses\/lecture/);
  
  const isCategoryNeeded =
      !pathname.match(/^\/my\/courses/) && (
      pathname === "/" ||
      pathname.startsWith("/courses") ||
      pathname.startsWith("/search")
    );

          
  const isSearchNeeded = 
    !pathname.match(/^\/course\/[0-9a-f-]/) &&
    !pathname.match(/^\/course\/[0-9a-f-]+(\/edit|\/edit\/.*)$/) &&
    !pathname.match(/^\/courses\/lecture/) && 
    !pathname.match(/^\/instructor/) &&
    !pathname.match(/^\/create_courses/) && 
    !pathname.match(/^\/my\/courses/) &&
    !pathname.match(/^\/carts/);
    

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemsQuery = useQuery({
    queryFn: () => api.getCartItems(),
    queryKey: ["cart-items"],
  });

  // 최신 3개 아이템만 표시
  const recentCartItems =
    cartItemsQuery?.data?.data?.items
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3) ?? [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };
  
  const menus = [
    { label: "강의", icon: "/images/header/course.png" },
    { label: "챌린지", icon: "/images/header/challenge.png" },
    { label: "멘토링", icon: "/images/header/mentoring.png" },
    { label: "클립", icon: "/images/header/clip.png" },
    { label: "커뮤니티", icon: "/images/header/community.png" },
  ];

  if (!isSiteHeaderNeeded) return null;

  if (cartItemsQuery.isLoading) {
    return <div>로딩중...</div>;
  }

  return (
  <>
    <header className="relative site-header w-full bg-white">
      <div className="header-top flex items-center justify-between px-8 py-2 gap-4">
        
        {/* 1단: 로고 등 상단바 */}
        <div className="flex-[1] flex logo min-w-[120px]">
          <Link href="/">
            <Image
              // src="/images/inflearn_public_logo.png"
              src="/images/inflearn_logo_default.svg"
              className="w-29 h-auto"
              width={120}
              height={32}
              alt="inflearn"
            />
          </Link>
        </div>

        {/* <nav className="main-nav flex gap-6 text-base font-bold text-gray-700">
          <Link href="#" className="hover:text-[#1dc078] transition-colors">
            <Image
              src="/images/header/course.png"
              width={32}
              height={32}
              alt="course"
            />
            강의
          </Link>
        </nav> */}
        <nav className="main-nav flex-[2] flex justify-center items-center gap-6 text-base font-bold text-gray-700">
          {[
            { href: "#", label: "강의", icon: "/images/header/course.png" },
            { href: "#", label: "챌린지", icon: "/images/header/challenge.png" },
            { href: "#", label: "멘토링", icon: "/images/header/mentoring.png" },
            { href: "#", label: "클립", icon: "/images/header/clip.png" },
            { href: "#", label: "커뮤니티", icon: "/images/header/community.png" },
          ].map((menu) => (
            <Link key={menu.label} href={menu.href} className="hover:text-[#1dc078] transition-colors">
              <div className="flex items-center gap-1">
                <Image
                  src={menu.icon}
                  width={32}
                  height={32}
                  alt={menu.label}
                />
                <span>{menu.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        {/* <Button
          variant="outline"
          className="font-semibold border-red-300 text-red-600 hover:bg-red-50 ml-2"
          onClick={() => {
            Sentry.captureMessage("Sentry Test Button Click!!!", {
              level: "info",
              tags: {
                feature: "sentry-test",
                location: "site-header",
              },
            });
          }}
        >
          Sentry Test
        </Button> */}
        
        <div className="flex-[1] flex justify-end items-center gap-3">
          <Link href="/instructor">
            <Button
              className="text-base font-bold text-gray-700 bg-white rounded-md hover:bg-gray-50"
            >
              지식공유
            </Button>
          </Link>

          <button className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#1dc078] transition-colors rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M0 72C0 49.9 17.9 32 40 32H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V72zM0 232c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V232zM128 392v48c0 22.1-17.9 40-40 40H40c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40H88c22.1 0 40 17.9 40 40zM160 72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V72zM288 232v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM160 392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392zM448 72v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V72c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40zM320 232c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V232zM448 392v48c0 22.1-17.9 40-40 40H360c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40h48c22.1 0 40 17.9 40 40z" />
            </svg>
          </button>

          <button className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#1dc078] transition-colors rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512" 
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M256 464c7.4 0 27-7.2 47.6-48.4c8.8-17.7 16.4-39.2 22-63.6H186.4c5.6 24.4 13.2 45.9 22 63.6C229 456.8 248.6 464 256 464zM178.5 304h155c1.6-15.3 2.5-31.4 2.5-48s-.9-32.7-2.5-48h-155c-1.6 15.3-2.5 31.4-2.5 48s.9 32.7 2.5 48zm7.9-144H325.6c-5.6-24.4-13.2-45.9-22-63.6C283 55.2 263.4 48 256 48s-27 7.2-47.6 48.4c-8.8 17.7-16.4 39.2-22 63.6zm195.3 48c1.5 15.5 2.2 31.6 2.2 48s-.8 32.5-2.2 48h76.7c3.6-15.4 5.6-31.5 5.6-48s-1.9-32.6-5.6-48H381.8zm58.8-48c-21.4-41.1-56.1-74.1-98.4-93.4c14.1 25.6 25.3 57.5 32.6 93.4h65.9zm-303.3 0c7.3-35.9 18.5-67.7 32.6-93.4c-42.3 19.3-77 52.3-98.4 93.4h65.9zM53.6 208c-3.6 15.4-5.6 31.5-5.6 48s1.9 32.6 5.6 48h76.7c-1.5-15.5-2.2-31.6-2.2-48s.8-32.5 2.2-48H53.6zM342.1 445.4c42.3-19.3 77-52.3 98.4-93.4H374.7c-7.3 35.9-18.5 67.7-32.6 93.4zm-172.2 0c-14.1-25.6-25.3-57.5-32.6-93.4H71.4c21.4 41.1 56.1 74.1 98.4 93.4zM256 512A256 256 0 1 1 256 0a256 256 0 1 1 0 512z" />
            </svg>
          </button>
          
          {session && (
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <button className="relative w-10 h-10 flex items-center justify-center text-gray-900 hover:text-[#1dc078] transition-colors rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 576 512" 
                    className="w-4 h-4"
                    fill="currentColor"
                  >
                    <path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48H69.5c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H199.7c-11.5 0-21.4-8.2-23.6-19.5L170.7 288H459.2c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32h-411C111 12.8 91.6 0 69.5 0H24zM131.1 80H520.7L482.4 222.2c-2.8 10.5-12.3 17.8-23.2 17.8H161.6L131.1 80zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
                  </svg>
              {/* <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"> */}
                {/* <ShoppingCart className="size-6 text-gray-600" /> */}
                {/* 장바구니 totalCount가 1 이상일 때만 */}
                {((cartItemsQuery?.data?.data?.totalCount ?? 0) > 0) && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] leading-none rounded-full bg-red-500 text-white"
                  >
                    {cartItemsQuery?.data?.data?.totalCount}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">수강바구니</h3>
              </div>

              {cartItemsQuery?.data?.data?.totalCount === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  장바구니가 비어있습니다.
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto">
                    {recentCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="relative w-12 h-8 flex-shrink-0">
                          {item.course.thumbnailUrl && (
                            <Image
                              src={item.course.thumbnailUrl}
                              alt={item.course.title}
                              fill
                              className="rounded object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.course.instructor.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.course.discountPrice &&
                            item.course.discountPrice < item.course.price ? (
                              <>
                                <span className="text-xs font-semibold text-gray-900">
                                  ₩{formatPrice(item.course.discountPrice)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  ₩{formatPrice(item.course.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-semibold text-gray-900">
                                ₩{formatPrice(item.course.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-gray-50">
                    <Button
                      onClick={() => {
                        setCartOpen(false);    
                        router.push("/carts");
                      }}
                      className="w-full bg-[#1dc078] hover:bg-[#1dc078]/90 text-white font-medium"
                    >
                      수강바구니에서 전체보기
                    </Button>
                  </div>
                </>
              )}
            </PopoverContent>
          </Popover>
          )}

          {/* Avatar + Popover or 로그인 버튼 */}
          {session ? (
            <Popover>
              <PopoverTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 transition-all cursor-pointer">
                {/* <div className="cursor-pointer"> */}
                  <Avatar>
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback>
                        <span role="img" aria-label="user">
                          👤
                        </span>
                      </AvatarFallback>
                    )}
                  </Avatar>
                {/* </div> */}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-0">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-800">
                    {profile?.name || profile?.email || "내 계정"}
                  </div>
                  {profile?.email && (
                    <div className="text-xs text-gray-500 mt-1">
                      {profile.email}
                    </div>
                  )}
                </div>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none cursor-pointer"
                  onClick={() => router.push("/my/courses")}
                >
                  <div className="font-semibold text-gray-800">내 학습</div>
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none cursor-pointer"
                  onClick={() => (window.location.href = "/my/settings/account")}
                >
                  <div className="font-semibold text-gray-800">프로필 수정</div>
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none cursor-pointer"
                  onClick={() => signOut()}
                >
                  <div className="font-semibold text-gray-800">로그아웃</div>
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            // <Link href="/signin">
            //   <Button
            //     variant="outline"
            //     className="font-semibold border-gray-200 hover:border-[#1dc078] hover:text-[#1dc078] ml-2"
            //   >
            //     로그인
            //   </Button>
            // </Link>
            <Button
              variant="outline"
              onClick={() => setIsLoginModalOpen(true)}
              // className="font-semibold border-gray-200 hover:border-[#1dc078] hover:text-[#1dc078] ml-2"
              className="px-5 py-3 text-sm font-semibold text-gray-700 transition-colors rounded-full bg-gray-100 hover:bg-gray-200 border-0 outline-none focus:outline-none"
            >
              로그인
            </Button>
          )}
        </div>
      </div>

      {/* 2단: 검색창 */}
      {/* <div className="flex-1 flex justify-center px-4 py-4">
        <div className="relative flex w-full items-center max-w-lg">
          <Input
            type="text"
            placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
            className="w-full rounded-full bg-gray-50 border-gray-200 focus-visible:ring-[#1dc078] pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (search.trim()) {
                  router.push(`/search?q=${search}`);
                }
              }
            }}
          />
          <button
            type="button"
            className="absolute right-2 p-1 text-gray-400 hover:text-[#1dc078] transition-colors"
            tabIndex={-1}
            onClick={() => { 
              if (search.trim()) {
                router.push(`/search?q=${search}`);
              }
            }}
          >
            <Search size={20} />
          </button>
        </div>
      </div> */}

      {/* 2단: 검색창 */}
      {isSearchNeeded && (
        <div className="flex justify-center px-4 py-3">
          <div className={`relative flex w-full max-w-lg items-center bg-white rounded-full shadow-sm min-h-[58px]
          ${isFocused 
              ? 'border-2 border-[#1dc078] shadow-lg' 
              : 'border border-gray-200'
          }`}
          >
            {/* 메뉴 드롭다운 */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center px-3 py-2 gap-2 hover:bg-gray-50 rounded-l-full cursor-pointer">
                  <Image
                    src={menus[0].icon}
                    width={30}
                    height={23}
                    alt={menus[0].label}
                  />
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="caret-down"
                    className="svg-inline--fa fa-caret-down"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width={10}
                    height={12}
                    style={{ 
                      // fontSize: "12px", 
                      color: "rgb(33, 37, 41)" }}
                  >
                    <path
                      fill="currentColor"
                      d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
                    />
                  </svg>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.24 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg> */}
                </button>
              </PopoverTrigger>

              {/* 드롭다운 메뉴 목록 */}
              <PopoverContent align="start" className="w-36 p-1 rounded-md shadow-md">
                <div className="flex flex-col">
                  {menus.map((menu) => (
                    <button
                      key={menu.label}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 gap-2 text-sm text-gray-700 rounded-md"
                      onClick={() => {
                        // 선택 기능 넣을 수 있음
                      }}
                    >
                      <Image src={menu.icon} width={18} height={18} alt={menu.label} />
                      <span>{menu.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* 입력창 */}
            {!search && !isFocused && (
              <div className="absolute left-12 ml-8 top-1/2 -translate-y-1/2 w-[calc(100%-100px)] pointer-events-none">
                <RollingPlaceholder />
              </div>
            )}
            <input
              type="text"
              className="flex-1 text-sm px-4 py-3 bg-transparent placeholder:text-gray-400 focus:outline-none"
              // placeholder={placeholderList[placeholderIndex]}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  router.push(`/search?q=${search}`);
                }
              }}
            />          

            {/* 검색 버튼 */}
            <button
              type="button"
              className="bg-[#1dc078] hover:bg-[#1dc078]/90 text-white rounded-full w-10 h-10 flex items-center justify-center mr-2"
              onClick={() => {
                if (search.trim()) {
                  router.push(`/search?q=${search}`);
                }
              }}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      )}  

      {/* 3단: 카테고리 */}
      <div className="header-bottom bg-white px-8">
        {isCategoryNeeded && (
          <nav className="category-nav flex justify-between gap-6 py-4 overflow-x-auto scrollbar-none">
            {categories.map((category) => (
              <Link key={category.id} href={`/courses/${category.slug}`}>
                <div className="category-item flex flex-col items-center min-w-[72px] text-gray-700 hover:text-[#1dc078] cursor-pointer transition-colors">
                  {/* <Layers size={28} className="mb-1" /> */}
                  {React.createElement(
                    CATEGORY_ICONS[category.slug] || CATEGORY_ICONS["default"],
                    {
                      size: 28,
                      className: "mb-1",
                    }
                  )}
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div className="border-b absolute bottom-0 w-screen left-1/2 -translate-x-1/2"></div>
      {/* 
        left-1/2 -> 상위 헤더의 절반만큼 오른쪽으로 이동(중간 위치부터 끝까지 선이 그려지게 됨
        -translate-x-1/2 -> 본인의 절반만큼 역으로 돌아오게 됨
        => 결국 선이 화면 전체를 차지할 수 있게 됨 (상위 부모가 어떻든 전체를 차지할 수 있음)
      */}
    </header>
  
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
    />
  </>   
  );
}