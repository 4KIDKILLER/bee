import request from "/@/library/request";

import type { CreateTagParamsType } from "../types/file-tag"

interface FileApiType {
    createTagApi: (params: CreateTagParamsType) => Promise<ApiDefaultResponseType>
}

const FileTagApi: FileApiType = {
    /**
     * @description 创建标签
     * @param params 
     * @returns 
     */
    createTagApi(params: CreateTagParamsType): Promise<ApiDefaultResponseType> {
        return request.post<null, CreateTagParamsType>("/createTarget", params)
    },
}

export { FileTagApi };
