import { memo } from "react";
import { Folder, Button, ButtonGroup } from "/@c/index";
import { Menu } from "lucide-react";

interface ImageItemProps {
  src: string;
  alt?: string;
}

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

// 每个文件夹最多展示 3 张图片
const folders: { id: number; images: string[] }[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: i,
    images: Array.from(
      { length: 3 },
      (_, j) => `https://picsum.photos/seed/folder-${i}-${j}/200/200`,
    ),
  }),
);

function FolderList() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[1300px] mx-auto h-5/7 min-h-[600px]">
        <div className="flex flex-col h-full">
          <div className="h-[50px] pl-[16px] pr-[16px] w-full flex gap-[10px] items-center justify-between">
            <ButtonGroup>
              <ButtonGroup className="hidden sm:flex">
                <Button size="sm" aria-label="Go Back">
                  <Menu />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size="sm">Archive</Button>
                <Button size="sm">Report</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size="sm">Snooze</Button>
              </ButtonGroup>
            </ButtonGroup>

            <ButtonGroup>
              <ButtonGroup className="hidden sm:flex">
                <Button size="sm" aria-label="Go Back">
                  <Menu />
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button size="sm">Snooze</Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
          <div className="flex-1 grid grid-cols-6 grid-rows-4 rounded-3xl border border-white/20 bg-black/10 backdrop-blur-md shadow-lg">
            {folders.map(({ id, images }) => (
              <div key={id} className="flex justify-center items-center">
                <Folder
                  items={images.map((src, idx) => (
                    <ImageItem
                      key={idx}
                      src={src}
                      alt={`folder-${id}-img-${idx}`}
                    />
                  ))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderList;
