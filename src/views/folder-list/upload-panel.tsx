import { useMemo, useState, useRef, useCallback } from "react";
import { Spinner } from "/@c/index";
import { CheckCircle2, Clock3, Upload } from "lucide-react";
import UploadStatusMenu from "./components/upload-status-menu";
import UploadTaskList from "./components/upload-task-list";
import type {
  UploadFilterKey,
  UploadPanelProps,
  UploadTask,
  UploadTaskStatus,
  UploadTaskStatusConfig,
} from "./types";
import { FileApi } from "/@/api/file";
import RequestPool from "/@/library/class/RequestPool";
import { formatFileSize } from "/@/library/utils";

// 上传中状态的最短展示时长，避免小文件上传过快导致进度条一闪而过
const MIN_UPLOAD_DISPLAY_DURATION = 3000;

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

function UploadPanel({ showUploadPanel, currentFolderId }: UploadPanelProps) {
  const [tasks, setTasks] = useState<UploadTask>({
    success: {},
    uploading: {},
    pending: {},
  });
  const [activeFilter, setActiveFilter] =
    useState<UploadFilterKey>("uploading");
  const requestPoolRef = useRef(new RequestPool(3));

  const counts = useMemo(
    () => ({
      uploading: Object.keys(tasks.uploading).length,
      success: Object.keys(tasks.success).length,
      pending: Object.keys(tasks.pending).length,
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
        hoverClass:
          "hover:border-sky-400/20 hover:bg-sky-400/10 hover:text-sky-200",
      },
      {
        key: "success" as const,
        label: "已完成",
        count: counts.success,
        activeClass: statusMap.success.badgeClass,
        hoverClass:
          "hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-200",
      },
      {
        key: "pending" as const,
        label: "等待中",
        count: counts.pending,
        activeClass: statusMap.pending.badgeClass,
        hoverClass:
          "hover:border-amber-400/20 hover:bg-amber-400/10 hover:text-amber-200",
      },
    ],
    [counts],
  );

  const filteredTasks = useMemo(
    () => tasks[activeFilter],
    [activeFilter, tasks],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const finishedCount = counts.success;
  const allCount = counts.pending + counts.success + counts.uploading;
  const currentMeta = filterMeta[activeFilter];
  const currentStatus = statusMap[activeFilter];

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const uploadTasks = Array.from(files).map((file) => {
        const taskId = crypto.randomUUID().replaceAll("-", "");

        return {
          file,
          taskId,
          task: {
            id: taskId,
            progress: 0,
            name: file.name,
            folderName: "当前目录",
            status: "pending" as const,
            size: formatFileSize(file.size),
          },
        };
      });

      setTasks((prev) => ({
        ...prev,
        pending: {
          ...prev.pending,
          ...Object.fromEntries(
            uploadTasks.map(({ taskId, task }) => [taskId, task]),
          ),
        },
      }));

      uploadTasks.forEach(({ file, taskId }) => {
        void requestPoolRef.current
          .add(() => {
            setTasks((prev) => {
              const task = prev.pending[taskId];
              if (!task) return prev;

              const pending = { ...prev.pending };
              delete pending[taskId];

              return {
                ...prev,
                pending,
                uploading: {
                  ...prev.uploading,
                  [taskId]: { ...task, status: "uploading" },
                },
              };
            });

            const requestData = new FormData();
            requestData.append("file", file);
            requestData.append("parentId", currentFolderId);

            const startedAt = performance.now();
            let actualProgress = 0;

            const updateDisplayedProgress = () => {
              const elapsed = performance.now() - startedAt;
              const timedProgress = Math.min(
                99,
                Math.floor((elapsed / MIN_UPLOAD_DISPLAY_DURATION) * 100),
              );
              const progress = Math.min(actualProgress, timedProgress);

              setTasks((prev) => {
                const task = prev.uploading[taskId];
                if (!task || task.progress === progress) return prev;

                return {
                  ...prev,
                  uploading: {
                    ...prev.uploading,
                    [taskId]: { ...task, progress },
                  },
                };
              });
            };

            const progressTimer = window.setInterval(
              updateDisplayedProgress,
              100,
            );

            return (
              FileApi.uploadFileApi(requestData, (progressEvent) => {
                actualProgress = progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded / progressEvent.total) * 100,
                    )
                  : Math.round((progressEvent.progress ?? 0) * 100);
                updateDisplayedProgress();
              })
                // 接口成功后检查展示时间；如果不足三秒，则等待剩余时间再完成任务
                .then(async (result) => {
                  actualProgress = 100;
                  const remainingDuration = Math.max(
                    0,
                    // 用配置的最短时长减去请求实际已经运行的时长
                    MIN_UPLOAD_DISPLAY_DURATION -
                      (performance.now() - startedAt),
                  );

                  if (remainingDuration > 0) {
                    await new Promise<void>((resolve) => {
                      window.setTimeout(resolve, remainingDuration);
                    });
                  }

                  return result;
                })
                .finally(() => {
                  window.clearInterval(progressTimer);
                })
            );
          })
          .then(() => {
            setTasks((prev) => {
              const task = prev.uploading[taskId];
              if (!task) return prev;

              const uploading = { ...prev.uploading };
              delete uploading[taskId];

              return {
                ...prev,
                uploading,
                success: {
                  ...prev.success,
                  [taskId]: { ...task, progress: 100, status: "success" },
                },
              };
            });
          })
          .catch(() => {
            setTasks((prev) => {
              const task = prev.uploading[taskId];
              if (!task) return prev;

              const uploading = { ...prev.uploading };
              // 从正在上传队列中删除失败任务，避免它继续显示为上传中
              delete uploading[taskId];

              return {
                ...prev,
                uploading,
                pending: {
                  ...prev.pending,
                  [taskId]: { ...task, progress: 0, status: "pending" },
                },
              };
            });
          });
      });

      e.target.value = "";
    },
    [currentFolderId],
  );

  return (
    <div
      className={`absolute inset-0 h-full w-full will-change-transform transition-transform duration-300 ease-in-out ${
        showUploadPanel ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <input
        type="file"
        multiple
        id="fileInput"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex h-full text-white w-full overflow-hidden border border-white/10">
        <UploadStatusMenu
          items={menuItems}
          activeKey={activeFilter}
          onChange={setActiveFilter}
          onUploadTrigger={handleUpload}
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
                  当前共有 {allCount} 个任务，已完成 {finishedCount} 个
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
