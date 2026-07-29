import type {
    LoginDataType,
    LoginParamsType,
    LoginResponseType
} from "../type/user";
import request from "/@/library/request";

interface UserApiType {
    loginApi: (params: LoginParamsType) => Promise<LoginResponseType>;
}

const UserApi: UserApiType = {
    loginApi(params: LoginParamsType): Promise<LoginResponseType> {
        return request.post<LoginDataType, LoginParamsType>("/login", params, {
            skipAuth: true,
        });
    }
};

export { UserApi };
export type { LoginDataType, LoginParamsType, UserApiType };
