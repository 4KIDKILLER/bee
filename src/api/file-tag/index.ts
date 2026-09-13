import request from "/@/library/request";

import type { CreateTagDataType, CreateTagParamsType, CreateTagResponseType } from "../types/file-tag"

interface FileApiType {
    createTagApi: (params: CreateTagParamsType) => Promise<CreateTagResponseType>
}

const FileTagApi: FileApiType = {
    /**
     * @description 创建标签
     * @param params 
     * @returns 
     */
    createTagApi(params: CreateTagParamsType): Promise<CreateTagResponseType> {
        return request.post<CreateTagDataType, CreateTagParamsType>("/createTarget", params)
    },
}

export { FileTagApi };
