import { api } from "./client";
import type { LoginResponse, MeUser } from "../types/auth";

export async function loginRequest(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function getMe() {
  const response = await api.get<MeUser>("/auth/me");
  return response.data;
}