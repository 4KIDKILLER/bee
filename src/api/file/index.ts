import type {
    FileListDataType,
    FileListParamsType,
    FileUploadParamsType,
    FileListResponseType,
    FileUploadResponseType
} from "../types/file";
import request from "/@/library/request";

interface FileApiType {
    getFileList: (params: FileListParamsType) => Promise<FileListResponseType>
    uploadFileApi: (params: FileUploadParamsType) => Promise<FileUploadResponseType>
}

const FileApi: FileApiType = {
    /**
     * @description 上传文件
     * @param params 
     * @returns 
     */
    uploadFileApi(params: FileUploadParamsType): Promise<FileUploadResponseType> {
        return request.post<null, FileUploadParamsType>("/upload", params)
    },
    /**
     * @description 获取文件列表
     * @param params 
     * @returns 
     */
    getFileList(params: FileListParamsType): Promise<FileListResponseType> {
        return request.get<FileListDataType[], FileListParamsType>("/getFileList", params)
    }
}

export { FileApi };
