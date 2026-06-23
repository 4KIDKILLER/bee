import type { ReactNode } from "react";
import { cn } from "/@/library/utils";

interface StorageSummaryCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  footer?: ReactNode;
  className?: string;
}

function StorageSummaryCard({
  icon,
  title,
  value,
  description,
  footer,
  className,
}: StorageSummaryCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white/85">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-(--theme-color)">
              {icon}
            </span>
            <span>{title}</span>
          </div>
          <div>
            <div className="text-3xl font-semibold tracking-tight text-white/90">
              {value}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {description}
            </p>
          </div>
        </div>
      </div>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}

export default StorageSummaryCard;
