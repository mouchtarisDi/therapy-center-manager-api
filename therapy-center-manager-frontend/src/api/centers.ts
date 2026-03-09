import { api } from "./client";
import type { Center } from "../types/center";

export async function getMyCenters() {
  const response = await api.get<Center[]>("/centers/");
  return response.data;
}

export async function getCurrentCenter() {
  const response = await api.get<Center>("/centers/current");
  return response.data;
}