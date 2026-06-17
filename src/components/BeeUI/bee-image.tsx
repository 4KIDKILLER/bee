import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImageUp,
  Info,
  RotateCcw,
  RotateCw,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "/@/library/utils";
import { Button } from "../ShadcnUI/button";
import { ButtonGroup } from "../ShadcnUI/button-group";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ShadcnUI/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ShadcnUI/dialog";

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const SCALE_STEP = 0.2;
const ROTATION_STEP = 90;

export interface BeeImageSource {
  src: string;
  alt?: string;
}

export type BeeImagePreviewItem = string | BeeImageSource;

export interface BeeImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> {
  src: string;
  width?: number | string;
  height?: number | string;
  fit?: React.CSSProperties["objectFit"];
  preview?: boolean;
  showContextMenu?: boolean;
  onViewDetail?: (src: string) => void;
  onSetAsCover?: (slot: 1 | 2 | 3, src: string) => void;
  onDelete?: (src: string) => void;
  onPreview?: (src: string) => void;
}

export interface BeeImagePreviewProps {
  images: BeeImagePreviewItem[];
  open?: boolean;
  defaultOpen?: boolean;
  initialIndex?: number;
  index?: number;
  onOpenChange?: (open: boolean) => void;
  onIndexChange?: (index: number) => void;
  onClose?: () => void;
}

interface PreviewViewportProps {
  image: BeeImageSource;
  currentIndex: number;
  total: number;
  hasMultiple: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function normalizeImageSource(image: BeeImagePreviewItem): BeeImageSource {
  return typeof image === "string" ? { src: image } : image;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return clamp(index, 0, length - 1);
}

function wrapIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return (index + length) % length;
}

function PreviewViewport({
  image,
  currentIndex,
  total,
  hasMultiple,
  onClose,
  onPrev,
  onNext,
}: PreviewViewportProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setScale((prev) => clamp(prev + SCALE_STEP, MIN_SCALE, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => clamp(prev - SCALE_STEP, MIN_SCALE, MAX_SCALE));
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - ROTATION_STEP);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + ROTATION_STEP);
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="关闭预览"
        className="absolute right-4 top-4 z-20 rounded-full bg-black/35 text-white hover:bg-white/10 hover:text-white"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        <X />
      </Button>

      {hasMultiple && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="上一张"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-white/10 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="下一张"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 text-white hover:bg-white/10 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight />
          </Button>
        </>
      )}

      <div
        className="flex h-full w-full items-center justify-center px-20 py-24"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt ?? `preview-${currentIndex + 1}`}
          className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
          style={{
            maxWidth: "calc(100vw - 10rem)",
            maxHeight: "calc(100vh - 12rem)",
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
          draggable={false}
        />
      </div>

      <div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple && (
          <div className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            {currentIndex + 1} / {total}
          </div>
        )}
        <ButtonGroup className="overflow-hidden rounded-full border border-white/10 bg-black/45 backdrop-blur-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="放大"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={handleZoomIn}
          >
            <ZoomIn />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="缩小"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={handleZoomOut}
          >
            <ZoomOut />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="向左旋转"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={handleRotateLeft}
          >
            <RotateCcw />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="向右旋转"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={handleRotateRight}
          >
            <RotateCw />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export function BeeImagePreview({
  images,
  open,
  defaultOpen = false,
  initialIndex = 0,
  index,
  onOpenChange,
  onIndexChange,
  onClose,
}: BeeImagePreviewProps) {
  const normalizedImages = useMemo(
    () => images.map(normalizeImageSource),
    [images],
  );
  const hasMultiple = normalizedImages.length > 1;
  const isOpenControlled = open !== undefined;
  const isIndexControlled = index !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalIndex, setInternalIndex] = useState(() =>
    clampIndex(initialIndex, normalizedImages.length),
  );

  const currentOpen = isOpenControlled ? open : internalOpen;
  const baseIndex = isIndexControlled ? index : internalIndex;
  const currentIndex = clampIndex(baseIndex, normalizedImages.length);
  const currentImage = normalizedImages[currentIndex];

  const setPreviewOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && !isIndexControlled) {
        setInternalIndex(clampIndex(initialIndex, normalizedImages.length));
      }

      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        onClose?.();
      }
    },
    [
      initialIndex,
      isIndexControlled,
      isOpenControlled,
      normalizedImages.length,
      onClose,
      onOpenChange,
    ],
  );

  const setCurrentIndex = useCallback(
    (nextIndex: number) => {
      const wrappedIndex = wrapIndex(nextIndex, normalizedImages.length);

      if (!isIndexControlled) {
        setInternalIndex(wrappedIndex);
      }

      onIndexChange?.(wrappedIndex);
    },
    [isIndexControlled, normalizedImages.length, onIndexChange],
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex(currentIndex - 1);
  }, [currentIndex, setCurrentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (!currentOpen || normalizedImages.length === 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }

      if (event.key === "ArrowLeft" && hasMultiple) {
        event.preventDefault();
        handlePrev();
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentOpen,
    hasMultiple,
    handleNext,
    handlePrev,
    normalizedImages.length,
    setPreviewOpen,
  ]);

  if (normalizedImages.length === 0 || !currentImage) {
    return null;
  }

  return (
    <Dialog open={currentOpen} onOpenChange={setPreviewOpen}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 left-0 top-0 z-50 h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-black/88 p-0 text-white shadow-none sm:max-w-none"
      >
        <DialogTitle className="sr-only">
          图片预览 {currentIndex + 1} / {normalizedImages.length}
        </DialogTitle>
        <DialogDescription className="sr-only">
          使用左右方向键切换图片，使用底部工具栏进行放大、缩小和旋转，按 Escape
          关闭预览。
        </DialogDescription>
        <PreviewViewport
          key={`${currentIndex}-${currentImage.src}`}
          image={currentImage}
          currentIndex={currentIndex}
          total={normalizedImages.length}
          hasMultiple={hasMultiple}
          onClose={() => setPreviewOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </DialogContent>
    </Dialog>
  );
}

export function BeeImage({
  src,
  alt,
  width,
  height,
  fit,
  preview = false,
  showContextMenu = false,
  onViewDetail,
  onSetAsCover,
  onDelete,
  onPreview,
  className,
  style,
  loading = "lazy",
  draggable = false,
  onClick,
  ...props
}: BeeImageProps) {
  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !preview) {
      return;
    }

    onPreview?.(src);
  };

  const imageNode = (
    <img
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading={loading}
      draggable={draggable}
      className={cn(preview && "cursor-zoom-in", className)}
      style={{
        width,
        height,
        objectFit: fit,
        ...style,
      }}
      onClick={handleImageClick}
      {...props}
    />
  );

  return showContextMenu ? (
    <BeeImageContextMenu
      src={src}
      onDelete={onDelete}
      onViewDetail={onViewDetail}
      onSetAsCover={onSetAsCover}
    >
      <span className="inline-flex max-w-full">{imageNode}</span>
    </BeeImageContextMenu>
  ) : (
    imageNode
  );
}

export function BeeImageContextMenu({
  children,
  onViewDetail,
  onSetAsCover,
  onDelete,
  src,
}: {
  src: string
  children: React.ReactNode;
} & Partial<
  Pick<
    BeeImageProps,
    "onViewDetail" | "onSetAsCover" | "onDelete" | "onPreview"
  >
>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onViewDetail?.(src)}>
          <Info />
          详细信息
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onSetAsCover?.(1, src)}>
          <ImageUp />
          设置为封面1
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onSetAsCover?.(2, src)}>
          <ImageUp />
          设置为封面2
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onSetAsCover?.(3, src)}>
          <ImageUp />
          设置为封面3
        </ContextMenuItem>
        <ContextMenuItem variant="destructive" onClick={() => onDelete?.(src)}>
          <Trash2 />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
