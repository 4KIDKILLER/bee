import type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
    CreateFolderParamsType
} from "../types/file";
import request from "/@/library/request";

interface FileApiType {
    createFolderApi: (params: CreateFolderParamsType) => Promise<ApiDefaultResponseType>
    getFileListApi: (params: FileListParamsType) => Promise<FileListResponseType>
    uploadFileApi: (params: FormData, onUploadProgress: OnUploadProgressType) => Promise<ApiDefaultResponseType>
}

const FileApi: FileApiType = {
    /**
     * @description 上传文件
     * @param params 
     * @returns 
     */
    uploadFileApi(params: FormData, onUploadProgress: OnUploadProgressType): Promise<ApiDefaultResponseType> {
        return request.post<null, FormData>("/upload", params, { onUploadProgress })
    },
    /**
     * @description 获取文件列表
     * @param params 
     * @returns 
     */
    getFileListApi(params: FileListParamsType): Promise<FileListResponseType> {
        return request.get<ApiDataListType<FileListDataType>, FileListParamsType>("/getFileList", params)
    },
    /**
     * @description 创建文件夹
     * @param params 
     * @returns 
     */
    createFolderApi(params: CreateFolderParamsType): Promise<ApiDefaultResponseType> {
        return request.post<null, CreateFolderParamsType>("/createFolder", params)
    }
}

export { FileApi };
export type {
    FileListDataType,
    FileListParamsType,
    FileListResponseType,
    OnUploadProgressType,
}
