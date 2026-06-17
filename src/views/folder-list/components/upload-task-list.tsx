import { Progress } from "/@c/index";
import type { UploadTaskListProps } from "../types";

function UploadTaskList({
  title,
  tasks,
  emptyText,
  statusMap,
}: UploadTaskListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white/90">{title}</div>
          <p className="mt-1 text-xs text-white/45">当前分类共 {tasks.length} 个任务</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 text-sm text-white/40">
            {emptyText}
          </div>
        ) : (
          tasks.map((task) => {
            const status = statusMap[task.status];
            return (
              <div
                key={task.id}
                className={`rounded-2xl border border-white/10 p-4 backdrop-blur-sm ${status.listClass}`}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-white/90">
                      {task.name}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
                      <span>{task.folderName}</span>
                      <span>•</span>
                      <span>{task.size}</span>
                    </div>
                  </div>
                  <div
                    className={`flex shrink-0 items-center gap-1.5 text-xs ${status.textClass}`}
                  >
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                <Progress
                  value={task.progress}
                  className="h-2 bg-white/10"
                  indicatorClassName={status.barClass}
                />

                <div className="mt-2 flex items-center justify-between text-xs text-white/45">
                  <span>进度</span>
                  <span>{task.progress}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UploadTaskList;
