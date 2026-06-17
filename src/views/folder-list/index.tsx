import { useState } from "react";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import ViewModeSwitch from "./components/view-mode-switch";
import type { FolderListViewMode } from "./types";

function FolderList() {
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

        <div className="w-full flex justify-between items-center mt-2 rounded-full px-4 h-[30px]">
          <span className="text-white text-">路径: /file/image/my-album</span>

          <div className="page"></div>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
