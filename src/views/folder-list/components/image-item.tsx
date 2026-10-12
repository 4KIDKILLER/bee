import {
  BeeCell,
  BeeImage,
  BeeImageContextMenu,
  type BeeCoverSlotType,
} from "/@c/index";
import { cn } from "/@/library/utils";
import type { BeeFileType } from "../types";

export interface BeeImageItemProps {
  file: BeeFileType;
  onPreview?: (src: string) => void;
  onDelete?: (file: BeeFileType) => void;
  onRename?: (file: BeeFileType) => void;
  onViewDetail?: (file: BeeFileType) => void;
  onSetAsCover?: (slot: BeeCoverSlotType, src: string) => void;
}

export function BeeImageItem({
  file,
  onDelete,
  onRename,
  onPreview,
  onSetAsCover,
  onViewDetail,
}: BeeImageItemProps) {
  const dotIndex = file.originalName.lastIndexOf(".");
  const fileName = file.originalName.slice(0, dotIndex);
  const fileExt = file.originalName.slice(dotIndex);

  return (
    <BeeCell>
      <div className="w-[100px] h-[80px] flex items-center justify-center">
        <BeeImage
          preview
          width={80}
          height={64}
          fit="contain"
          alt={file.originalName}
          src={file.thumbSrc}
          className="overflow-hidden rounded-md"
          onPreview={() => onPreview?.(file.src)}
        />
      </div>
      <div className="max-w-[100px] text-xs text-purple-50 text-shadow-amber-100">
        <BeeImageContextMenu
          onRename={() => onRename?.(file)}
          onDelete={() => onDelete?.(file)}
          onViewDetail={() => onViewDetail?.(file)}
          onSetAsCover={(slot: BeeCoverSlotType) =>
            onSetAsCover?.(slot, file.thumbSrc)
          }
        >
          <span
            title={file.originalName}
            className={cn(
              file.isPrivate == 2 ? "bg-black/65 hover:text-(--theme-color)" : "bg-black/20 hover:bg-(--theme-color)",
              "flex max-w-full cursor-pointer rounded-md px-[6px] py-[4px] transition-colors",
            )}
          >
            <span className="min-w-0 truncate">{fileName}</span>
            <span className="shrink-0">{fileExt}</span>
          </span>
        </BeeImageContextMenu>
      </div>
    </BeeCell>
  );
}

export default BeeImageItem;
