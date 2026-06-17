import type { ViewModeSwitchProps } from "../types";

function ViewModeSwitch({ value, onChange }: ViewModeSwitchProps) {
  const isUpload = value === "upload";

  return (
    <div className="relative flex h-8 w-56 overflow-hidden rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
      <div
        className={`bg-(--theme-color) absolute left-0.5 top-1/2 h-[calc(100%-4px)] w-[calc(50%-2px)] -translate-y-1/2 rounded-full transition-transform duration-300 ease-in-out ${
          isUpload ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <button
        type="button"
        onClick={() => onChange("list")}
        className="relative z-10 flex-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-pressed={value === "list"}
      >
        文件列表
      </button>
      <button
        type="button"
        onClick={() => onChange("upload")}
        className="relative z-10 flex-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-pressed={value === "upload"}
      >
        文件上传
      </button>
    </div>
  );
}

export default ViewModeSwitch;
