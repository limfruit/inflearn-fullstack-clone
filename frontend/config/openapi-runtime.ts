import { CreateClientConfig } from "@/generated/openapi-client/client.gen";

import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME =
  // process.env.NODE_ENV === "production"
  // production 이더라도 HTTP로 동작할 수도 있음 / 로컬호스트 환경에서 production으로 테스트해볼 수 있음
  process.env.USE_HTTPS === "true"
    ? "__Secure-authjs.session-token" // Secure Cookie는 원칙적으로 HTTPS 환경에서만 실행되어야함 
    : "authjs.session-token";

const API_URL = process.env.API_URL || "http://localhost:8000";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: API_URL,
  async auth() {
    return getCookie(AUTH_COOKIE_NAME, { cookies });
  },
});