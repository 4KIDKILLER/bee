type ApiCodeType = number;

interface ApiResponseType<T = unknown> {
    data: T
    message: string
    code: ApiCodeType
}

interface ApiDataListType<T = unknown> {
    list: T[]
    page: number
    total: number
    pageSize: number
}

interface ApiListResponseType<T = unknown> {
    message: string
    code: ApiCodeType
    data: ApiDataListType<T>
}

type ApiDefaultResponseType = ApiResponseType<null>