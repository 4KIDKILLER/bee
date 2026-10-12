import { memo } from "react";
import {
  Folder,
  BeeCell,
  BeeImage,
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "/@c/index";
import { cn } from "/@/library/utils";
import { Info, SquarePen, Trash2 } from "lucide-react";
import type { BeeFileType } from "/@/views/folder-list/types";

export interface BeeFolderProps {
  folder: BeeFileType;
  selection?: boolean;
  isChecked?: boolean;
  isOpen?: boolean;
  onCheckChange?: (id: string) => void;
  onOpenChange?: (id: string, open: boolean) => void;
  onInfo?: (folder: BeeFileType) => void;
  onDelete?: (folder: BeeFileType) => void;
  onRename?: (folder: BeeFileType) => void;
  onOpen?: (folder: BeeFileType) => void;
}

interface ImageItemProps {
  src: string;
  alt?: string;
}

const ImageItem = memo(function ImageItem({ src, alt = "" }: ImageItemProps) {
  return (
    <BeeImage
      alt={alt}
      src={src}
      className="w-full h-full object-cover rounded-[10px] pointer-events-none select-none"
    />
  );
});

export function BeeFolder({
  folder,
  selection = false,
  isChecked = false,
  isOpen = false,
  onCheckChange,
  onOpenChange,
  onInfo,
  onDelete,
  onRename,
  onOpen,
}: BeeFolderProps) {
  return (
    <BeeCell>
      <Folder
        size={0.8}
        isOpen={isOpen}
        selection={selection}
        isChecked={isChecked}
        checkedColor="#4ADE80"
        onCheckChange={() => onCheckChange?.(folder.id)}
        onOpenChange={(open) => onOpenChange?.(folder.id, open)}
        items={folder.covers.map((src, idx) => (
          <ImageItem
            key={idx}
            src={src}
            alt={`folder-${folder.id}-img-${idx}`}
          />
        ))}
      />
      <div className="max-w-[100px] text-xs text-purple-50 text-shadow-amber-100">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <span
              title={folder.originalName}
              onClick={() => onOpen?.(folder)}
              className={cn(
                folder.isPrivate == 2 ? "bg-black/65 hover:text-(--theme-color)" : "bg-black/20 hover:bg-(--theme-color)",
                "block w-full truncate cursor-pointer rounded-md px-[6px] py-[4px] transition-colors",
              )}
            >
              {folder.originalName}
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onRename?.(folder)}>
              <SquarePen />
              重新命名
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onInfo?.(folder)}>
              <Info />
              显示简介
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDelete?.(folder)}>
              <Trash2 />
              删除
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </BeeCell>
  );
}

export default BeeFolder;
