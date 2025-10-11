import instance from "@/utils/axios.customize";

export const lmsLoginAPI = (username: string, password: string) => {
    const url = `/api/v1/auth/lms-login`;
    return instance.post(url, {
        username: username,
        password: password,
    });
};