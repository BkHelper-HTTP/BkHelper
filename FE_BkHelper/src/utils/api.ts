import { instanceChat, instance } from "@/utils/axios.customize";

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
    const url = `/api/v1/discussion/create_discussion`;
    return instance.post<ICreateDiscusionAPI>(url, {
        forum_id: forum_id,
        title: title,
        content: content,
    });
};

export const UploadImageAPI = (formData: FormData, forum_id: string) => {
    const url = `/api/v1/media/upload_media/${forum_id}`;
    return instance.post<IUploadMediaAPI>(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const UpdateDiscussionAPI = (discussion_id: string, forum_id: string, title: string, content: string) => {
    const url = `/api/v1/discussion/update_discussion/${discussion_id}`;
    return instance.patch<IUpdateDiscussionAPI>(url, {
        forum_id: forum_id,
        title: title,
        content: content,
    });
};

export const DeleteDiscussionAPI = (discussion_id: string) => {
    const url = `/api/v1/discussion/delete_discussion/${discussion_id}`;
    return instance.delete<IDeleteDiscussionAPI>(url);
};

export const DeleteImageAPI = (media_id: string) => {
    const url = `/api/v1/media/delete_media/${media_id}`;
    return instance.delete<IDeleteImageAPI>(url);
};

export const CreateCommentAPI = (discussion_id: string, content: string) => {
    const url = `/api/v1/comment/create_comment`;
    return instance.post<ICreateCommentAPI>(url, {
        discussion_id: discussion_id,
        content: content,
    });
};

export const ReplyCommentAPI = (discussion_id: string, content: string, parent_comment_id: string) => {
    const url = `api/v1/comment/create_comment`;
    return instance.post<ICreateCommentAPI>(url, {
        discussion_id: discussion_id,
        content: content,
        parent_comment_id: parent_comment_id
    });
};

export const UpdateCommentAPI = (comment_id: string, content: string) => {
    const url = `/api/v1/comment/update_comment/${comment_id}`;
    return instance.patch<IUpdateCommentAPI>(url, {
        content: content,
    });
};

export const DeleteCommentAPI = (comment_id: string) => {
    const url = `/api/v1/comment/delete_comment/${comment_id}`;
    return instance.delete<IDeleteCommentAPI>(url);
};

export const getCourseAPI = () => {
    const url = `/api/v1/course/my-courses`;
    return instance.get<ICourseAPI>(url);
};

export const JoinRoomAPI = (classId: string, className: string) => {
    const url = '/chat/room/join';
    return instanceChat.post<IJoinRoomAPI>(url, {
        classId: classId,
        className: className,
    });
};

export const getChatMessagesAPI = (classId: string) => {
    const url = `/chat/room/${classId}/messages`;
    return instanceChat.get<IChatMessageAPI[]>(url);
};
