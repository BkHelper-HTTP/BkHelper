import instance from "@/utils/axios.customize";

export const lmsLoginAPI = (username: string, password: string) => {
    const url = `/api/v1/auth/hcmut-login`;
    return instance.post<IUserLogin>(url, {
        username: username,
        password: password,
    });
};

export const fetchNotificationsAPI = (sesskey: string, MoodleSession: string, MOODLEID1_: string, userid: number) => {
    const url = `/api/v1/notifications/fetch-notifications`;
    return instance.post<IBackendRes<INotificationAPI>>(url, {
        sesskey: sesskey,
        cookies: {
            MoodleSession: MoodleSession,
            MOODLEID1_: MOODLEID1_
        },
        userid: userid
    });
};

export const fetchNotificationsMessageAPI = (sesskey: string, MoodleSession: string, MOODLEID1_: string, userid: number, convid: number) => {
    const url = `/api/v1/notifications/fetch-notification-messages`;
    return instance.post<IBackendRes<IMessageData>>(url, {
        sesskey: sesskey,
        cookies: {
            MoodleSession: MoodleSession,
            MOODLEID1_: MOODLEID1_
        },
        userid: userid,
        convid: convid
    });
};

export const fetchScheduleAPI = (token: string, SESSION: string, semester_year: string) => {
    const url = `/api/v1/schedule/fetch-schedule`;
    return instance.post<IScheduleAPI>(url, {
        token: token,
        cookies: {
            SESSION: SESSION
        },
        semester_year: semester_year
    });
};
