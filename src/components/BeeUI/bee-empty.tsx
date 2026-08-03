import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
  EmptyMedia,
} from "../ShadcnUI/empty";
import { Button } from "../ShadcnUI/button";
import { Upload, RefreshCcw, FolderOpen } from "lucide-react";

export function BeeEmpty({
  onUpload,
  onRefresh,
}: {
  onUpload: () => void;
  onRefresh: () => void;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <FolderOpen size={50} className="text-white/80" />
        </EmptyMedia>
        <EmptyTitle className="text-[14px] text-white/80">
          当前文件夹下还没有任何内容
        </EmptyTitle>
        <EmptyDescription className="text-white/60">
          将文件上传至BEE，轻松管理你的图片
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button className="text-white/80 text-[12px]" size="sm" variant="link" onClick={onUpload}>
          <Upload />
          上传文件
        </Button>
        <Button className="text-white/80 text-[12px]" size="sm" variant="link" onClick={onRefresh}>
          <RefreshCcw />
          刷新
        </Button>
      </EmptyContent>
    </Empty>
  );
}
