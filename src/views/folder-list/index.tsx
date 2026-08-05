import { useCallback, useState } from "react";
import { cn } from "/@/library/utils";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import { ArrowBigLeft } from "lucide-react";
import FolderListPagination from "./components/folder-list-pagination";
import ViewModeSwitch from "./components/view-mode-switch";
import { Button } from "/@c/index";
import { rootPath } from "./folder-list.d";
import type {
  BeeFileType,
  FileListPaginationMeta,
  FolderListViewMode,
} from "./types";

function FolderList() {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 0,
    limit: 50,
  });
  const [path, setPath] = useState<BeeFileType[]>([rootPath]);
  const [selection, setSelection] = useState(false);
  const [viewMode, setViewMode] = useState<FolderListViewMode>("list");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState("");
  const showUploadPanel = viewMode === "upload";
  const accessPath =
    path.length == 1 ? "/" : `/${path.map((item) => item.originalName).slice(1).join("/")}`;

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
    setPageInfo((prev) => ({
      ...prev,
      page: 1,
      total: 0,
    }));
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
    if(path.length > 1){
      setPath((prev)=> {
        prev.pop()
        return [...prev]
      })
      setCurrentFolderId(path[path.length - 1].id)
    }
  }, [path]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[1300px] min-w-[1300px] mx-auto h-[700px]">
        <div className="flex flex-col h-full">
          <div className="h-[50px] flex w-full items-center bg-black/40 px-4 backdrop-blur-md rounded-tl-2xl rounded-tr-2xl border-t border-x border-white/20">
            <ViewModeSwitch value={viewMode} onChange={setViewMode} />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-bl-2xl rounded-br-2xl border-b border-x border-white/20 shadow-lg backdrop-blur-md">
            <div className="relative h-full w-full bg-black/10">
              <FilePanel
                showUploadPanel={showUploadPanel}
                setViewMode={setViewMode}
                selection={selection}
                selectedFolders={selectedFolders}
                openFolderId={openFolderId}
                currentFolderId={currentFolderId}
                page={pageInfo.page}
                limit={pageInfo.limit}
                onSelectionToggle={handleSelectionToggle}
                onFolderCheckChange={handleFolderCheckChange}
                onFolderOpenChange={handleFolderOpenChange}
                onOpenFolder={handleOpenFolder}
                onPaginationChange={handlePaginationChange}
              />
              <UploadPanel showUploadPanel={showUploadPanel} />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-2 flex w-full justify-between px-4 text-center transition-opacity duration-200",
            viewMode === "list"
              ? "opacity-100 pointer-events-auto"
              : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex items-center">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="icon"
              className="rounded-full size-8 text-white/65 hover:border-(--theme-color) bg-transparent hover:bg-(--theme-color)/20 hover:text-(--theme-color) border-transparent"
            >
              <ArrowBigLeft />
            </Button>
            <span className="text-white/70 pl-2 text-8">{accessPath}</span>
          </div>
          {pageInfo.total === 0 ? (
            <></>
          ) : (
            <FolderListPagination
              page={pageInfo.page}
              limit={pageInfo.limit}
              total={pageInfo.total}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FolderList;
