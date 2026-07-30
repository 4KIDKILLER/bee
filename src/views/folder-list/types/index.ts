import type { ReactNode } from "react";

export interface BeeFileType {
  id: string
  parentId: string
  userId: number
  name: string
  size: number
  path: string
  type: 1 | 2
  tags: string[]
  covers: string[]
  remark: string
  createTime: string
  updateTime: string
}

export type UploadTaskStatus = "success" | "uploading" | "pending";
export type UploadFilterKey = UploadTaskStatus;

export interface UploadTask {
  id: number;
  name: string;
  folderName: string;
  progress: number;
  status: UploadTaskStatus;
  size: string;
}

export type FolderListViewMode = "list" | "upload";

export interface ViewModeSwitchProps {
  value: FolderListViewMode;
  onChange: (value: FolderListViewMode) => void;
}

export interface FolderListPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  controlClassName?: string;
  ellipsisClassName?: string;
}

export interface UploadPanelProps {
  showUploadPanel: boolean;
}

export interface UploadStatusMenuItem {
  key: UploadFilterKey;
  label: string;
  count: number;
  activeClass: string;
  hoverClass: string;
}

export interface UploadStatusMenuProps {
  items: UploadStatusMenuItem[];
  activeKey: UploadFilterKey;
  onChange: (key: UploadFilterKey) => void;
}

export interface UploadTaskStatusConfig {
  label: string;
  textClass: string;
  barClass: string;
  badgeClass: string;
  listClass: string;
  icon: ReactNode;
}

export interface UploadTaskListProps {
  title: string;
  tasks: UploadTask[];
  emptyText: string;
  statusMap: Record<UploadTaskStatus, UploadTaskStatusConfig>;
}

export interface ImageItemProps {
  src: string;
  alt?: string;
}

export interface FolderScrollAreaProps {
  showUploadPanel: boolean;
  selection: boolean;
  selectedFolders: string[];
  openFolderId: string | null;
  onSelectionToggle: () => void;
  onFolderCheckChange: (id: string) => void;
  onFolderOpenChange: (id: string, open: boolean) => void;
}
