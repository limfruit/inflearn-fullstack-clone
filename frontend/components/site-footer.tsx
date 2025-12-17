"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SiteFooter() {

    const pathname = usePathname();
    const isSiteFooterNeeded =
        !pathname.match(/^\/signup/) &&
        !pathname.match(/^\/courses\/lecture/);

    if (!isSiteFooterNeeded) return null;

    return (
        <footer className="w-screen left-1/2 -translate-x-1/2 relative">
          {/* 메인 푸터 영역 - 어두운 회색 */}
          <div className="bg-[#3d4149] text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-4">
              {/* 로고 및 회사 정보 */}
              <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                    <Image
                        src="/images/inflearn_logo_default.svg"
                        width={120}
                        height={32}
                        alt="inflearn"
                        className="pb-2"
                    />
                    <span className="text-gray-400">|</span>
                    <a href="https://www.inflearn.com/policy/privacy" className="text-sm hover:text-white transition">개인정보처리방침</a>
                    <span className="text-gray-400">|</span>
                    <a href="https://www.inflearn.com/policy/terms-of-service" className="text-sm hover:text-white transition">이용약관</a>
                    <span className="text-gray-400">|</span>
                    <a href="https://www.inflearn.com/pages/withus" className="text-sm hover:text-white transition">We Are Hiring</a>
                    </div>

                    {/* 회사 정보 */}
                    <div className="text-xs text-gray-400 space-y-0.5 leading-relaxed">
                        <p>(주)인프랩 | 대표자: 이형주 | 사업자번호: 499-81-00612 사업자 정보 확인</p>
                        <p>통신판매업: 2018-성남분당B-0062 | 개인정보보호책임자: 이동욱 | 이메일:info@inflearn.com</p>
                        <p>전화번호: 070-4948-1181 | 주소:경기도 성남시 분당구 판교로289번길 20 3동 5층</p>
                        <p className="mt-3 mb-10">©INFLAB. ALL RIGHTS RESERVED</p>
                    </div>
                </div>
                {/* SNS 아이콘 */}
                <div className="flex gap-2 mt-8">
                  {/* <a href="#" className="w-10 h-10 bg-[#4a4e57] rounded-full flex items-center justify-center hover:bg-[#555a63] transition">
                    <span className="text-white font-bold text-sm">B</span>
                  </a> */}
                  <a href="https://www.instagram.com/inflearn__official" className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center transition">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/channel/UC0Y0T9JpgIBbyGDjvy9PbOg" className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center transition">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/inflearn" className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center transition">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/inflearn" className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center transition">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  {/* <a href="#" className="w-10 h-10 bg-[#4a4e57] rounded-full flex items-center justify-center hover:bg-[#555a63] transition">
                    <span className="text-white font-bold text-sm">T</span>
                  </a> */}
                </div>
              </div>
    
            </div>
          </div>
    
          {/* 하단 바 - 더 어두운 배경 */}
          {/* <div className="bg-[#2c3035]">
            <div className="max-w-7xl mx-auto px-8 py-4 flex justify-end">
              <button className="flex items-center gap-2 bg-[#1dc078] hover:bg-[#1ab06a] text-white px-6 py-3 rounded-full transition font-medium">
                <span>문의하기</span>
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div> */}
        </footer>
      );
    }