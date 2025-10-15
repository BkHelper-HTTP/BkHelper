export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message?: string | string[];
        status?: number | string;
        data?: T;
    }

    interface IUserLogin {
        status: string,
        mybk: {
            token: string,
            cookies: {
                JSESSIONID: string,
                CASTGC: string,
                SESSION: string
            }
        },
        lms: {
            sesskey: string,
            cookies: {
                JSESSIONID: string,
                CASTGC: string,
                SESSION: string,
                MoodleSession: string,
                MOODLEID1_: string
            },
            userid: number
        }
    }

    interface INotificationAPI {
        conversations: ConversationItem[]
    }

    interface ConversationItem {
        id: number,
        name: string,
        subname: string | null,
        imageurl: string | null,
        type: number,
        membercount: number,
        ismuted: boolean,
        isfavourite: boolean,
        isread: boolean,
        unreadcount: string | null,
        members: [
            {
                id: number,
                fullname: string,
                profileurl: string,
                profileimageurl: string,
                profileimageurlsmall: string,
                isonline: boolean,
                showonlinestatus: boolean,
                isblocked: boolean,
                iscontact: boolean,
                isdeleted: boolean,
                canmessageevenifblocked: boolean,
                canmessage: boolean,
                requirescontact: boolean,
                contactrequests: []
            }
        ],
        messages: [
            {
                id: number,
                useridfrom: number,
                text: string,
                timecreated: number
            }
        ],
        candeletemessagesforallusers: boolean
    };

    interface IMessageData {
        id: number
        members: [
            {
                id: number,
                fullname: string,
                profileurl: string,
                profileimageurl: string,
                profileimageurlsmall: string,
                isonline: boolean,
                showonlinestatus: boolean,
                isblocked: boolean,
                iscontact: boolean,
                isdeleted: boolean,
                canmessageevenifblocked: boolean,
                canmessage: boolean,
                requirescontact: boolean,
                contactrequests: []
            }
        ],
        messages: [
            {
                id: number,
                useridfrom: number,
                text: string,
                timecreated: number
            }
        ],
    }

    interface IScheduleItem {
        hour: string;
        duration: string;
        title: string;
        id: number;
        mssv: string;
        subject: {
            id: number;
            code: string;
            nameVi: string;
            nameEn: string;
            numOfCredits: number;
            numOfCourseCredits: number;
        };
        academicYear: number;
        semester: number;
        semesterYearCode: string;
        semesterYearName: string;
        employee: {
            id: number;
            code: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        subjectClassGroup: {
            id: number;
            subjectClassGroupCode: string;
            classGroup: string;
            subjectGroup: string | null;
        };
        room: {
            id: number;
            code: string;
            building: {
                id: number;
                code: string;
                campus: {
                    id: number;
                    code: string;
                    nameVi: string;
                    nameEn: string;
                };
                totalRoom: null | number | string;
                note: string;
            };
        };
        calendarYear: number;
        weeksCalendarBegin: number;
        dayOfWeek: number;
        startLesson: number;
        numOfLesson: number;
        startTime: string;
        endTime: string;
        weekSeriesDisplay: string;
        lastUpdatedTime: string;
    }

    interface IScheduleSection {
        title: string;
        data: IScheduleItem[];
    }

    interface IScheduleAPI {
        status: string
        data: IScheduleSection[]
    }
}