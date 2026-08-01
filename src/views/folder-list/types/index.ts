import type { ReactNode } from "react";
import type { FileListDataType } from "/@/api/file"

export type BeeFileType = FileListDataType

export type UploadTaskStatus = "success" | "uploading" | "pending";
export type UploadFilterKey = UploadTaskStatus;

export interface UploadTaskItem {
  id: string;
  name: string;
  folderName: string;
  progress: number;
  status: UploadTaskStatus;
  size: string;
}

export type Task = Record<string, UploadTaskItem>

export type UploadTask = Record<UploadTaskStatus, Task>

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
  onUploadTrigger: () => void
  activeKey: UploadFilterKey
  items: UploadStatusMenuItem[]
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
  tasks: Task;
  emptyText: string;
  statusMap: Record<UploadTaskStatus, UploadTaskStatusConfig>;
}

export interface ImageItemProps {
  src: string;
  alt?: string;
}

export interface FileListPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface FolderScrollAreaProps {
  showUploadPanel: boolean;
  selection: boolean;
  selectedFolders: string[];
  openFolderId: string | null;
  page: number;
  limit: number;
  onSelectionToggle: () => void;
  onFolderCheckChange: (id: string) => void;
  onFolderOpenChange: (id: string, open: boolean) => void;
  onPaginationChange: (pagination: FileListPaginationMeta) => void;
}
