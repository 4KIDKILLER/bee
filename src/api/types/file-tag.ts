interface CreateTagParamsType {
    tagName: string,
    fileId: string
}

interface CreateTagDataType {
    id: string,
    tagName: string
}

type CreateTagResponseType = ApiResponseType<CreateTagDataType>

export type {
    CreateTagDataType,
    CreateTagParamsType,
    CreateTagResponseType
}