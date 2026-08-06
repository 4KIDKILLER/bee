import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  BeeEmpty,
  BeeFolder,
  BeeImagePreview,
  // BeeTootip,
  ScrollArea,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "/@c/index";
// SquareMousePointer, SquareDashedMousePointer
import CreateFolderDialog from "./components/create-folder-dialog";
import FolderIntroduction from "./components/folder-introduction";
import ImageIntroduction from "./components/image-introduction";
import BeeImageItem from "./components/image-item";
import type { BeeFileType, FolderScrollAreaProps } from "./types";
import { FileApi } from "/@/api/file";
import { FolderPlus } from "lucide-react";

function FolderScrollArea({
  showUploadPanel,
  setViewMode,
  selection,
  selectedFolders,
  openFolderId,
  currentFolderId,
  page,
  limit,
  // onSelectionToggle,
  onFolderCheckChange,
  onFolderOpenChange,
  onOpenFolder,
  onPaginationChange,
}: FolderScrollAreaProps) {
  const [folders, setFolders] = useState<BeeFileType[]>([]);
  const [showFolderIntroduction, setShowFolderIntroduction] = useState(false);
  const [showImageIntroduction, setShowImageIntroduction] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [pendingDeleteFolder, setPendingDeleteFolder] =
    useState<BeeFileType | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const skipNextFetchKeyRef = useRef<string | null>(null);
  const activeFolder =
    folders.find((folder) => folder.id === activeFolderId) ?? null;
  const activeImage =
    folders.find(
      (folder) => folder.id === activeImageId && folder.type === 2,
    ) ?? null;

  const handleShowFolderIntroduction = (id: string) => {
    setActiveFolderId(id);
    setActiveImageId(null);
    setShowImageIntroduction(false);
    setShowFolderIntroduction(true);
  };

  const handleShowImageIntroduction = (id: string) => {
    setActiveImageId(id);
    setActiveFolderId(null);
    setShowFolderIntroduction(false);
    setShowImageIntroduction(true);
  };

  const handleCloseFolderIntroduction = () => {
    setShowFolderIntroduction(false);
  };

  const handleCloseImageIntroduction = () => {
    setShowImageIntroduction(false);
  };

  const handleAddTag = (id: string, tag: string) => {
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

  const handleRemoveTag = (id: string, tag: string) => {
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

  const handleRemarkChange = (id: string, remark: string) => {
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

  const handlePreviewImage = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
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

    if (activeImageId === pendingDeleteFolder.id) {
      setActiveImageId(null);
      setShowImageIntroduction(false);
    }

    setPendingDeleteFolder(null);
  };

  const getFileList = useCallback(
    (parentId: string, currentPage: number) => {
      return FileApi.getFileListApi(
        {
          page: currentPage,
          parentId,
          pageSize: limit,
        },
      ).then((res) => {
        setFolders(res.data.list);
        onPaginationChange({
          page: res.data.page,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
      });
    },
    [limit, onPaginationChange],
  );

  const onRefresh = useCallback(() => {
    void getFileList(currentFolderId, page).catch(() => {});
  }, [currentFolderId, getFileList, page]);

  const onCreateFolder = useCallback(
    async (folderName: string) => {
      const createResult = await FileApi.createFolderApi({
        folderName,
        parentId: currentFolderId,
      });
      return new Promise<boolean>((resolve, reject) => {
        if (createResult.code == 200) {
          onRefresh();
          resolve(true);
        } else {
          reject(false);
        }
      });
    },
    [currentFolderId, onRefresh],
  );

  useEffect(() => {
    const requestKey = `${currentFolderId}:${page}:${limit}`;

    if (skipNextFetchKeyRef.current === requestKey) {
      skipNextFetchKeyRef.current = null;
      return;
    }

    void getFileList(currentFolderId, page)
      .then()
      .catch(() => {});
  }, [currentFolderId, getFileList, limit, page]);

  const toggleUploadPanel = () => {
    setViewMode("upload");
  };

  const handleOpenFolder = useCallback(
    (folder: BeeFileType) => {
      void getFileList(folder.id, 1)
        .then(() => {
          setActiveFolderId(null);
          setActiveImageId(null);
          setShowFolderIntroduction(false);
          setShowImageIntroduction(false);
          skipNextFetchKeyRef.current = `${folder.id}:1:${limit}`;
          onOpenFolder(folder);
        })
        .catch(() => {});
    },
    [getFileList, limit, onOpenFolder],
  );

  return (
    <div
      className={`absolute inset-0 h-full w-full will-change-transform transition-transform duration-300 ease-in-out ${
        showUploadPanel ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {folders.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <BeeEmpty onUpload={toggleUploadPanel} onRefresh={onRefresh}>
            <CreateFolderDialog onConfirm={onCreateFolder}>
              <Button
                size="sm"
                variant="link"
                onClick={onRefresh}
                className="text-white/80 text-[12px]"
              >
                <FolderPlus />
                创建文件夹
              </Button>
            </CreateFolderDialog>
          </BeeEmpty>
        </div>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="flex w-full h-[32px] items-end justify-between px-4">
            <div className="flex items-center gap-2">
              <CreateFolderDialog onConfirm={onCreateFolder}>
                <span className="cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80">
                  新建文件夹
                </span>
              </CreateFolderDialog>
              <div className="w-[2px] h-[10px] bg-white/50 mx-1 rounded-xs" />
              <span className="cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80">
                时间
              </span>
              <span className="cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80">
                大小
              </span>
              <span className="cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80">
                名称
              </span>
              <div className="w-[2px] h-[10px] bg-white/50 mx-1 rounded-xs" />
              <span
                onClick={onRefresh}
                className="flex items-center gap-1 cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80"
              >
                刷新
              </span>
            </div>
            <div className="flex gap-2 items-center">
              {/* <BeeTootip content={`${selection ? "关闭" : "开启"}选择`}>
              <span
                onClick={onSelectionToggle}
              >
                {selection ? (
                  <SquareMousePointer className="text-(--theme-color)" size={20} />
                ) : (
                  <SquareDashedMousePointer size={20} className="text-white/20 hover:text-(--theme-color)/80" />
                )}
              </span>
            </BeeTootip> */}
            </div>
          </div>
          <div className="grid w-full grid-cols-8 auto-rows-[150px]">
            {folders.map((folder) =>
              folder.type === 1 ? (
                <BeeFolder
                  key={folder.id}
                  folder={folder}
                  selection={selection}
                  isChecked={selectedFolders.includes(folder.id)}
                  isOpen={openFolderId === folder.id}
                  onFolderCheckChange={onFolderCheckChange}
                  onFolderOpenChange={onFolderOpenChange}
                  onFolderInfo={(item) => handleShowFolderIntroduction(item.id)}
                  onFolderDelete={setPendingDeleteFolder}
                  onOpenFolder={handleOpenFolder}
                />
              ) : (
                <BeeImageItem
                  key={folder.id}
                  folder={folder}
                  onPreview={(src: string) => handlePreviewImage([src], 0)}
                  onViewDetail={(item) => handleShowImageIntroduction(item.id)}
                />
              ),
            )}
          </div>
        </ScrollArea>
      )}
      <FolderIntroduction
        open={showFolderIntroduction}
        folder={activeFolder}
        onClose={handleCloseFolderIntroduction}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onRemarkChange={handleRemarkChange}
        onPreviewImage={handlePreviewImage}
      />
      <ImageIntroduction
        open={showImageIntroduction}
        data={activeImage}
        onClose={handleCloseImageIntroduction}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onRemarkChange={handleRemarkChange}
      />
      <BeeImagePreview
        images={previewImages}
        open={previewOpen}
        index={previewIndex}
        onOpenChange={setPreviewOpen}
        onIndexChange={setPreviewIndex}
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
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteFolder}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FolderScrollArea;
