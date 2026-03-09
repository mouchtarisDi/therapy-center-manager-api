import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMyCenters } from "../api/centers";
import type { Center } from "../types/center";
import { storage } from "../utils/storage";
import { useAuth } from "./AuthContext";

interface CenterContextValue {
  centers: Center[];
  activeCenterId: string | null;
  setActiveCenterId: (centerId: string) => void;
  isLoadingCenters: boolean;
}

const CenterContext = createContext<CenterContextValue | undefined>(undefined);

export function CenterProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [centers, setCenters] = useState<Center[]>([]);
  const [activeCenterId, setActiveCenterIdState] = useState<string | null>(
    storage.getCenterId()
  );
  const [isLoadingCenters, setIsLoadingCenters] = useState(false);

  useEffect(() => {
    async function loadCenters() {
      if (!isAuthenticated) {
        setCenters([]);
        setActiveCenterIdState(null);
        return;
      }

      setIsLoadingCenters(true);

      try {
        const data = await getMyCenters();
        setCenters(data);

        const stored = storage.getCenterId();

        if (stored && data.some((center) => String(center.id) === stored)) {
          setActiveCenterIdState(stored);
        } else if (data.length > 0) {
          const firstCenterId = String(data[0].id);
          storage.setCenterId(firstCenterId);
          setActiveCenterIdState(firstCenterId);
        }
      } finally {
        setIsLoadingCenters(false);
      }
    }

    loadCenters();
  }, [isAuthenticated]);

  const setActiveCenterId = (centerId: string) => {
    storage.setCenterId(centerId);
    setActiveCenterIdState(centerId);
  };

  const value = useMemo(
    () => ({
      centers,
      activeCenterId,
      setActiveCenterId,
      isLoadingCenters,
    }),
    [centers, activeCenterId, isLoadingCenters]
  );

  return (
    <CenterContext.Provider value={value}>{children}</CenterContext.Provider>
  );
}

export function useCenter() {
  const context = useContext(CenterContext);

  if (!context) {
    throw new Error("useCenter must be used inside CenterProvider");
  }

  return context;
}