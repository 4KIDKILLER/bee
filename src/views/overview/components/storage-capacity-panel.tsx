import { Progress, Separator } from "/@c/index";
import { HardDrive, ShieldCheck, TriangleAlert } from "lucide-react";

interface StorageCapacityPanelProps {
  totalSpace: string;
  usedSpace: string;
  availableSpace: string;
  usedPercent: number;
  availablePercent: number;
}

function StorageCapacityPanel({
  totalSpace,
  usedSpace,
  availableSpace,
  usedPercent,
  availablePercent,
}: StorageCapacityPanelProps) {
  const isWarning = usedPercent >= 80;

  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white/85">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-(--theme-color)">
            <HardDrive className="size-4" />
          </span>
          <div>
            <div>存储容量详情</div>
            <p className="mt-1 text-xs font-normal text-white/50">
              直观查看总容量、已用容量与剩余可用空间
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
            isWarning
              ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          }`}
        >
          {isWarning ? <TriangleAlert className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
          {isWarning ? "接近上限" : "空间健康"}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm text-white/50">剩余可用空间</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white/90">
              {availableSpace}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/50">可用占比</div>
            <div className="mt-2 text-xl font-semibold text-white/90">
              {availablePercent}%
            </div>
          </div>
        </div>

        <Progress
          value={usedPercent}
          className="mt-5 h-2.5 bg-white/10"
          indicatorClassName="bg-(--theme-color)"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-white/45">
          <span>已用 {usedPercent}%</span>
          <span>总容量 {totalSpace}</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">总容量</span>
          <span className="font-medium text-white/90">{totalSpace}</span>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">已用空间</span>
          <span className="font-medium text-white/90">{usedSpace}</span>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">剩余空间</span>
          <span className="font-medium text-white/90">{availableSpace}</span>
        </div>
      </div>
    </section>
  );
}

export default StorageCapacityPanel;
