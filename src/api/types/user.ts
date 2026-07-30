import type { ApiResponse } from "/@/library/request";

interface UserLoginParamsType {
    username: string;
    password: string;
}

interface UserLoginDataType {
    avatar: string;
    token: string;
    username: string;
}

type UserLoginResponseType = ApiResponse<UserLoginDataType>


export type { UserLoginDataType, UserLoginParamsType, UserLoginResponseType };
