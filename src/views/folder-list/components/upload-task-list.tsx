import { Progress, ScrollArea } from "/@c/index";
import type { UploadTaskListProps } from "../types";

function UploadTaskList({
  title,
  tasks,
  emptyText,
  statusMap,
}: UploadTaskListProps) {
  const tasksKeys = Object.keys(tasks);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 px-4 pt-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white/90">{title}</div>
          <p className="mt-1 text-xs text-white/45">
            当前分类共 {tasksKeys.length} 个任务
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full w-full px-4">
          {tasksKeys.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 text-sm text-white/40">
              {emptyText}
            </div>
          ) : (
            tasksKeys.map((taskId) => {
              const task = tasks[taskId];
              const status = statusMap[task.status];
              const showProgress = task.status !== "error";

              return (
                <div
                  key={task.id}
                  className={`mb-3 rounded-2xl border border-white/10 p-4 backdrop-blur-sm ${status.listClass}`}
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
                  {task.errorReason ? (
                    <div className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs leading-relaxed text-red-100">
                      {task.errorReason}
                    </div>
                  ) : null}

                  {showProgress ? (
                    <>
                      <Progress
                        value={task.progress}
                        className="h-2 bg-white/10"
                        indicatorClassName={status.barClass}
                      />

                      <div className="mt-2 flex items-center justify-between text-xs text-white/45">
                        <span>进度</span>
                        <span>{task.progress}%</span>
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default UploadTaskList;
