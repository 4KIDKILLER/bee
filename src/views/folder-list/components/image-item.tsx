import { BeeCell, BeeImage, BeeImageContextMenu } from "/@c/index";
import type { BeeFileType } from "../types";

export interface BeeImageItemProps {
  folder: BeeFileType;
  allowSetCover: boolean;
  onPreview?: (src: string) => void;
  onDelete?: (folder: BeeFileType) => void;
  onRename?: (folder: BeeFileType) => void;
  onViewDetail?: (folder: BeeFileType) => void;
}

export function BeeImageItem({
  folder,
  onDelete,
  onRename,
  onPreview,
  onViewDetail,
}: BeeImageItemProps) {
  const dotIndex = folder.originalName.lastIndexOf(".");
  const fileName = folder.originalName.slice(0, dotIndex);
  const fileExt = folder.originalName.slice(dotIndex);

  return (
    <BeeCell>
      <div className="w-[100px] h-[80px] flex items-center justify-center">
        <BeeImage
          preview
          width={80}
          height={64}
          fit="contain"
          onPreview={onPreview}
          src={folder.thumbSrc}
          showContextMenu={false}
          alt={folder.originalName}
          className="overflow-hidden rounded-md"
          />
      </div>
      <div className="max-w-[100px] text-xs text-purple-50 text-shadow-amber-100">
        <BeeImageContextMenu
          onRename={() => onRename?.(folder)}
          onDelete={() => onDelete?.(folder)}
          onViewDetail={() => onViewDetail?.(folder)}
        >
          <span
            title={folder.originalName}
            className="flex max-w-full cursor-pointer rounded-md bg-black/35 px-[6px] py-[4px] transition-colors hover:bg-(--theme-color)"
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
