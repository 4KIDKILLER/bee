import type { ApiResponse } from "/@/library/request";

interface FileUploadParamsType {
    file: File
    parentId: string
}

interface FileListParamsType {
    page: number
    parentId: string
    pageSize: number
}

interface FileListDataType {
    id: number
    parentId: string
    fileId: string
    userId: number
    fileName: string
    fileSize: number
    filePath: string
    fileType: number
    fileExt: string
    updateTime: string
    createTime: string
    type: number
    status: number
}

type FileUploadResponseType = ApiResponse<null>
type FileListResponseType = ApiResponse<FileListDataType[]>

export type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    FileUploadParamsType,
    FileUploadResponseType
}