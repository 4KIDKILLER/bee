import type {
    UserLoginDataType,
    UserLoginParamsType,
    UserLoginResponseType
} from "../types/user";
import request from "/@/library/request";

interface UserApiType {
    loginApi: (params: UserLoginParamsType) => Promise<UserLoginResponseType>;
}

const UserApi: UserApiType = {
    loginApi(params: UserLoginParamsType): Promise<UserLoginResponseType> {
        return request.post<UserLoginDataType, UserLoginParamsType>("/login", params, {
            skipAuth: true,
        });
    }
}

export { UserApi };
export type { UserLoginDataType, UserLoginParamsType, UserApiType };
