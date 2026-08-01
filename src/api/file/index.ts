import type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
    FileUploadResponseType
} from "../types/file";
import request from "/@/library/request";

interface FileApiType {
    getFileListApi: (params: FileListParamsType, signal?: AbortSignal) => Promise<FileListResponseType>
    uploadFileApi: (params: FormData, onUploadProgress: OnUploadProgressType) => Promise<FileUploadResponseType>
}

const FileApi: FileApiType = {
    /**
     * @description 上传文件
     * @param params 
     * @returns 
     */
    uploadFileApi(params: FormData, onUploadProgress: OnUploadProgressType): Promise<FileUploadResponseType> {
        return request.post<null, FormData>("/upload", params, { onUploadProgress })
    },
    /**
     * @description 获取文件列表
     * @param params 
     * @returns 
     */
    getFileListApi(params: FileListParamsType, signal?: AbortSignal): Promise<FileListResponseType> {
        return request.get<ApiDataListType<FileListDataType>, FileListParamsType>("/getFileList", params, { signal })
    }
}

export { FileApi };
export type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
    FileUploadResponseType
}
