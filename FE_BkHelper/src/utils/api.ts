import instance from "@/utils/axios.customize";

export const lmsLoginAPI = (username: string, password: string) => {
    const url = `/api/v1/auth/hcmut-login`;
    return instance.post<IUserLogin>(url, {
        username: username,
        password: password,
    });
};

export const logOutAPI = (sesskey: string, JSESSIONID: string, CASTGC: string, SESSION: string, MoodleSession: string, MOODLEID1_: string) => {
    const url = `/api/v1/auth/hcmut-logout`;
    return instance.post<ILogOutAPI>(url, {
        sesskey: sesskey,
        cookies: {
            JSESSIONID: JSESSIONID,
            CASTGC: CASTGC,
            SESSION: SESSION,
            MoodleSession: MoodleSession,
            MOODLEID1_: MOODLEID1_
        },
    });
};

export const getUserInfAPI = (token: string) => {
    const url = `/api/v1/info/fetch-user-information`;
    return instance.post<IUserInformation>(url, {
        token: token,
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

export const fetchForumAPI = (forum_name: string, course_id: string, course_code: string, teacher_first_name: string, teacher_last_name: string
    , teacher_email: string, semester: string
) => {
    const url = `/api/v1/forum/forum`;
    return instance.post<IForumAPI>(url, {
        forum_name: forum_name,
        course_id: course_id,
        course_code: course_code,
        teacher_first_name: teacher_first_name,
        teacher_last_name: teacher_last_name,
        teacher_email: teacher_email,
        semester: semester
    });
};

export const getListDiscussionAPI = (forum_id: string) => {
    const url = `/api/v1/discussion/list_discussions/${forum_id}`;
    return instance.get<IDiscussionAPI>(url);
};

export const getDiscussionAPI = (discussion_id: string) => {
    const url = `/api/v1/discussion/get_discussion/${discussion_id}`;
    return instance.get<IGetDiscussionAPI>(url);
};

export const CreateDiscussionAPI = (forum_id: string, title: string, content: string) => {
    const url = `api/v1/discussion/create_discussion`;
    return instance.post<ICreateDiscusionAPI>(url, {
        forum_id: forum_id,
        title: title,
        content: content,
    });
};
