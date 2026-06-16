import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  BeeTootip,
  Field,
  FieldError,
  Input,
  FieldLabel,
  FieldGroup,
} from "/@c/index";
import { SquareMousePointer, SquareDashedMousePointer } from "lucide-react";
import FilePanel from "./file-panel";
import UploadPanel from "./upload-panel";
import ViewModeSwitch from "./view-mode-switch";
import type {
  CreateFolderDialogProps,
  FolderListFolder,
  FolderListViewMode,
  UploadTask,
} from "./types";

const CreateFolderDialog = ({ children }: CreateFolderDialogProps) => {
  const [fileName, setFileName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);

  // 验证函数
  const validateFolderName = (name: string): boolean => {
    // 检查是否为空
    if (!name.trim()) {
      return false;
    }

    // 检查长度
    if (name.length > 50) {
      return false;
    }

    // 检查非法字符（Windows 文件系统限制）
    const illegalChars = /[\\/:*?"<>|]/;
    if (illegalChars.test(name)) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 提交时验证
    if (!validateFolderName(fileName)) {
      setInvalid(true);
      return;
    }

    // 验证通过，执行创建文件夹逻辑
    console.log("创建文件夹:", fileName.trim());

    // 重置并关闭
    setFileName("");
    setInvalid(false);
    setOpen(false);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setFileName(nextValue);
    if (invalid) {
      setInvalid(!validateFolderName(nextValue));
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // 关闭时重置
      setFileName("");
      setInvalid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>创建文件夹</DialogTitle>
            <DialogDescription>
              在当前文件夹里创建一个专门用来存放图片的新文件夹
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mt-4">
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="folderName">
                文件夹名称
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                required
                id="folderName"
                name="folderName"
                value={fileName}
                onChange={handleFileNameChange}
                aria-invalid={invalid}
                placeholder="请输入文件夹名称"
              />
              <FieldError>
                请输入有效的文件夹名称，且不能包含 \\ / : * ? " &lt; &gt; |
              </FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit">确定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const fileName = ["手机图库", "壁纸", "截图"];

const uploadTasks: UploadTask[] = [
  {
    id: 1,
    name: "travel-cover.png",
    folderName: "手机图库",
    progress: 100,
    status: "success",
    size: "12.4 MB",
  },
  {
    id: 2,
    name: "wallpaper-4k.jpg",
    folderName: "壁纸",
    progress: 72,
    status: "uploading",
    size: "18.7 MB",
  },
  {
    id: 3,
    name: "meeting-shot.heic",
    folderName: "截图",
    progress: 26,
    status: "pending",
    size: "6.1 MB",
  },
];

// 每个文件夹最多展示 3 张图片
const folders: FolderListFolder[] = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  name: fileName[i],
  images: Array.from(
    { length: 3 },
    (_, j) => `https://picsum.photos/seed/folder-${i}-${j}/200/200`,
  ),
}));

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
            <div className="flex gap-2">
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
              folders={folders}
              selection={selection}
              selectedFolders={selectedFolders}
              openFolderId={openFolderId}
              onFolderCheckChange={handleFolderCheckChange}
              onFolderOpenChange={handleFolderOpenChange}
            />
            <UploadPanel
              showUploadPanel={showUploadPanel}
              tasks={uploadTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
