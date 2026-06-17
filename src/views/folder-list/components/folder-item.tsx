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
import { Info, SquarePen, Trash2 } from "lucide-react";
import type { FolderListFolder } from "/@/views/folder-list/types";

export interface BeeFolderProps {
  folder: FolderListFolder;
  selection?: boolean;
  isChecked?: boolean;
  isOpen?: boolean;
  onFolderCheckChange?: (id: number) => void;
  onFolderOpenChange?: (id: number, open: boolean) => void;
  onFolderInfo?: (folder: FolderListFolder) => void;
  onFolderDelete?: (folder: FolderListFolder) => void;
  onFolderRename?: (folder: FolderListFolder) => void;
}

interface ImageItemProps {
  src: string;
  alt?: string;
}

const ImageItem = memo(function ImageItem({ src, alt = "" }: ImageItemProps) {
  return (
    <BeeImage
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-[10px] pointer-events-none select-none"
    />
  );
});

export function BeeFolder({
  folder,
  selection = false,
  isChecked = false,
  isOpen = false,
  onFolderCheckChange,
  onFolderOpenChange,
  onFolderInfo,
  onFolderDelete,
  onFolderRename,
}: BeeFolderProps) {
  const { id, name, images } = folder;

  return (
    <BeeCell>
      <Folder
        size={0.8}
        isOpen={isOpen}
        selection={selection}
        isChecked={isChecked}
        checkedColor="#4ADE80"
        onCheckChange={() => onFolderCheckChange?.(id)}
        onOpenChange={(open) => onFolderOpenChange?.(id, open)}
        items={images.map((src, idx) => (
          <ImageItem key={idx} src={src} alt={`folder-${id}-img-${idx}`} />
        ))}
      />
      <div className="max-w-[100px] text-xs text-purple-50 text-shadow-amber-100">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <span
              title={name}
              className="block w-full truncate cursor-pointer rounded-md bg-black/35 px-[6px] py-[4px] transition-colors hover:bg-(--theme-color)"
            >
              {name}
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onFolderRename?.(folder)}>
              <SquarePen />
              重新命名
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFolderInfo?.(folder)}>
              <Info />
              显示简介
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFolderDelete?.(folder)}>
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
