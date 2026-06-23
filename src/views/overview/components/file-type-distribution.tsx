import { Progress } from "/@c/index";
import {
  FileAudio2,
  FileText,
  Files,
  ImageIcon,
  Video,
} from "lucide-react";
import type { StorageFileTypeStat, StorageFileTypeKey } from "../types";

interface FileTypeDistributionProps {
  fileTypes: Array<
    StorageFileTypeStat & {
      formattedSize: string;
      formattedCount: string;
      percent: number;
    }
  >;
}

const metaMap: Record<
  StorageFileTypeKey,
  {
    icon: typeof ImageIcon;
    iconClassName: string;
    indicatorClassName: string;
  }
> = {
  image: {
    icon: ImageIcon,
    iconClassName: "bg-sky-400/15 text-sky-200",
    indicatorClassName: "bg-sky-400",
  },
  video: {
    icon: Video,
    iconClassName: "bg-violet-400/15 text-violet-200",
    indicatorClassName: "bg-violet-400",
  },
  document: {
    icon: FileText,
    iconClassName: "bg-emerald-400/15 text-emerald-200",
    indicatorClassName: "bg-emerald-400",
  },
  audio: {
    icon: FileAudio2,
    iconClassName: "bg-amber-400/15 text-amber-200",
    indicatorClassName: "bg-amber-400",
  },
  other: {
    icon: Files,
    iconClassName: "bg-slate-300/12 text-slate-200",
    indicatorClassName: "bg-slate-300",
  },
};

function FileTypeDistribution({ fileTypes }: FileTypeDistributionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm font-medium text-white/85">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-(--theme-color)">
          <Files className="size-4" />
        </span>
        <div>
          <div>文件类型分布</div>
          <p className="mt-1 text-xs font-normal text-white/50">
            通过文字与 icon 快速查看不同内容类型的数量与存储占比
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {fileTypes.map((item) => {
          const meta = metaMap[item.key];
          const Icon = meta.icon;

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-white/10 bg-black/35 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${meta.iconClassName}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white/90">{item.label}</div>
                    <div className="mt-1 text-xs text-white/45">
                      {item.formattedCount} 个文件
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-white/90">{item.formattedSize}</div>
                  <div className="mt-1 text-xs text-white/45">占已用空间 {item.percent}%</div>
                </div>
              </div>

              <Progress
                value={item.percent}
                className="mt-4 h-2 bg-white/10"
                indicatorClassName={meta.indicatorClassName}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FileTypeDistribution;
