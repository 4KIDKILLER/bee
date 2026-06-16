import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Button,
  BeeIcon,
  Input,
  ScrollArea,
  Textarea,
  ButtonGroup,
} from "/@c/index";
import { Plus, Tag, X, Bookmark, Info } from "lucide-react";
import type { FolderListFolder } from "./types";

interface FolderIntroductionProps {
  open: boolean;
  folder: FolderListFolder | null;
  onClose: () => void;
  onAddTag: (id: number, tag: string) => void;
  onRemoveTag: (id: number, tag: string) => void;
  onRemarkChange: (id: number, remark: string) => void;
}

interface FolderTagEditorProps {
  folder: FolderListFolder;
  onAddTag: (id: number, tag: string) => void;
  onRemoveTag: (id: number, tag: string) => void;
  className?: string;
  style?: CSSProperties;
}

function FolderTagEditor({
  folder,
  onAddTag,
  onRemoveTag,
  className,
  style,
}: FolderTagEditorProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag) {
      return;
    }

    onAddTag(folder.id, nextTag);
    setTagInput("");
  };

  return (
    <section
      className={`rounded-2xl border border-white/30 bg-black/90 p-4 ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Tag className="size-4 text-(--theme-color)" />
        标签
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {folder.tags.length > 0 ? (
          folder.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs text-sky-100"
            >
              {tag}
              <button
                type="button"
                className="rounded-full text-sky-100/70 transition-colors hover:text-white"
                onClick={() => onRemoveTag(folder.id, tag)}
              >
                <X className="size-3" />
              </button>
            </span>
          ))
        ) : (
          <div className="text-xs text-white/40">暂未设置标签</div>
        )}
      </div>
      <div className="mt-4 w-full">
        <ButtonGroup className="w-full">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="输入标签后回车或点击添加"
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          />
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            onClick={handleAddTag}
          >
            <Plus />
          </Button>
        </ButtonGroup>
      </div>
    </section>
  );
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
  const animationName = open ? "animate__backInRight" : "animate__backOutRight";
  const getAnimationProps = (delay: number) => ({
    className: `animate__animated animate__faster ${animationName}`,
    style: {
      animationDelay: `${delay}ms`,
      animationFillMode: "both",
    } satisfies CSSProperties,
  });

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
        open ? "pointer-events-auto" : "pointer-events-none"
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
                {folder?.name ?? "未选择文件夹"}
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
                    <div className="mt-1 text-white">{folder.createdAt}</div>
                  </div>
                  <div>
                    <div className="text-white/45">上次打开时间</div>
                    <div className="mt-1 text-white">{folder.lastOpenedAt}</div>
                  </div>
                </div>
              </section>

              <FolderTagEditor
                key={folder.id}
                folder={folder}
                onAddTag={onAddTag}
                onRemoveTag={onRemoveTag}
                className={tagAnimation.className}
                style={tagAnimation.style}
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
