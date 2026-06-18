import { useState } from "react";
import { cn } from "/@/library/utils";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import FolderListPagination from "./components/folder-list-pagination";
import ViewModeSwitch from "./components/view-mode-switch";
import type { FolderListViewMode } from "./types";

function FolderList() {
  const [pageInfo, setPageInfo] = useState({
    limit: 50,
    total: 1500,
    page: 30,
  });
  const [selection, setSelection] = useState(false);
  const [viewMode, setViewMode] = useState<FolderListViewMode>("list");
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const showUploadPanel = viewMode === "upload";

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

  const handleFolderCheckChange = (id: number) => {
    setSelectedFolders((prev) =>
      prev.includes(id)
        ? prev.filter((folderId) => folderId !== id)
        : [...prev, id],
    );
  };

  const handleFolderOpenChange = (id: number, open: boolean) => {
    setOpenFolderId(open ? id : null);
  };

  const handlePageChange = (page: number) => {
    setPageInfo((prev) => {
      const totalPages = Math.max(1, Math.ceil(prev.total / prev.limit));

      return {
        ...prev,
        page: Math.min(Math.max(page, 1), totalPages),
      };
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[1300px] min-w-[1300px] mx-auto h-3/4 min-h-[600px] max-h-[700px]">
        <div className="flex flex-col h-full">
          <div className="h-[50px] flex w-full items-center bg-black/40 px-4 backdrop-blur-md rounded-tl-2xl rounded-tr-2xl border-t border-x border-white/20">
            <ViewModeSwitch value={viewMode} onChange={setViewMode} />
          </div>
          <div className="relative flex-1 overflow-hidden rounded-bl-2xl rounded-br-2xl border-b border-x border-white/20 bg-black/10 backdrop-blur-md shadow-lg">
            <FilePanel
              showUploadPanel={showUploadPanel}
              selection={selection}
              selectedFolders={selectedFolders}
              openFolderId={openFolderId}
              onSelectionToggle={handleSelectionToggle}
              onFolderCheckChange={handleFolderCheckChange}
              onFolderOpenChange={handleFolderOpenChange}
            />
            <UploadPanel showUploadPanel={showUploadPanel} />
          </div>
        </div>

        <div
          className={cn(
            viewMode === "list" ? "animate__fadeIn" : "animate__fadeOut",
            "animate__animated mt-2 px-4 flex w-full justify-between text-center",
          )}
        >
          <div className="flex items-center">
            <span className="text-white/70">/system/file/my-album</span>
          </div>
          <FolderListPagination
            page={pageInfo.page}
            limit={pageInfo.limit}
            total={pageInfo.total}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FolderList;
