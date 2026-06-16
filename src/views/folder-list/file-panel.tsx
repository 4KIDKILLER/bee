import { memo, useState } from "react";
import {
  Folder,
  BeeTootip,
  Button,
  ScrollArea,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "/@c/index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ShadcnUI/alert-dialog";
import {
  SquarePen,
  Info,
  Trash2,
  SquareMousePointer,
  SquareDashedMousePointer,
} from "lucide-react";
import CreateFolderDialog from "./create-folder-dialog";
import FolderIntroduction from "./folder-introduction";
import type {
  FolderListFolder,
  FolderScrollAreaProps,
  ImageItemProps,
} from "./types";

const folderSeeds = [
  {
    name: "手机图库",
    createdAt: "2026-03-08 10:24",
    lastOpenedAt: "2026-06-15 18:32",
    tags: ["手机", "旅行"],
    remark: "收纳手机相册里常用的照片，方便后续整理与分享。",
  },
  {
    name: "壁纸",
    createdAt: "2026-02-18 21:10",
    lastOpenedAt: "2026-06-14 09:05",
    tags: ["桌面", "4K"],
    remark: "保存日常使用的桌面壁纸和灵感图，偏明亮风格。",
  },
  {
    name: "截图",
    createdAt: "2026-04-27 14:48",
    lastOpenedAt: "2026-06-13 23:16",
    tags: ["工作", "记录"],
    remark: "会议截图与流程记录集中放在这里，便于后续回看。",
  },
  {
    name: "产品海报",
    createdAt: "2026-01-12 08:15",
    lastOpenedAt: "2026-06-12 16:42",
    tags: ["设计", "宣传"],
    remark: "用于存放产品海报、活动宣传图和导出预览稿。",
  },
  {
    name: "灵感收集",
    createdAt: "2026-05-02 19:36",
    lastOpenedAt: "2026-06-16 10:08",
    tags: ["配色", "参考"],
    remark: "从各个平台收集的参考图，主要用于版式和色彩灵感。",
  },
  {
    name: "社媒封面",
    createdAt: "2026-03-30 11:20",
    lastOpenedAt: "2026-06-11 20:14",
    tags: ["运营", "封面"],
    remark: "公众号、视频号和社交媒体渠道封面图统一归档。",
  },
  {
    name: "活动照片",
    createdAt: "2026-04-09 15:05",
    lastOpenedAt: "2026-06-10 22:31",
    tags: ["线下", "现场"],
    remark: "整理线下活动现场拍摄的照片，便于后期筛选和修图。",
  },
  {
    name: "电商主图",
    createdAt: "2026-02-07 13:52",
    lastOpenedAt: "2026-06-09 17:48",
    tags: ["商品", "白底"],
    remark: "电商商品主图、详情页切片和版本备份集中存放。",
  },
  {
    name: "头像素材",
    createdAt: "2026-01-28 09:40",
    lastOpenedAt: "2026-06-08 14:16",
    tags: ["人物", "裁切"],
    remark: "头像、证件照和人物裁切素材，用于不同平台适配。",
  },
  {
    name: "待整理",
    createdAt: "2026-06-01 18:27",
    lastOpenedAt: "2026-06-16 09:56",
    tags: ["临时", "收纳"],
    remark: "暂时还未分类的图片先放在这里，后续再统一整理。",
  },
];

const initialFolders: FolderListFolder[] = folderSeeds.map((folder, index) => ({
  id: index,
  images: Array.from(
    { length: 3 },
    (_, imageIndex) =>
      `https://picsum.photos/seed/folder-${index}-${imageIndex}/200/200`,
  ),
  ...folder,
}));

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
  selection,
  selectedFolders,
  openFolderId,
  onSelectionToggle,
  onFolderCheckChange,
  onFolderOpenChange,
}: FolderScrollAreaProps) {
  const [folders, setFolders] = useState<FolderListFolder[]>(initialFolders);
  const [showFolderIntroduction, setShowFolderIntroduction] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [pendingDeleteFolder, setPendingDeleteFolder] =
    useState<FolderListFolder | null>(null);
  const activeFolder =
    folders.find((folder) => folder.id === activeFolderId) ?? null;

  const handleShowFolderIntroduction = (id: number) => {
    setActiveFolderId(id);
    setShowFolderIntroduction(true);
  };

  const handleCloseFolderIntroduction = () => {
    setShowFolderIntroduction(false);
  };

  const handleAddTag = (id: number, tag: string) => {
    const nextTag = tag.trim();
    if (!nextTag) {
      return;
    }

    setFolders((prev) =>
      prev.map((folder) => {
        if (folder.id !== id || folder.tags.includes(nextTag)) {
          return folder;
        }

        return {
          ...folder,
          tags: [...folder.tags, nextTag],
        };
      }),
    );
  };

  const handleRemoveTag = (id: number, tag: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id
          ? {
              ...folder,
              tags: folder.tags.filter((item) => item !== tag),
            }
          : folder,
      ),
    );
  };

  const handleRemarkChange = (id: number, remark: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id
          ? {
              ...folder,
              remark,
            }
          : folder,
      ),
    );
  };

  const handleDeleteFolder = () => {
    if (!pendingDeleteFolder) {
      return;
    }

    setFolders((prev) =>
      prev.filter((folder) => folder.id !== pendingDeleteFolder.id),
    );

    if (activeFolderId === pendingDeleteFolder.id) {
      setActiveFolderId(null);
      setShowFolderIntroduction(false);
    }

    setPendingDeleteFolder(null);
  };

  return (
    <>
      <ScrollArea
        className={`h-full w-full transition-transform duration-300 ease-in-out ${
          showUploadPanel ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex items-center">
            <CreateFolderDialog>
              <Button
                size="sm"
                variant="link"
                className="text-white/20 hover:text-(--theme-color)/80"
              >
                新建文件夹
              </Button>
            </CreateFolderDialog>
            <div className="w-[2px] h-[10px] bg-white/50 mx-1 rounded-xs" />
            <Button
              className="text-white/20 hover:text-(--theme-color)/80"
              size="sm"
              variant="link"
            >
              时间
            </Button>
            <Button
              className="text-white/20 hover:text-(--theme-color)/80"
              size="sm"
              variant="link"
            >
              大小
            </Button>
            <Button
              className="text-white/20 hover:text-(--theme-color)/80"
              size="sm"
              variant="link"
            >
              名称
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <BeeTootip content={`选择${selection ? "已开启" : "已关闭"}`}>
              <Button
                size="sm"
                variant="link"
                onClick={onSelectionToggle}
                className="text-white/20 hover:text-(--theme-color)/80"
              >
                {selection ? (
                  <SquareMousePointer />
                ) : (
                  <SquareDashedMousePointer />
                )}
              </Button>
            </BeeTootip>
          </div>
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
                <div className="pt-[5px] text-xs text-purple-50 text-shadow-amber-100">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <span className="cursor-pointer rounded-md bg-black/35 px-[6px] py-[4px] transition-colors hover:bg-(--theme-color)">
                        {name}
                      </span>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>
                        <SquarePen />
                        重新命名
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleShowFolderIntroduction(id)}
                      >
                        <Info />
                        显示简介
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          setPendingDeleteFolder(
                            folders.find((folder) => folder.id === id) ?? null,
                          )
                        }
                      >
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
      <FolderIntroduction
        open={showFolderIntroduction}
        folder={activeFolder}
        onClose={handleCloseFolderIntroduction}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onRemarkChange={handleRemarkChange}
      />
      <AlertDialog
        open={Boolean(pendingDeleteFolder)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteFolder(null);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除文件夹</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteFolder
                ? `确定要删除“${pendingDeleteFolder.name}”吗？该操作不可撤销。`
                : "确定要删除该文件夹吗？该操作不可撤销。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteFolder}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FolderScrollArea;
