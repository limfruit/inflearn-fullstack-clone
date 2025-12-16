"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    //   onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative"
        // onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors cursor-pointer"
        >
          <svg 
            viewBox="0 0 15 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5"
          >
            <path 
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" 
              fill="currentColor" 
              fillRule="evenodd" 
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* 로고 */}
        <div className="flex justify-center mb-3 mt-10">
            <Image
              src="/images/inflearn_logo_default.svg"
              className="w-29 h-auto"
              width={120}
              height={32}
              alt="inflearn"
            />
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="이메일"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-[#1dc078]"
            />
          </div>

          <div>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:border-[#1dc078]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1dc078] text-white font-semibold rounded-md py-2.5 hover:bg-[#19a866] transition-colors"
          >
            로그인
          </button>

          <div className="flex justify-center gap-3 text-xs text-gray-600">
            <button type="button" className="hover:text-gray-800">
              비밀번호 찾기
            </button>
            <span>|</span>
            <Link 
              href="/signup" 
              onClick={onClose}
              className="hover:text-gray-800"
            >
              회원가입
            </Link>
            <span>|</span>
            <button type="button" className="hover:text-gray-800">
              아이디(이메일) 찾기
            </button>
          </div>
        </form>

        {/* 간편 로그인 */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400">간편 로그인</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-5">
            <button 
              onClick={() => signIn('kakao')}
              className="w-12 h-12 bg-yellow-400 flex items-center justify-center rounded-md shadow-md hover:bg-yellow-500 cursor-pointer"
            >
              <svg 
                aria-hidden="true" 
                focusable="false" 
                role="img" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512" 
                className="w-5 h-5"
                style={{ color: 'rgb(44, 46, 51)' }}
              >
                <path fill="currentColor" d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"></path>
              </svg>
            </button>
            <button 
              onClick={() => signIn('google')}
              className="w-12 h-12 bg-gray-100 border border-gray-120 flex items-center justify-center rounded-md shadow-md hover:bg-gray-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.942c-.1.828-.638 2.073-1.834 2.91l-.016.112 2.662 2.063.185.018c1.694-1.565 2.67-3.867 2.67-6.597z"></path>
                <path fill="#34A853" d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.83-2.193c-.758.528-1.774.897-3.11.897-2.372 0-4.385-1.564-5.102-3.727l-.105.01-2.769 2.142-.036.1c1.475 2.93 4.504 4.943 8.012 4.943z"></path>
                <path fill="#FBBC05" d="M4.073 10.743c-.19-.558-.3-1.156-.3-1.774 0-.618.11-1.216.29-1.774l-.005-.119L1.254 4.9l-.091.044C.555 6.159.206 7.524.206 8.969c0 1.445.349 2.81.957 4.026l2.91-2.252z"></path>
                <path fill="#EB4335" d="M9.175 3.468c1.684 0 2.82.728 3.468 1.335l2.531-2.471C13.62.887 11.598 0 9.175 0 5.667 0 2.638 2.013 1.163 4.943l2.9 2.252c.727-2.162 2.74-3.727 5.112-3.727z"></path>
              </svg>
            </button>
            <button 
              onClick={() => signIn('github')}
              className="w-12 h-12 bg-gray-800 flex items-center justify-center rounded-md shadow-md hover:bg-gray-900 cursor-pointer"
            >
              <svg 
                aria-hidden="true" 
                focusable="false" 
                role="img" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 496 512" 
                className="w-5 h-5 text-white"
              >
                <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
            </button>
            <button 
              onClick={() => signIn('apple')}
              className="w-12 h-12 bg-white border border-gray-120 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 cursor-pointer"
            >
              <svg 
                aria-hidden="true" 
                focusable="false" 
                role="img" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 384 512" 
                className="w-5 h-5"
                style={{ color: 'rgb(37, 38, 43)' }}
              >
                <path fill="black" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}