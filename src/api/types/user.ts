type UserLoginParamsType = {
    username: string;
    password: string;
}

type UserPrivateLoginParamsType = {
    password: string;
}

type UserLoginDataType = {
    token: string;
    avatar: string;
    username: string;
}

type UserLoginResponseType = ApiResponseType<UserLoginDataType>

export type {
    UserLoginDataType,
    UserLoginParamsType,
    UserLoginResponseType,
    UserPrivateLoginParamsType
};
