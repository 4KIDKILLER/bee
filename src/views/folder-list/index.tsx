import { useState } from "react";
import { Button, BeeTootip } from "/@c/index";
import { SquareMousePointer, SquareDashedMousePointer } from "lucide-react";
import CreateFolderDialog from "./create-folder-dialog";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import ViewModeSwitch from "./view-mode-switch";
import type { FolderListViewMode } from "./types";

function FolderList() {
  const [selection, setSelection] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const viewMode: FolderListViewMode = showUploadPanel ? "upload" : "list";

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
      <div className="w-[1300px] min-w-[1300px] mx-auto h-3/4 min-h-[600px] max-h-[700px]">
        <div className="flex flex-col h-full">
          <div className="h-[50px] pl-[10px] pr-[10px] w-full flex gap-[10px] items-center justify-between bg-black/40 backdrop-blur-md rounded-tl-2xl rounded-tr-2xl border-t border-x border-white/20">
            <ViewModeSwitch
              value={viewMode}
              onChange={(mode) => setShowUploadPanel(mode === "upload")}
            />
            <div className="flex gap-2 animate__animated">
              <CreateFolderDialog>
                <Button size="sm">新建文件夹</Button>
              </CreateFolderDialog>
              <BeeTootip content={`选择${selection ? "已开启" : "已关闭"}`}>
                <Button size="sm" onClick={handleSelectionToggle}>
                  {selection ? (
                    <SquareMousePointer />
                  ) : (
                    <SquareDashedMousePointer />
                  )}
                </Button>
              </BeeTootip>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-bl-2xl rounded-br-2xl border-b border-x border-white/20 bg-black/10 backdrop-blur-md shadow-lg">
            <FilePanel
              showUploadPanel={showUploadPanel}
              selection={selection}
              selectedFolders={selectedFolders}
              openFolderId={openFolderId}
              onFolderCheckChange={handleFolderCheckChange}
              onFolderOpenChange={handleFolderOpenChange}
            />
            <UploadPanel showUploadPanel={showUploadPanel} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
