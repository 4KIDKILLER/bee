import { useEffect, useRef, type CSSProperties } from "react";
import { BeeIcon, BeeImage, ScrollArea, Textarea } from "/@c/index";
import TagEditor from "./tag-editor";
import { X, Bookmark, Info, ImageIcon } from "lucide-react";
import type { BeeFileType } from "../types";

interface FolderIntroductionProps {
  open: boolean;
  folder: BeeFileType | null;
  onClose: () => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onRemarkChange: (id: string, remark: string) => void;
}

function FolderIntroduction({
  open,
  folder,
  onClose,
  onAddTag,
  onRemoveTag,
  onRemarkChange,
}: FolderIntroductionProps) {
  const panelRef = useRef<HTMLElement>(null);
  const shouldAnimate = folder !== null;

  const getAnimationProps = (delay: number) => {
    if (!shouldAnimate) {
      return {
        className: "",
        style: undefined,
      };
    }

    const animationName = open
      ? "animate__backInRight"
      : "animate__backOutRight";

    return {
      className: `animate__animated animate__faster ${animationName}`,
      style: {
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      } satisfies CSSProperties,
    };
  };

  const headerAnimation = getAnimationProps(0);
  const basicInfoAnimation = getAnimationProps(80);
  const tagAnimation = getAnimationProps(160);
  const remarkAnimation = getAnimationProps(240);
  const emptyStateAnimation = getAnimationProps(80);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          '[data-slot="dialog-content"], [data-slot="dialog-overlay"]',
        )
      ) {
        return;
      }

      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open, onClose]);

  return (
    <aside
      ref={panelRef}
      aria-hidden={!open}
      className={`absolute right-0 top-0 bottom-0 z-20 w-80 ${
        !open && !folder
          ? "hidden"
          : open
            ? "pointer-events-auto"
            : "pointer-events-none"
      }`}
    >
      <ScrollArea className="h-full text-white">
        <div className="flex min-h-full flex-col px-4 py-4">
          <header
            className={`rounded-2xl  border border-white/30 bg-black/90 p-4 flex items-center justify-between ${headerAnimation.className}`}
            style={headerAnimation.style}
          >
            <div className="flex min-w-0 items-center gap-2">
              <BeeIcon name="folder" />
              <span className="truncate text-md font-semibold tracking-wide text-white">
                {folder?.originalName ?? "未选择文件夹"}
              </span>
            </div>
            <span className="cursor-pointer" onClick={onClose}>
              <X className="size-5" />
            </span>
          </header>

          {folder ? (
            <div className="mt-3 flex flex-col gap-5">
              <section
                className={`rounded-2xl border border-white/30 bg-black/90 p-4 ${basicInfoAnimation.className}`}
                style={basicInfoAnimation.style}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Info className="size-4 text-(--theme-color)" />
                  <span>基本信息</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/75">
                  <div>
                    <div className="text-white/45">创建时间</div>
                    <div className="mt-1 text-white">{folder.createTime}</div>
                  </div>
                  <div>
                    <div className="text-white/45">上次打开时间</div>
                    <div className="mt-1 text-white">{folder.updateTime}</div>
                  </div>
                </div>
              </section>

              <TagEditor
                data={folder}
                key={folder.id}
                onAddTag={onAddTag}
                onRemoveTag={onRemoveTag}
                style={tagAnimation.style}
                className={tagAnimation.className}
              />

              <section
                className={`rounded-2xl border border-white/30 bg-black/90 p-4 ${remarkAnimation.className}`}
                style={remarkAnimation.style}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Bookmark className="size-4 text-(--theme-color)" />
                  <span>备注</span>
                </div>
                <Textarea
                  value={folder.remark}
                  onChange={(e) => onRemarkChange(folder.id, e.target.value)}
                  placeholder="在这里记录文件夹的用途、来源或整理说明"
                  className="mt-4 h-32 w-full resize-none rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30 px-3 py-3 text-sm outline-none transition-colors focus:border-sky-400/40"
                />
              </section>
              <section
                className={`rounded-2xl border border-white/30 bg-black/90 p-4 ${remarkAnimation.className}`}
                style={remarkAnimation.style}
              >
                <div className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-(--theme-color)" />
                    <span>封面</span>
                  </div>
                  <span className="text-xs text-white/40">
                    {folder.covers.length} 张预览
                  </span>
                </div>
                {folder.covers.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {folder.covers.slice(0, 3).map((src, index) => (
                      <div
                        key={`${folder.id}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <BeeImage
                          src={src}
                          alt={`${folder.name}-cover-${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-2 py-1 text-[11px] text-white/80 pointer-events-none">
                          封面 {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 px-3 py-6 text-center text-xs text-white/40">
                    当前文件夹暂无封面可预览
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div
              className={`flex flex-1 items-center justify-center px-2 text-center text-sm text-white/45 ${emptyStateAnimation.className}`}
              style={emptyStateAnimation.style}
            >
              请选择一个文件夹查看简介
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

export default FolderIntroduction;
