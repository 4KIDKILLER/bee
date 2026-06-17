import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "/@c/index";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
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

  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

  const handlePageChange = (page: number) => {
    setPageInfo((prev) => ({
      ...prev,
      page: Math.min(Math.max(page, 1), totalPages),
    }));
  };

  const visiblePageItems: Array<number | "ellipsis-left" | "ellipsis-right"> =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : (() => {
          const pages = new Set<number>([
            1,
            totalPages,
            pageInfo.page - 1,
            pageInfo.page,
            pageInfo.page + 1,
          ]);

          const normalizedPages = Array.from(pages)
            .filter((page) => page >= 1 && page <= totalPages)
            .sort((a, b) => a - b);

          const items: Array<number | "ellipsis-left" | "ellipsis-right"> = [];

          normalizedPages.forEach((page, index) => {
            const previousPage = normalizedPages[index - 1];

            if (previousPage && page - previousPage > 1) {
              items.push(previousPage === 1 ? "ellipsis-left" : "ellipsis-right");
            }

            items.push(page);
          });

          return items;
        })();

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

        <div className="mt-2 flex h-[30px] w-full items-center justify-between rounded-full px-4">
          <span className="text-white">路径: /file/image/my-album</span>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1 px-1.5 py-0.5 backdrop-blur-md">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text=""
                  size="icon-sm"
                  className="border-white/10 bg-transparent text-white/65 hover:border-(--theme-color)/30 hover:bg-(--theme-color)/10 hover:text-white"
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(pageInfo.page - 1);
                  }}
                />
              </PaginationItem>
              {visiblePageItems.map((item) =>
                typeof item === "number" ? (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      size="icon-sm"
                      isActive={pageInfo.page === item}
                      className={
                        pageInfo.page === item
                          ? "border-(--theme-color)/40 bg-(--theme-color)/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                          : "text-white/65 hover:border-(--theme-color)/30 hover:bg-(--theme-color)/10 hover:text-white"
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationEllipsis className="text-white/45" />
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text=""
                  size="icon-sm"
                  className="border-white/10 bg-transparent text-white/65 hover:border-(--theme-color)/30 hover:bg-(--theme-color)/10 hover:text-white"
                  onClick={(event) => {
                    event.preventDefault();
                    handlePageChange(pageInfo.page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
