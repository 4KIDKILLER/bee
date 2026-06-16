import type { UploadStatusMenuProps } from "./types";

function UploadStatusMenu({ items, activeKey, onChange }: UploadStatusMenuProps) {
  return (
    <aside className="flex h-full w-40 shrink-0 flex-col border-r border-white/10 p-2">
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
              className={`flex h-12 w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${
                isActive
                  ? item.activeClass
                  : `border-transparent bg-transparent text-white/55 ${item.hoverClass}`
              }`}
            >
              <div className="text-sm font-medium">{item.label}</div>
              <div className={`mt-1 text-xs ${isActive ? "opacity-80" : "text-white/40"}`}>
                {item.count} 项
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default UploadStatusMenu;
