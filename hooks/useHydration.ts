import { useEffect, useState } from "react";

/**
 * Zustand persist のハイドレーション完了を待つフック
 * SSRとクライアントの不一致を防ぐ
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
