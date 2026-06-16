import { useMemo, useState } from "react";
import { Spinner } from "/@c/index";
import { CheckCircle2, Clock3, Upload } from "lucide-react";
import UploadStatusMenu from "./upload-status-menu";
import UploadTaskList from "./upload-task-list";
import type {
  UploadFilterKey,
  UploadPanelProps,
  UploadTask,
  UploadTaskStatus,
  UploadTaskStatusConfig,
} from "./types";

const statusMap: Record<UploadTaskStatus, UploadTaskStatusConfig> = {
  success: {
    label: "已完成",
    textClass: "text-emerald-300",
    barClass: "bg-emerald-400",
    badgeClass: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    listClass: "bg-emerald-400/10",
    icon: <CheckCircle2 className="size-4" />,
  },
  uploading: {
    label: "进行中",
    textClass: "text-sky-300",
    barClass: "bg-sky-400",
    badgeClass: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    listClass: "bg-sky-400/10",
    icon: <Spinner className="size-4" />,
  },
  pending: {
    label: "等待中",
    textClass: "text-amber-300",
    barClass: "bg-amber-400",
    badgeClass: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    listClass: "bg-amber-400/10",
    icon: <Clock3 className="size-4" />,
  },
};

const filterMeta: Record<
  UploadFilterKey,
  { label: string; emptyText: string }
> = {
  uploading: {
    label: "进行中",
    emptyText: "当前没有进行中的上传任务",
  },
  success: {
    label: "已完成",
    emptyText: "当前没有已完成的上传任务",
  },
  pending: {
    label: "等待中",
    emptyText: "当前没有等待中的上传任务",
  },
};

const initialUploadTasks: UploadTask[] = [
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

function UploadPanel({ showUploadPanel }: UploadPanelProps) {
  const [tasks] = useState<UploadTask[]>(initialUploadTasks);
  const [activeFilter, setActiveFilter] =
    useState<UploadFilterKey>("uploading");

  const counts = useMemo(
    () => ({
      uploading: tasks.filter((task) => task.status === "uploading").length,
      success: tasks.filter((task) => task.status === "success").length,
      pending: tasks.filter((task) => task.status === "pending").length,
    }),
    [tasks],
  );

  const menuItems = useMemo(
    () => [
      {
        key: "uploading" as const,
        label: "进行中",
        count: counts.uploading,
        activeClass: statusMap.uploading.badgeClass,
        hoverClass: "hover:border-sky-400/20 hover:bg-sky-400/10 hover:text-sky-200",
      },
      {
        key: "success" as const,
        label: "已完成",
        count: counts.success,
        activeClass: statusMap.success.badgeClass,
        hoverClass: "hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-200",
      },
      {
        key: "pending" as const,
        label: "等待中",
        count: counts.pending,
        activeClass: statusMap.pending.badgeClass,
        hoverClass: "hover:border-amber-400/20 hover:bg-amber-400/10 hover:text-amber-200",
      },
    ],
    [counts],
  );

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === activeFilter),
    [activeFilter, tasks],
  );

  const finishedCount = counts.success;
  const currentMeta = filterMeta[activeFilter];
  const currentStatus = statusMap[activeFilter];

  return (
    <div
      className={`absolute inset-0 h-full w-full transition-transform duration-300 ease-in-out ${
        showUploadPanel ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full text-white w-full overflow-hidden border border-white/10">
        <UploadStatusMenu
          items={menuItems}
          activeKey={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-base font-medium">
                  <Upload className="size-4 text-sky-300" />
                  上传队列
                </div>
                <p className="mt-1 text-sm text-white/50">
                  当前共有 {tasks.length} 个任务，已完成 {finishedCount} 个
                </p>
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-xs ${currentStatus.badgeClass}`}
              >
                {currentMeta.label}
              </div>
            </div>
          </div>

          <UploadTaskList
            title={currentMeta.label}
            tasks={filteredTasks}
            emptyText={currentMeta.emptyText}
            statusMap={statusMap}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
