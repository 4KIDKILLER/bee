import type { StorageDashboardData } from "./types";

const GB = 1024 ** 3;
const TB = 1024 ** 4;
const totalBytes = 0.5 * TB;

const fileTypes: StorageDashboardData["fileTypes"] = [
  {
    key: "image",
    label: "图片",
    count: 1321,
    usedBytes: 18.4 * GB,
  },
  {
    key: "video",
    label: "视频",
    count: 68,
    usedBytes: 168.2 * GB,
  },
  {
    key: "document",
    label: "文档",
    count: 8,
    usedBytes: 1.1 * GB,
  },
  {
    key: "audio",
    label: "音频",
    count: 12,
    usedBytes: 0.03 * GB,
  },
  {
    key: "other",
    label: "其他",
    count: 31,
    usedBytes: 0.01 * GB,
  },
];

const usedBytes = fileTypes.reduce((sum, item) => sum + item.usedBytes, 0);
const availableBytes = totalBytes - usedBytes;

export const storageDashboardData: StorageDashboardData = {
  totalBytes,
  usedBytes,
  availableBytes,
  updatedAt: "今天 08:42",
  fileTypes,
};
