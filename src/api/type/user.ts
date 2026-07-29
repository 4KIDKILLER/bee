import type { ApiResponse } from "/@/library/request";

interface LoginParamsType {
    username: string;
    password: string;
}

interface LoginDataType {
    avatar: string;
    token: string;
    username: string;
}

type LoginResponseType = ApiResponse<LoginDataType>


export type { LoginDataType, LoginParamsType, LoginResponseType };
