import type { AxiosProgressEvent } from "axios"

interface FileListParamsType {
    page: number
    parentId: string
    pageSize: number
}

interface FileListDataType {
    id: string
    parentId: string
    userId: number
    name: string
    originalName: string
    size: number
    type: 1 | 2
    src: string
    tags: string[]
    covers: string[]
    remark: string
    createTime: string
    updateTime: string
}

type OnUploadProgressType = (e: AxiosProgressEvent) => void

type FileUploadResponseType = ApiResponseType<null>
type FileListResponseType = ApiListResponseType<FileListDataType>

export type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
    FileUploadResponseType,
}