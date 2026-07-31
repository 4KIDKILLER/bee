import axios, { AxiosHeaders } from "axios";
import type {
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { AUTH_TOKEN_STORAGE_KEY } from "../permissions/constants";

interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
    rawResponse?: boolean;
    skipAuth?: boolean;
}

interface RequestErrorOptions {
    code?: ApiCodeType;
    data?: unknown;
    response?: AxiosResponse;
    status?: number;
}

class RequestError extends Error {
    code?: ApiCodeType;
    data?: unknown;
    response?: AxiosResponse;
    status?: number;

    constructor(message: string, options: RequestErrorOptions = {}) {
        super(message);
        this.name = "RequestError";
        this.code = options.code;
        this.data = options.data;
        this.response = options.response;
        this.status = options.status;
    }
}

const SUCCESS_CODES = new Set<ApiCodeType>([200]);
const DEFAULT_ERROR_MESSAGE = "请求失败，请稍后重试";
const RESPONSE_FORMAT_ERROR_MESSAGE = "接口响应格式异常";

const requestInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 15000,
});

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getStoredToken() {
    if (typeof window === "undefined") {
        return null;
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)?.trim();
    return token || null;
}

function getErrorMessage(data: unknown) {
    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (!isRecord(data)) {
        return undefined;
    }

    const message = data.message;
    return typeof message === "string" && message.trim() ? message : undefined;
}

function getApiCode(data: unknown) {
    if (!isRecord(data)) {
        return undefined;
    }

    const { code } = data;
    return typeof code === "number" ? code : undefined;
}

function isApiResponse<T = unknown>(data: unknown): data is ApiResponseType<T> {
    return (
        isRecord(data) &&
        typeof data.code === "number" &&
        "data" in data &&
        typeof data.message === "string"
    );
}

function isApiSuccess(data: ApiResponseType) {
    return SUCCESS_CODES.has(data.code);
}

function showErrorToast(message: string) {
    toast.error(message || DEFAULT_ERROR_MESSAGE);
}

function normalizeError(error: unknown) {
    if (error instanceof RequestError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const status = error.response?.status;
        const code = getApiCode(responseData);
        const fallbackMessage = status
            ? `请求失败，状态码：${status}`
            : "网络异常，请检查网络连接";
        const message =
            getErrorMessage(responseData) ||
            fallbackMessage ||
            error.message ||
            DEFAULT_ERROR_MESSAGE;

        if (code === undefined || !SUCCESS_CODES.has(code)) {
            showErrorToast(message);
        }

        return new RequestError(message, {
            code,
            data: responseData,
            response: error.response,
            status,
        });
    }

    if (error instanceof Error && error.message) {
        return new RequestError(error.message);
    }

    return new RequestError(DEFAULT_ERROR_MESSAGE, { data: error });
}

requestInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const requestConfig = config as InternalAxiosRequestConfig & RequestConfig;
        const token = getStoredToken();

        if (token && !requestConfig.skipAuth) {
            const headers = AxiosHeaders.from(requestConfig.headers);

            if (!headers.has("Authorization")) {
                headers.set("Authorization", token);
            }

            requestConfig.headers = headers;
        }

        return requestConfig;
    },
);

requestInstance.interceptors.response.use(
    (response) => {
        const requestConfig = response.config as RequestConfig;

        if (requestConfig.rawResponse) {
            return response;
        }

        const { data } = response;

        if (!isApiResponse(data)) {
            return Promise.reject(
                new RequestError(RESPONSE_FORMAT_ERROR_MESSAGE, {
                    data,
                    response,
                    status: response.status,
                }),
            );
        }

        if (isApiSuccess(data)) {
            return data as never;
        }

        const message = getErrorMessage(data) || DEFAULT_ERROR_MESSAGE;
        showErrorToast(message);

        return Promise.reject(
            new RequestError(message, {
                code: data.code,
                data,
                response,
                status: response.status,
            }),
        );
    },
    (error) => Promise.reject(normalizeError(error)),
);

function request<T = unknown, D = unknown>(
    config: RequestConfig<D> & { rawResponse: true },
): Promise<AxiosResponse<ApiResponseType<T>>>;
function request<T = unknown, D = unknown>(
    config: RequestConfig<D>,
): Promise<ApiResponseType<T>>;
function request<T = unknown, D = unknown>(config: RequestConfig<D>) {
    return requestInstance.request<
        ApiResponseType<T>,
        ApiResponseType<T> | AxiosResponse<ApiResponseType<T>>,
        D
    >(config);
}

function get<T = unknown, P = unknown>(
    url: string,
    params?: P,
    config?: RequestConfig,
) {
    return request<T>({
        ...config,
        method: "GET",
        params,
        url,
    });
}

function post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>,
) {
    return request<T, D>({
        ...config,
        data,
        method: "POST",
        url,
    });
}

function put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>,
) {
    return request<T, D>({
        ...config,
        data,
        method: "PUT",
        url,
    });
}

function patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>,
) {
    return request<T, D>({
        ...config,
        data,
        method: "PATCH",
        url,
    });
}

function del<T = unknown, P = unknown>(
    url: string,
    params?: P,
    config?: RequestConfig,
) {
    return request<T>({
        ...config,
        method: "DELETE",
        params,
        url,
    });
}

export {
    RequestError,
    del as delete,
    get,
    patch,
    post,
    put,
    request,
    requestInstance,
};
export type { RequestConfig };

export default {
    delete: del,
    get,
    instance: requestInstance,
    patch,
    post,
    put,
    request,
};
