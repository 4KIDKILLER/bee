import type { ViewModeSwitchProps } from "../types";

function ViewModeSwitch({ value, onChange }: ViewModeSwitchProps) {
  const isUpload = value === "upload";

  return (
    <div className="relative flex h-8 w-56 overflow-hidden rounded-full border border-white/10 bg-black/25">
      <div
        className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-(--theme-color) shadow-none transform-gpu will-change-transform transition-transform duration-300 ease-out ${
          isUpload ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <button
        type="button"
        onClick={() => onChange("list")}
        className="relative z-10 flex-1 appearance-none bg-transparent text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-pressed={value === "list"}
      >
        文件列表
      </button>
      <button
        type="button"
        onClick={() => onChange("upload")}
        className="relative z-10 flex-1 appearance-none bg-transparent text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-pressed={value === "upload"}
      >
        文件上传
      </button>
    </div>
  );
}

export default ViewModeSwitch;
