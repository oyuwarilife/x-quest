"use client";

import { useAuth } from "@/hooks/useAuth";
import { useHydration } from "@/hooks/useHydration";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth();
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">⚔️</div>
          <p className="text-sm font-bold text-primary">X Quest</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
