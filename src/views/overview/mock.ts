import type { StorageDashboardData } from "./types";

const GB = 1024 ** 3;
const TB = 1024 ** 4;

export const storageDashboardData: StorageDashboardData = {
  totalBytes: 2.5 * TB,
  usedBytes: 1632 * GB,
  availableBytes: 928 * GB,
  updatedAt: "今天 08:42",
  fileTypes: [
    {
      key: "image",
      label: "图片",
      count: 48210,
      usedBytes: 428 * GB,
    },
    {
      key: "video",
      label: "视频",
      count: 1260,
      usedBytes: 896 * GB,
    },
    {
      key: "document",
      label: "文档",
      count: 18240,
      usedBytes: 146 * GB,
    },
    {
      key: "audio",
      label: "音频",
      count: 3920,
      usedBytes: 98 * GB,
    },
    {
      key: "other",
      label: "其他",
      count: 5320,
      usedBytes: 64 * GB,
    },
  ],
};
