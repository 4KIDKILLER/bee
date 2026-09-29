import type {
    UserLoginDataType,
    UserLoginParamsType,
    UserLoginResponseType,
    UserPrivateLoginParamsType
} from "../types/user";
import request from "/@/library/request";

interface UserApiType {
    loginApi: (params: UserLoginParamsType) => Promise<UserLoginResponseType>;
    privateApi: (params: UserPrivateLoginParamsType) => Promise<UserLoginResponseType>
}

const UserApi: UserApiType = {
    loginApi(params: UserLoginParamsType): Promise<UserLoginResponseType> {
        return request.post<UserLoginDataType, UserLoginParamsType>("/login", params, {
            skipAuth: true,
        });
    },
    privateApi(params: UserPrivateLoginParamsType): Promise<UserLoginResponseType> {
        return request.post<UserLoginDataType, UserPrivateLoginParamsType>("/private", params);
    }
}

export { UserApi };
export type { UserLoginDataType, UserLoginParamsType, UserApiType };
