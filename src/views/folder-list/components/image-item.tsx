import {
  BeeCell,
  BeeImage,
  BeeImageContextMenu,
  type BeeCoverSlotType,
} from "/@c/index";
import { cn } from "/@/library/utils";
import type { BeeFileType } from "../types";
import { CircleCheckBig } from "lucide-react";

export interface BeeImageItemProps {
  file: BeeFileType;
  selection?: boolean;
  isChecked?: boolean;
  onPreview?: (src: string) => void;
  onDelete?: (file: BeeFileType) => void;
  onRename?: (file: BeeFileType) => void;
  onViewDetail?: (file: BeeFileType) => void;
  onCheckChange?: (id: string) => void;
  onSetAsCover?: (slot: BeeCoverSlotType, src: string) => void;
}

export function BeeImageItem({
  file,
  onDelete,
  onRename,
  selection,
  isChecked,
  onPreview,
  onSetAsCover,
  onViewDetail,
  onCheckChange,
}: BeeImageItemProps) {
  const dotIndex = file.originalName.lastIndexOf(".");
  const fileName = file.originalName.slice(0, dotIndex);
  const fileExt = file.originalName.slice(dotIndex);

  return (
    <BeeCell>
      <div className="w-[100px] h-[80px] flex items-center justify-center">
        <div className="w-[80px] h-[64px] relative">
          <BeeImage
            preview
            width={80}
            height={64}
            fit="contain"
            src={file.thumbSrc}
            alt={file.originalName}
            className="overflow-hidden rounded-md"
            onPreview={() => onPreview?.(file.src)}
          />
          {selection && (
            <div
              onClick={() => onCheckChange?.(file.id)}
              className="w-full h-full absolute z-1 top-0 right-0 cursor-pointer"
            >
              {isChecked && (
                <div
                  className={cn(
                    isChecked && "bg-black/40",
                    "h-full w-full flex items-center justify-center text-[#EBEDF0]",
                  )}
                >
                  <CircleCheckBig size={40} />
                </div>
              )}
            </div>
          )}
        </div>
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
              file.isPrivate == 2
                ? "bg-black/65 hover:text-(--theme-color)"
                : "bg-black/20 hover:bg-(--theme-color)",
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
