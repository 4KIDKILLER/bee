import type { ReactNode } from "react";

export function BeeCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

