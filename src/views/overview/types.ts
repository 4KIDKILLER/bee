export type StorageFileTypeKey = "image" | "video" | "document" | "audio" | "other";

export interface StorageFileTypeStat {
  key: StorageFileTypeKey;
  label: string;
  count: number;
  usedBytes: number;
}

export interface StorageDashboardData {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  updatedAt: string;
  fileTypes: StorageFileTypeStat[];
}
