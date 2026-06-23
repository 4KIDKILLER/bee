import { Spinner } from "../ShadcnUI/spinner";
import { BeeIcon } from "./bee-icon";

export interface BeeLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export function BeeLoading({
  title = "页面加载中...",
  description = "正在准备 BEE 工作台",
  className = "",
}: BeeLoadingProps) {
  return (
    <div
      className={`relative flex h-full min-h-[320px] w-full items-center justify-center overflow-hidden ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--theme-color)/18 blur-3xl animate-pulse" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />
      </div>

      <div className="relative flex flex-col items-center gap-5 rounded-[32px] border border-white/10 bg-black/30 px-10 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="relative flex size-22 items-center justify-center rounded-full border border-white/10 bg-black/45 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-0 rounded-full border border-(--theme-color)/35 animate-ping" />
          <div className="absolute inset-[6px] rounded-full border border-white/10" />
          <BeeIcon size={36} name="folder-fill" className="relative z-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.28)]" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-white/88">
            <Spinner className="size-4 text-(--theme-color)" />
            <span>{title}</span>
          </div>
          <p className="max-w-[220px] text-xs leading-5 text-white/50">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BeeLoading;
