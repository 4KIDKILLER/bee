import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  BeeEmpty,
  BeeFolder,
  BeeDeleteConfirm,
  BeeImagePreview,
  // BeeTootip,
  // BeeLoading,
  ScrollArea,
  type BeeCoverSlotType,
} from "/@c/index";
// SquareMousePointer, SquareDashedMousePointer
import FolderEditDialog, {
  type FolderEditDialogRef,
} from "./components/folder-edit-dialog";
import ImageEditDialog, {
  type ImageEditDialogRef,
} from "./components/image-edit-dialog";
import FolderIntroduction from "./components/folder-introduction";
import ImageIntroduction from "./components/image-introduction";
import BeeImageItem from "./components/image-item";
import type { BeeFileType, FolderScrollAreaProps } from "./types";
import { FileApi } from "/@/api/file";
import { FileTagApi } from "/@/api/file-tag";
// import { cn } from "/@/library/utils";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";

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
  //当前操作的文件夹/图片
  const [currentTarget, setCurrentTarget] = useState<BeeFileType | null>(null);
  //当前操作文件夹的类型 1:创建 2修改
  const [folderEditMode, setFolderEditMode] = useState<1 | 2>(1);
  const [folderDialogOpen, setFolderDialogOpen] = useState<boolean>(false);
  const [imageEditDialogOpen, setImageEditDialogOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<BeeFileType[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showFolderIntroduction, setShowFolderIntroduction] = useState(false);
  const [showImageIntroduction, setShowImageIntroduction] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const imageEditDialogRef = useRef<ImageEditDialogRef>(null);
  const folderEditDialogRef = useRef<FolderEditDialogRef>(null);
  const skipNextFetchKeyRef = useRef<string | null>(null);
  const activeFolder =
    dataList.find((folder) => folder.id === activeFolderId) ?? null;
  const activeImage =
    dataList.find(
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

  const handleAddTag = (fileId: string, tagName: string) => {
    const nextTag = tagName.trim();
    if (!nextTag) return;

    FileTagApi.createTagApi({
      tagName,
      fileId,
    }).then((res) => {
      toast.success("标签创建成功");

      setDataList((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? {
                ...item,
                tags: [...item.tags, { id: res.data.id, tagName }],
              }
            : item,
        ),
      );
    });
  };

  const handleRemoveTag = (id: string, tagId: string) => {
    setDataList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              tags: item.tags.filter((item) => item.id !== tagId),
            }
          : item,
      ),
    );
  };

  const handleRemarkChange = (id: string, remark: string) => {
    setDataList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              remark,
            }
          : item,
      ),
    );
  };

  const handlePreviewImage = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const handleDeleteTarget = useCallback((dataList: BeeFileType) => {
    setCurrentTarget(dataList);
    setShowDeleteConfirm(true);
  }, []);

  const handleSetAsCover = useCallback(
    (position: BeeCoverSlotType, cover: string) => {
      FileApi.setFolderCover({
        cover,
        position,
        id: currentFolderId,
      }).then((res) => {
        toast.success(res.message)
      });
    },
    [currentFolderId],
  );

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const getFileList = useCallback(
    (parentId: string, currentPage: number) => {
      setLoading(true);
      return FileApi.getFileListApi({
        page: currentPage,
        parentId,
        pageSize: limit,
      }).then((res) => {
        setDataList(res.data.list);
        onPaginationChange({
          page: res.data.page,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
        setLoading(false);
      });
    },
    [limit, onPaginationChange],
  );

  const onRefresh = useCallback(
    (isRefresh = false) => {
      void getFileList(currentFolderId, page)
        .then(() => {
          if (isRefresh) toast.success("刷新成功");
        })
        .catch(() => {});
    },
    [currentFolderId, getFileList, page],
  );

  const handleConfirmDelete = useCallback(() => {
    if (currentTarget) {
      FileApi.deleteSoftApi({
        id: currentTarget.id,
        type: currentTarget.type,
      }).then((res) => {
        toast.success(res.message);
        setShowDeleteConfirm(false);
        onRefresh(true);
      });
    }
  }, [onRefresh, currentTarget]);

  const editCallback = useCallback(
    (result: ApiDefaultResponseType) => {
      toast.success(result.message);
      setFolderDialogOpen(false);
      folderEditDialogRef.current?.resetForm();
      onRefresh();
    },
    [onRefresh],
  );

  const onFileRename = useCallback(
    (name: string) => {
      FileApi.updateNameApi({
        name: name,
        id: (currentTarget as BeeFileType).id,
        type: (currentTarget as BeeFileType).type,
      }).then(editCallback);
    },
    [editCallback, currentTarget],
  );

  const handleFolderEditConfirm = useCallback(
    async (folderName: string) => {
      if (folderEditMode == 1) {
        FileApi.createFolderApi({
          folderName,
          parentId: currentFolderId,
        }).then(editCallback);
      } else {
        onFileRename(folderName);
      }
    },
    [currentFolderId, folderEditMode, onFileRename, editCallback],
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

  const handleTargetRename = useCallback((dataList: BeeFileType) => {
    setCurrentTarget(dataList);
    if (dataList.type == 1) {
      folderEditDialogRef.current?.setFormData({
        folderName: dataList.originalName,
      });
      setFolderEditMode(2);
      setFolderDialogOpen(true);
    } else {
      imageEditDialogRef.current?.setFormData({
        imageName: dataList.originalName,
      });
      setImageEditDialogOpen(true);
    }
  }, []);

  const handleFolderChange = useCallback((mode: 1 | 2) => {
    folderEditDialogRef.current?.resetForm();
    setFolderEditMode(mode);
    setFolderDialogOpen(true);
  }, []);

  return (
    <div
      className={`absolute inset-0 h-full w-full will-change-transform transition-transform duration-300 ease-in-out ${
        showUploadPanel ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* <div
        className={cn(
          loading ? "block" : "hidden",
          "w-full h-full backdrop-blur-sm absolute left-0 top-0 bg-black/50 z-10",
        )}
      >
        <BeeLoading description="正在准备 BEE 文件列表" />
      </div> */}
      {dataList.length === 0 ? (
        !loading && (
          <div className="w-full h-full flex justify-center items-center">
            <BeeEmpty
              onUpload={toggleUploadPanel}
              onRefresh={() => onRefresh(true)}
            >
              {/* <FolderEditDialog onConfirm={onCreateFolder}> */}
              <Button
                size="sm"
                variant="link"
                onClick={() => handleFolderChange(1)}
                className="text-white/80 text-[12px]"
              >
                <FolderPlus />
                创建文件夹
              </Button>
              {/* </FolderEditDialog> */}
            </BeeEmpty>
          </div>
        )
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="flex w-full h-[32px] items-end justify-between px-4">
            <div className="flex items-center gap-2">
              {/* <FolderEditDialog onConfirm={onCreateFolder}> */}
              <span
                onClick={() => handleFolderChange(1)}
                className="cursor-pointer transition-colors text-[14px] text-white/20 hover:text-(--theme-color)/80"
              >
                新建文件夹
              </span>
              {/* </FolderEditDialog> */}
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
                onClick={() => onRefresh(true)}
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
            {dataList.map((folder) =>
              folder.type === 1 ? (
                <BeeFolder
                  key={folder.id}
                  folder={folder}
                  selection={selection}
                  isChecked={selectedFolders.includes(folder.id)}
                  isOpen={openFolderId === folder.id}
                  onRename={handleTargetRename}
                  onCheckChange={onFolderCheckChange}
                  onOpenChange={onFolderOpenChange}
                  onInfo={(item) => handleShowFolderIntroduction(item.id)}
                  onDelete={handleDeleteTarget}
                  onOpen={handleOpenFolder}
                />
              ) : (
                <BeeImageItem
                  file={folder}
                  key={folder.id}
                  onRename={handleTargetRename}
                  onDelete={handleDeleteTarget}
                  onSetAsCover={handleSetAsCover}
                  onPreview={(src: string) => handlePreviewImage([src], 0)}
                  onViewDetail={(item) => handleShowImageIntroduction(item.id)}
                />
              ),
            )}
          </div>
        </ScrollArea>
      )}
      {/* 删除文件/文件夹确认 */}
      <BeeDeleteConfirm
        open={showDeleteConfirm}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        name={currentTarget?.originalName}
      ></BeeDeleteConfirm>
      {/* 编辑文件夹信息 */}
      <FolderEditDialog
        ref={folderEditDialogRef}
        mode={folderEditMode}
        open={folderDialogOpen}
        onConfirm={handleFolderEditConfirm}
        onClose={() => setFolderDialogOpen(false)}
      ></FolderEditDialog>
      {/* 编辑信息图片 */}
      <ImageEditDialog
        ref={imageEditDialogRef}
        onConfirm={onFileRename}
        open={imageEditDialogOpen}
        onClose={() => setImageEditDialogOpen(false)}
      ></ImageEditDialog>
      {/* 文件夹详细信息 */}
      <FolderIntroduction
        open={showFolderIntroduction}
        folder={activeFolder}
        onClose={handleCloseFolderIntroduction}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onRemarkChange={handleRemarkChange}
      />
      {/* 图片详细信息 */}
      <ImageIntroduction
        open={showImageIntroduction}
        data={activeImage}
        onClose={handleCloseImageIntroduction}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onRemarkChange={handleRemarkChange}
      />
      {/* 图片预览 */}
      <BeeImagePreview
        images={previewImages}
        open={previewOpen}
        index={previewIndex}
        onOpenChange={setPreviewOpen}
        onIndexChange={setPreviewIndex}
      />
    </div>
  );
}

export default FolderScrollArea;
