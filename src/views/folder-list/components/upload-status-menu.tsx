import { ImageUp } from "lucide-react";
import type { UploadStatusMenuProps } from "../types";

function UploadStatusMenu({
  items,
  onChange,
  activeKey,
  onUploadTrigger,
}: UploadStatusMenuProps) {
  return (
    <aside className="flex h-full w-50 shrink-0 flex-col border-r justify-between border-white/10 pt-2 pb-4 px-4">
      <div className="flex flex-col">
        <div className="mb-2 px-2 pt-1 text-xs font-medium tracking-[0.2em] text-white/35">
          队列状态
        </div>
        <div className="space-y-2">
          {items.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange(item.key)}
                className={`flex h-12 w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                  isActive
                    ? item.activeClass
                    : `border-transparent bg-transparent text-white/55 ${item.hoverClass}`
                }`}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div
                  className={`mt-1 text-xs ${isActive ? "opacity-80" : "text-white/40"}`}
                >
                  {item.count} 项
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onUploadTrigger}
        className="h-12 w-full flex items-center gap-1 justify-center rounded-full border-2 border-white/20 px-3 py-2 text-left transition-colors hover:text-(--theme-color) hover:border-(--theme-color)/60"
      >
        <ImageUp size={18} />
        <span className="text-sm font-medium">上传文件</span>
      </button>
    </aside>
  );
}

export default UploadStatusMenu;
