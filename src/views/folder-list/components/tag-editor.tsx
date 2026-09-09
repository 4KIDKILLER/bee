import { useState, type CSSProperties } from "react";
import { Button, Input, ButtonGroup } from "/@c/index";
import { Plus, Tag, X } from "lucide-react";
import type { BeeFileType } from "../types";

interface FolderTagEditorProps {
  data: BeeFileType;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tagId: string) => void;
  className?: string;
  style?: CSSProperties;
}

function FolderTagEditor({
  data,
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

    onAddTag(data.id, nextTag);
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
        {data.tags.length > 0 ? (
          data.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs text-sky-100"
            >
              {tag.tagName}
              <button
                type="button"
                className="rounded-full text-sky-100/70 transition-colors hover:text-white"
                onClick={() => onRemoveTag(data.id, tag.id)}
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

export default FolderTagEditor;
