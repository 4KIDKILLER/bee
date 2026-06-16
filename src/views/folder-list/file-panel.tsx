import { memo } from "react";
import {
  Folder,
  Button,
  ScrollArea,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "/@c/index";
import { SquarePen, Settings2, Info, Trash2 } from "lucide-react";
import type { FolderScrollAreaProps, ImageItemProps } from "./types";

const ImageItem = memo(function ImageItem({ src, alt = "" }: ImageItemProps) {
  return (
    <img
      className="w-full h-full object-cover rounded-[10px] pointer-events-none select-none"
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
    />
  );
});

function FolderScrollArea({
  showUploadPanel,
  folders,
  selection,
  selectedFolders,
  openFolderId,
  onFolderCheckChange,
  onFolderOpenChange,
}: FolderScrollAreaProps) {
  return (
    <ScrollArea
      className={`h-full w-full transition-transform duration-300 ease-in-out ${
        showUploadPanel ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="flex items-end px-[16px] h-[36px] w-full">
        <Button
          className="text-white/20 hover:text-white/80"
          size="sm"
          variant="link"
        >
          时间
        </Button>
        <Button
          className="text-white/20 hover:text-white/80"
          size="sm"
          variant="link"
        >
          大小
        </Button>
        <Button
          className="text-white/20 hover:text-white/80"
          size="sm"
          variant="link"
        >
          名称
        </Button>
      </div>
      <div className="grid w-full grid-cols-7 auto-rows-[150px]">
        {folders.map(({ id, name, images }) => (
          <div key={id} className="flex items-center justify-center">
            <div className="text-center">
              <Folder
                size={0.8}
                selection={selection}
                isChecked={selectedFolders.includes(id)}
                isOpen={openFolderId === id}
                checkedColor="#4ADE80"
                onCheckChange={() => onFolderCheckChange(id)}
                onOpenChange={(open) => onFolderOpenChange(id, open)}
                items={images.map((src, idx) => (
                  <ImageItem
                    key={idx}
                    src={src}
                    alt={`folder-${id}-img-${idx}`}
                  />
                ))}
              />
              <div className="pt-[5px] text-purple-50 text-xs text-shadow-amber-100">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <span className="bg-black/35 py-[4px] px-[6px] rounded-md cursor-pointer hover:bg-(--theme-color) transition-colors">
                      {name}
                    </span>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>
                      <SquarePen />
                      重新命名
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Info />
                      显示简介
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Settings2 />
                      设置
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <Trash2 />
                      删除
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default FolderScrollArea;
