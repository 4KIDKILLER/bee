import React, { memo, useState } from "react";
import {
  Folder,
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
  Input,
  FieldLabel,
  FieldGroup,
} from "/@c/index";
import {
  Menu,
  List,
  LayoutGrid,
  SquareMousePointer,
  SquareDashedMousePointer,
} from "lucide-react";
import { ScrollArea } from "/@c/index";

interface ImageItemProps {
  src: string;
  alt?: string;
}

interface CreateFolderDialogProps {
  children: React.ReactNode;
}

const CreateFolderDialog = ({ children }: CreateFolderDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>创建文件夹</DialogTitle>
          <DialogDescription>
            在当前文件夹里创建一个专门用来存放图片的新文件夹
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="folderName">
              文件夹名称
              <span className="text-destructive">*</span>
              </FieldLabel>
            <Input required id="folderName" name="folderName" placeholder="请输入文件夹名称" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button type="submit">确定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

const fileName = ["手机图库", "壁纸", "截图"];

// 每个文件夹最多展示 3 张图片
const folders: { id: number; name: string; images: string[] }[] = Array.from(
  { length: 3 },
  (_, i) => ({
    id: i,
    name: fileName[i],
    images: Array.from(
      { length: 3 },
      (_, j) => `https://picsum.photos/seed/folder-${i}-${j}/200/200`,
    ),
  }),
);

function FolderList() {
  const [isCard, setIsCard] = useState(true);
  const [selection, setSelection] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);

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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[1300px] min-w-[1300px] mx-auto h-3/4 min-h-[600px] max-h-[700px]">
        <div className="flex flex-col h-full">
          <div className="h-[50px] pl-[16px] pr-[16px] w-full flex gap-[10px] items-center justify-between bg-black/10 backdrop-blur-md rounded-tl-2xl rounded-tr-2xl border-t border-x border-white/20">
            <div className="flex items-center gap-2">
              <Button size="sm" aria-label="Go Back">
                <Menu />
              </Button>
              <CreateFolderDialog>
                <Button size="sm">新建文件夹</Button>
              </CreateFolderDialog>
            </div>
            <div className="flex items-center gap-2">
              <BeeTootip content={`选择${selection ? "已开启" : "已关闭"}`}>
                <Button size="sm" onClick={handleSelectionToggle}>
                  {selection ? (
                    <SquareMousePointer />
                  ) : (
                    <SquareDashedMousePointer />
                  )}
                </Button>
              </BeeTootip>
              <BeeTootip content={`${isCard ? "卡片视图" : "列表视图"}`}>
                <Button size="sm" onClick={() => setIsCard(!isCard)}>
                  {isCard ? <LayoutGrid /> : <List />}
                </Button>
              </BeeTootip>
            </div>
          </div>
          <ScrollArea className="flex-1 rounded-bl-2xl running-br-2xl border-b border-x border-white/20 bg-black/10 backdrop-blur-md shadow-lg">
            <div className="flex items-end px-[16px] h-[36px] w-full">
              <Button
                className="text-white/20 hover:text-white/80"
                size="sm"
                variant="link"
              >
                时间
              </Button>
              <Button
                className="text-white/20 hover:text-white/80"
                size="sm"
                variant="link"
              >
                大小
              </Button>
              <Button
                className="text-white/20 hover:text-white/80"
                size="sm"
                variant="link"
              >
                名称
              </Button>
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
                      onCheckChange={() => handleFolderCheckChange(id)}
                      onOpenChange={(open) => setOpenFolderId(open ? id : null)}
                      items={images.map((src, idx) => (
                        <ImageItem
                          key={idx}
                          src={src}
                          alt={`folder-${id}-img-${idx}`}
                        />
                      ))}
                    />
                    <div className="pt-[2px] text-purple-50 text-xs text-shadow-amber-100">
                      <span className="bg-black/35 py-[4px] px-[6px] rounded-md cursor-pointer hover:bg-(--theme-color) transition-colors">{name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
