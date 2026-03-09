const TOKEN_KEY = "tcm_token";
const CENTER_KEY = "tcm_center_id";

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getCenterId: () => localStorage.getItem(CENTER_KEY),
  setCenterId: (centerId: string) => localStorage.setItem(CENTER_KEY, centerId),
  clearCenterId: () => localStorage.removeItem(CENTER_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CENTER_KEY);
  },
};