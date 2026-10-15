import { useCallback, useState, useEffect, useRef } from "react";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import {
  Sun,
  ArrowLeft,
  SquareMousePointer,
  SquareDashedMousePointer,
} from "lucide-react";
import { cn } from "/@/library/utils";
import { UserApi } from "/@/api/user";
import FolderListPagination from "./components/folder-list-pagination";
import ViewModeSwitch from "./components/view-mode-switch";
import { Button, BeeTootip } from "/@c/index";
import { useSystemStore } from "/@/store/system/useSystemStore";
import { AUTH_TOKEN_STORAGE_KEY } from "/@/permissions/constants";
import { rootPath } from "./folder-list.d";
import PrivateVerifyDialog, {
  type VerifyDataType,
  type PrivateVerifyDialogRef,
} from "./components/private-verify-dialog";

import type {
  BeeFileType,
  FileListPaginationMeta,
  FolderListViewMode,
} from "./types";

const INITIAL_PAGE_INFO = {
  page: 1,
  total: 0,
  limit: 32,
};

function FolderList() {
  const mode = useSystemStore((state) => state.mode);
  const updateModel = useSystemStore((state) => state.updateMode);

  const privateVerifyDialogRef = useRef<PrivateVerifyDialogRef>(null);
  const pendingPrivateModeRef = useRef(false);

  const [privateVerifyVisible, setPrivateVerifyVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState(INITIAL_PAGE_INFO);
  const [path, setPath] = useState<BeeFileType[]>([rootPath]);
  const [selection, setSelection] = useState(false);
  const [viewMode, setViewMode] = useState<FolderListViewMode>("list");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState("");
  const showUploadPanel = viewMode === "upload";
  const isGoBackDisabled = path.length <= 1 || showUploadPanel;
  const accessPath =
    path.length == 1
      ? "/"
      : `/${path
          .map((item) => item.originalName)
          .slice(1)
          .join("/")}`;

  const handleSelectionToggle = () => {
    setOpenFolderId(null);
    setSelection((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedFolders([]);
      }
      return next;
    });
  };

  const handleFolderCheckChange = (id: string) => {
    setSelectedFolders((prev) =>
      prev.includes(id)
        ? prev.filter((folderId) => folderId !== id)
        : [...prev, id],
    );
  };

  const handleFolderOpenChange = (id: string, open: boolean) => {
    setOpenFolderId(open ? id : null);
  };

  const handleOpenFolder = useCallback((folder: BeeFileType) => {
    setCurrentFolderId(folder.id);
    setOpenFolderId(null);
    setSelectedFolders([]);
    setPath((prev) => [...prev, folder]);
  }, []);

  const handlePaginationChange = useCallback(
    ({ page, pageSize, total }: FileListPaginationMeta) => {
      setPageInfo({
        page,
        total,
        limit: pageSize,
      });
    },
    [],
  );

  const handleBackToNormal = () => {
    UserApi.exitPrivateApi().then((result) => {
      //更新token
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.data.token);
      updateModel("default");
    });
  };

  const handleResetNavigation = useCallback(() => {
    setCurrentFolderId("");
    setPath([rootPath]);
    setOpenFolderId(null);
    setSelectedFolders([]);
    setSelection(false);
    setPageInfo((prev) => ({
      ...prev,
      page: 1,
      total: 0,
    }));
  }, []);

  /**
   * 翻页事件
   * @param page
   */
  const handlePageChange = (page: number) => {
    setPageInfo((prev) => {
      const totalPages = Math.max(1, Math.ceil(prev.total / prev.limit));

      return {
        ...prev,
        page: Math.min(Math.max(page, 1), totalPages),
      };
    });
  };

  const handleGoBack = useCallback(() => {
    if (isGoBackDisabled) {
      return;
    }

    const nextPath = path.slice(0, -1);
    const parentFolder = nextPath.at(-1);

    setPath(nextPath);
    setCurrentFolderId(parentFolder?.id ?? "");
    setOpenFolderId(null);
    setSelectedFolders([]);
    setPageInfo((prev) => ({
      ...prev,
      page: 1,
      total: 0,
    }));
  }, [isGoBackDisabled, path]);

  const handlePrivateVerify = useCallback((data: VerifyDataType) => {
    UserApi.privateApi(data).then((result) => {
      //更新token
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.data.token);
      pendingPrivateModeRef.current = true;
      setPrivateVerifyVisible(false);
      privateVerifyDialogRef.current?.resetFields();
    });
  }, []);

  const handlePrivateVerifyAfterClose = useCallback(() => {
    if (!pendingPrivateModeRef.current) {
      return;
    }

    pendingPrivateModeRef.current = false;
    updateModel("private");
  }, [updateModel]);

  const handlePrivateVerifyClose = useCallback(() => {
    pendingPrivateModeRef.current = false;
    setPrivateVerifyVisible(false);
  }, []);

  /**
   * 注册全局键盘事件
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "b" &&
        location.pathname === "/home"
      ) {
        event.preventDefault();
        event.stopPropagation();

        if (
          event.repeat ||
          privateVerifyVisible ||
          mode == "private" ||
          viewMode != "list"
        ) {
          return;
        }

        setPrivateVerifyVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [mode, viewMode, updateModel, privateVerifyVisible]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[1300px] min-w-[1300px] mx-auto h-[700px] shadow-xl">
        <div className="flex flex-col h-full">
          <div className="h-[50px] flex w-full justify-between items-center bg-black/40 px-4 backdrop-blur-sm rounded-tl-2xl rounded-tr-2xl border-t border-x border-white/20">
            <ViewModeSwitch value={viewMode} onChange={setViewMode} />
            <div className="flex gap-4 items-center">
              <span onClick={handleSelectionToggle} className="cursor-pointer">
                {selection ? (
                  <SquareMousePointer
                    size={22}
                    className="text-(--theme-color)"
                  />
                ) : (
                  <SquareDashedMousePointer
                    size={22}
                    className="text-white/20 hover:text-white"
                  />
                )}
              </span>
              {mode == "private" ? (
                <span
                  onClick={handleBackToNormal}
                  className="w-[22px] h-[22px] active:text-(--theme-color) text-white/20 transition-all duration-500 ease-out hover:rotate-[360deg] hover:text-white cursor-pointer"
                >
                  <Sun size={22} />
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden backdrop-blur-[2px] rounded-bl-2xl rounded-br-2xl border-b border-x border-white/20 shadow-lg bg-black/20">
            <div className="relative h-full w-full">
              <FilePanel
                page={pageInfo.page}
                selection={selection}
                limit={pageInfo.limit}
                setViewMode={setViewMode}
                openFolderId={openFolderId}
                onOpenFolder={handleOpenFolder}
                currentFolderId={currentFolderId}
                showUploadPanel={showUploadPanel}
                selectedFolders={selectedFolders}
                onResetNavigation={handleResetNavigation}
                onPaginationChange={handlePaginationChange}
                onFolderOpenChange={handleFolderOpenChange}
                onFolderCheckChange={handleFolderCheckChange}
              />
              <UploadPanel
                currentFolderId={currentFolderId}
                showUploadPanel={showUploadPanel}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-full justify-between px-4 text-center">
          <div className="flex shadow-xl items-center pl-[6px] pr-[16px] py-[4px] rounded-full bg-black/40 px-4 backdrop-blur-sm border border-white/20">
            <BeeTootip side="left" content="返回上一级">
              <Button
                size="icon"
                aria-label="返回上一级"
                onClick={handleGoBack}
                disabled={isGoBackDisabled}
                className="rounded-full size-8 text-white/65 hover:border-(--theme-color) bg-transparent hover:bg-(--theme-color)/20 hover:text-(--theme-color) border-transparent"
              >
                <ArrowLeft />
              </Button>
            </BeeTootip>
            <span className="text-white/70 pl-2 text-8">{accessPath}</span>
          </div>
          {pageInfo.total === 0 ? (
            <></>
          ) : (
            <div
              className={cn(
                showUploadPanel ? "animate__fadeOut" : "animate__fadeIn",
                "animate__animated animate__faster rounded-full shadow-xl bg-black/40 px-[6px] backdrop-blur-sm flex items-center border border-white/20",
              )}
            >
              <FolderListPagination
                page={pageInfo.page}
                limit={pageInfo.limit}
                total={pageInfo.total}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <PrivateVerifyDialog
        open={privateVerifyVisible}
        ref={privateVerifyDialogRef}
        onSubmit={handlePrivateVerify}
        onClose={handlePrivateVerifyClose}
        onAfterClose={handlePrivateVerifyAfterClose}
      />
    </div>
  );
}

export default FolderList;
