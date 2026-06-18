import { BeeCell, BeeImage, BeeImageContextMenu } from "/@c/index";
import type { BeeFileType } from "../types";

export interface BeeImageItemProps {
  folder: BeeFileType;
  onPreview?: (src: string) => void;
  onViewDetail?: (folder: BeeFileType) => void;
}

export function BeeImageItem({
  folder,
  onPreview,
  onViewDetail,
}: BeeImageItemProps) {
  return (
    <BeeCell>
      <div className="w-[100px] h-[80px] flex items-center justify-center">
        <BeeImage
          showContextMenu={false}
          className="overflow-hidden rounded-md"
          fit="contain"
          width={80}
          height={64}
          preview
          onPreview={onPreview}
          src={folder.images[0]}
        />
      </div>
      <div className="max-w-[100px] text-xs text-purple-50 text-shadow-amber-100">
        <BeeImageContextMenu
          onViewDetail={() => onViewDetail?.(folder)}
        >
          <span
            title={folder.name}
            className="block truncate cursor-pointer rounded-md bg-black/35 px-[6px] py-[4px] transition-colors hover:bg-(--theme-color)"
          >
            {folder.name}
          </span>
        </BeeImageContextMenu>
      </div>
    </BeeCell>
  );
}

export default BeeImageItem;
