import { useMemo } from "react";
import { Progress, ScrollArea } from "/@c/index";
import {
  Clock3,
  Database,
  FileAudio2,
  FileText,
  Files,
  HardDrive,
  ImageIcon,
  Video,
} from "lucide-react";
import FileTypeDistribution from "./components/file-type-distribution";
import StorageCapacityPanel from "./components/storage-capacity-panel";
import StorageSummaryCard from "./components/storage-summary-card";
import { storageDashboardData } from "./mock";
import type { StorageFileTypeKey } from "./types";

const typeMetaMap: Record<
  StorageFileTypeKey,
  {
    icon: typeof ImageIcon;
    className: string;
  }
> = {
  image: {
    icon: ImageIcon,
    className: "bg-sky-400/15 text-sky-200",
  },
  video: {
    icon: Video,
    className: "bg-violet-400/15 text-violet-200",
  },
  document: {
    icon: FileText,
    className: "bg-emerald-400/15 text-emerald-200",
  },
  audio: {
    icon: FileAudio2,
    className: "bg-amber-400/15 text-amber-200",
  },
  other: {
    icon: Files,
    className: "bg-slate-300/12 text-slate-200",
  },
};

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const fixed = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(fixed)} ${units[index]}`;
}

function formatCount(count: number) {
  return count.toLocaleString("zh-CN");
}

function Overview() {
  const totalFiles = useMemo(
    () =>
      storageDashboardData.fileTypes.reduce((sum, item) => sum + item.count, 0),
    [],
  );

  const usedPercent = useMemo(
    () =>
      Math.round(
        (storageDashboardData.usedBytes / storageDashboardData.totalBytes) *
          100,
      ),
    [],
  );

  const availablePercent = 100 - usedPercent;

  const fileTypes = useMemo(
    () =>
      storageDashboardData.fileTypes.map((item) => ({
        ...item,
        formattedSize: formatBytes(item.usedBytes),
        formattedCount: formatCount(item.count),
        percent: Math.round(
          (item.usedBytes / storageDashboardData.usedBytes) * 100,
        ),
      })),
    [],
  );

  const totalSpace = formatBytes(storageDashboardData.totalBytes);
  const usedSpace = formatBytes(storageDashboardData.usedBytes);
  const availableSpace = formatBytes(storageDashboardData.availableBytes);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative mx-auto min-w-[1300px] w-[1300px] overflow-hidden rounded-2xl border border-white/20 bg-black/10 shadow-lg backdrop-blur-md h-[700px]">
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between gap-6 border-b border-white/10 bg-black/40 px-4 backdrop-blur-md h-[50px]">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="size-4 text-(--theme-color)" />
              <span className="text-white">存储总览</span>
            </div>

            <div className="flex gap-2 items-center rounded-2xl border-white/10">
              <div className="flex items-center justify-end gap-2 text-sm font-medium text-white/85">
                <Clock3 className="size-4 text-(--theme-color)" />
                最近同步
              </div>
              <div className="text-sm text-white/50">
                数据更新时间：{storageDashboardData.updatedAt}
              </div>
            </div>
          </header>

          <ScrollArea className="min-h-0 flex-1 bg-black/10">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <StorageSummaryCard
                  icon={<Files className="size-4" />}
                  title="文件总览"
                  value={formatCount(totalFiles)}
                  description="汇总当前存储中的文件数量，并按内容类型进行快速识别。"
                  footer={
                    <div className="grid grid-cols-2 gap-2">
                      {fileTypes.slice(0, 4).map((item) => {
                        const meta = typeMetaMap[item.key];
                        const Icon = meta.icon;

                        return (
                          <div
                            key={item.key}
                            className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2"
                          >
                            <div className="flex items-center gap-2 text-sm text-white/85">
                              <span
                                className={`flex size-8 items-center justify-center rounded-lg ${meta.className}`}
                              >
                                <Icon className="size-3.5" />
                              </span>
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-white/45">
                                  {item.formattedCount} 个
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                />

                <StorageSummaryCard
                  icon={<HardDrive className="size-4" />}
                  title="已用空间"
                  value={usedSpace}
                  description={`已占用总容量的 ${usedPercent}%，当前主要被视频与图片内容消耗。`}
                  footer={
                    <div>
                      <Progress
                        value={usedPercent}
                        className="h-2.5 bg-white/10"
                        indicatorClassName="bg-(--theme-color)"
                      />
                      <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                        <span>已使用 {usedPercent}%</span>
                        <span>总容量 {totalSpace}</span>
                      </div>
                    </div>
                  }
                />

                <StorageSummaryCard
                  icon={<Database className="size-4" />}
                  title="剩余空间"
                  value={availableSpace}
                  description={
                    usedPercent >= 80
                      ? "剩余空间较少，建议优先清理大体积文件或归档历史内容。"
                      : "当前可用充足，仍可继续保存新的图片、视频与文档内容。"
                  }
                  footer={
                    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-white/50">可用占比</span>
                        <span className="font-medium text-white/90">
                          {availablePercent}%
                        </span>
                      </div>
                      <div className="mt-2 text-xs leading-5 text-white/45">
                        建议持续关注大文件类型增长趋势，避免接近容量上限时影响后续存储。
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-4">
                <FileTypeDistribution fileTypes={fileTypes} />
                <StorageCapacityPanel
                  totalSpace={totalSpace}
                  usedSpace={usedSpace}
                  availableSpace={availableSpace}
                  usedPercent={usedPercent}
                  availablePercent={availablePercent}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default Overview;
