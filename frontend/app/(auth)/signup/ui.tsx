// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { signUp } from "@/app/actions/auth-actions";
// import { redirect } from "next/navigation";

// export default function UI() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (password !== passwordConfirm) {
//       alert("비밀번호가 일치하지 않습니다.");
//       return;
//     }

//     const result = await signUp({
//       email,
//       password,
//     });
//     if (result?.status === "ok") {
//       redirect("/signin");
//     }

//     if (result?.message) {
//       alert(result.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <h1 className="text-3xl font-bold">회원가입</h1>
//       <p className="text-gray-700">인프런에서 다양한 학습의 기회를 얻으세요</p>

//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-2 min-w-[300px]"
//       >
//         <label htmlFor="email">이메일</label>
//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           type="email"
//           name="email"
//           placeholder="example@inflab.com"
//           className="border-2 border-gray-300 rounded-sm p-2"
//         />
//         <label htmlFor="password">비밀번호</label>
//         <input
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           type="password"
//           name="password"
//           placeholder="example@inflab.com"
//           className="border-2 border-gray-300 rounded-sm p-2"
//         />
//         <label htmlFor="passwordConfirm">비밀번호 확인</label>
//         <input
//           value={passwordConfirm}
//           onChange={(e) => setPasswordConfirm(e.target.value)}
//           type="password"
//           name="passwordConfirm"
//           placeholder="example@inflab.com"
//           className="border-2 border-gray-300 rounded-sm p-2"
//         />

//         <button
//           type="submit"
//           className="bg-green-500 text-white font-bold cursor-pointer rounded-sm p-2"
//         >
//           회원가입
//         </button>
//         <Link href="/signin" className="text-center">
//           로그인
//         </Link>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { signUp } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";

export default function UI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await signUp({
      email,
      password,
    });
    if (result?.status === "ok") {
      redirect("/signin");
    }

    if (result?.message) {
      alert(result.message);
    }
  };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasPasswordInput = password.length > 0;

  const categoryCount = [
    hasLower || hasUpper, 
    hasNumber,            
    hasSpecial,          
  ].filter(Boolean).length;

  const passwordChecks = {
    hasMinCategory: categoryCount >=2,
    hasMinLength: password.length >= 8 && password.length <= 32,
    hasNoRepeat: !/(.)\1\1/.test(password),
  };

  const passwordConfirmCheck =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xs">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-15 h-15 rounded-full border border-gray-150 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 22"
              fill="none"
              className="w-[24px] h-[24px] text-[#00C471]"
              shapeRendering="geometricPrecision"
            >
              <path
                d="M20.2431 7.12192C19.7223 5.92866 19.0192 4.86511 18.1339 3.9572C17.2225 3.04929 16.1809 2.32296 14.9831 1.80415C13.7853 1.28534 12.4834 1 11.1033 1C9.74922 1 8.44726 1.23346 7.22341 1.75227C5.99956 2.27108 4.93194 2.97147 3.99453 3.85344C3.05711 4.76135 2.32801 5.79896 1.80722 6.99222C1.28643 8.18547 1 9.48249 1 10.8573C1 12.2062 1.23435 13.5032 1.75514 14.7224C2.27593 15.9416 2.97899 17.0052 3.89037 17.939C4.80175 18.8729 5.86936 19.5992 7.06717 20.118C8.29102 20.6368 9.56695 20.9222 10.947 20.9222L20.9201 21L20.9982 11.013C21.0243 9.63813 20.7639 8.34112 20.2431 7.12192ZM7.84835 18.2763C6.88489 17.8612 6.0256 17.2646 5.29649 16.5383C4.56739 15.786 3.99453 14.93 3.5779 13.9702C3.16127 12.9844 2.97899 11.9728 2.97899 10.8833C2.97899 9.76783 3.21335 8.73022 3.62998 7.77043C4.0466 6.81064 4.64551 5.98055 5.37461 5.25422C6.12975 4.52789 6.98905 3.98314 7.95251 3.56809C8.942 3.15305 9.95754 2.97147 11.0512 2.97147C12.1709 2.97147 13.2125 3.20493 14.1759 3.61997C15.1394 4.03502 15.9726 4.60571 16.7017 5.35798C17.4308 6.0843 17.9777 6.94034 18.3943 7.90013C18.8109 8.85992 18.9932 9.89754 18.9932 11.013L18.9411 17.7056L11.8063 10.4682L13.3947 6.11025C13.577 5.64332 13.3166 5.12451 12.8479 4.94293C12.3792 4.76135 11.8584 5.02075 11.6761 5.48768L10.4002 9.01556L8.16082 6.75875C7.79627 6.39559 7.22341 6.39559 6.88489 6.75875C6.52034 7.12192 6.52034 7.69261 6.88489 8.02983L12.3532 13.607H8.39518C7.90043 13.607 7.4838 14.022 7.4838 14.5149C7.4838 15.0078 7.90043 15.4228 8.39518 15.4228H14.0718L17.6652 19.0026L10.947 18.9507C9.82734 18.9248 8.83785 18.7172 7.84835 18.2763Z"
                fill="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          {/* <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <span className="text-xl">🎓</span>
          </div> */}
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">회원가입</h1>
        <p className="text-center text-sm text-gray-600 mb-6">인프런에서 다양한 학습의 기회를 얻으세요</p>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              이메일
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="example@inflab.com"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#1dc078]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#1dc078]"
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
            
            <div className="mt-2 space-y-1">
              <div
                className={`text-xs flex items-center gap-2 ${
                  !hasPasswordInput
                    ? "text-gray-400"
                    : passwordChecks.hasMinCategory
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <span>{!hasPasswordInput ? '✓' :
                  passwordChecks.hasMinCategory ? '✓' : 'X'}</span>
                <span>영문/숫자/특수문자 중, 2가지 이상 포함</span>
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  !hasPasswordInput
                    ? "text-gray-400"
                    : passwordChecks.hasMinLength
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <span>{!hasPasswordInput ? '✓' :
                  passwordChecks.hasMinLength ? '✓' : 'X'}</span>
                <span>8자 이상 32자 이하 입력 (공백 제외)</span>
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  !hasPasswordInput
                    ? "text-gray-400"
                    : passwordChecks.hasNoRepeat
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <span>{!hasPasswordInput ? '✓' :
                  passwordChecks.hasNoRepeat ? '✓' : 'X'}</span>
                <span>연속 3자 이상 동일한 문자/숫자 제외</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type={showPasswordConfirm ? "text" : "password"}
                name="passwordConfirm"
                placeholder="********"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-[#1dc078]"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPasswordConfirm ? (
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
            { passwordConfirmCheck && (
              <div className="mt-2 space-y-1">
                <div className="text-xs flex items-center gap-2 text-red-500">
                  <span>X</span>
                  <span>비밀번호가 일치하지 않습니다.</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1dc078] text-white font-semibold rounded-md p-3 mt-4 hover:bg-[#19a866] transition-colors cursor-pointer"
          >
            가입하기
          </button>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="marketing" className="w-3 h-3 accent-[#1dc078] cursor-pointer" />
            <label htmlFor="marketing" className="text-xs text-gray-600 cursor-pointer">
              서비스 이용약관, 개인정보 처리방침에 동의합니다.
            </label>
          </div>
        </form>

        {/* 간편 회원가입 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-500">간편 회원가입</span>
            </div>
          </div>

          {/* <div className="flex justify-center gap-4 mt-4">
            <button className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center hover:opacity-80">
              <span className="text-xl">💬</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50">
              <span className="text-sm font-semibold">G</span>
            </button>
          </div> */}

          <div className="flex justify-center gap-3 mt-5">
            <button
              className="w-11 h-11 bg-yellow-400 flex items-center justify-center rounded-md shadow-md hover:bg-yellow-500 cursor-pointer"
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
              className="w-11 h-11 bg-gray-100 border border-gray-120 flex items-center justify-center rounded-md shadow-md hover:bg-gray-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.942c-.1.828-.638 2.073-1.834 2.91l-.016.112 2.662 2.063.185.018c1.694-1.565 2.67-3.867 2.67-6.597z"></path>
                <path fill="#34A853" d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.83-2.193c-.758.528-1.774.897-3.11.897-2.372 0-4.385-1.564-5.102-3.727l-.105.01-2.769 2.142-.036.1c1.475 2.93 4.504 4.943 8.012 4.943z"></path>
                <path fill="#FBBC05" d="M4.073 10.743c-.19-.558-.3-1.156-.3-1.774 0-.618.11-1.216.29-1.774l-.005-.119L1.254 4.9l-.091.044C.555 6.159.206 7.524.206 8.969c0 1.445.349 2.81.957 4.026l2.91-2.252z"></path>
                <path fill="#EB4335" d="M9.175 3.468c1.684 0 2.82.728 3.468 1.335l2.531-2.471C13.62.887 11.598 0 9.175 0 5.667 0 2.638 2.013 1.163 4.943l2.9 2.252c.727-2.162 2.74-3.727 5.112-3.727z"></path>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}