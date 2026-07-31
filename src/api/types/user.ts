interface UserLoginParamsType {
    username: string;
    password: string;
}

interface UserLoginDataType {
    avatar: string;
    token: string;
    username: string;
}

type UserLoginResponseType = ApiResponseType<UserLoginDataType>

export type { UserLoginDataType, UserLoginParamsType, UserLoginResponseType };
