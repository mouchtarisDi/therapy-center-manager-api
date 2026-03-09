import axios from "axios";
import { storage } from "../utils/storage";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  const centerId = storage.getCenterId();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (centerId) {
    config.headers["X-Center-Id"] = centerId;
  }

  return config;
});