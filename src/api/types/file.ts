import type { AxiosProgressEvent } from "axios"

interface FileListParamsType {
    page: number
    parentId: string
    pageSize: number
}
interface CreateFolderParamsType {
    // tags: string
    // cover1: string
    // cover2: string
    // cover3: string
    // remark: string
    parentId: string
    folderName: string
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

type FileListResponseType = ApiListResponseType<FileListDataType>

export type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
    CreateFolderParamsType
}