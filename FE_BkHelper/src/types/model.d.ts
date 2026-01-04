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
        access_token: string,
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

    interface ICourse {
        id: string,
        title: string,
        teacher: string,
        code: string,
        department: string,
        color: string
    }

    interface IUserInformation {
        user_detail: {
            code: string,
            msg: string,
            data: {
                id: number,
                code: string,
                lastName: string,
                firstName: string,
                dateOfBirth: string,
                isFemale: false,
                idCardNumber: string,
                idCardDate: string,
                idCardPlace: string,
                personalEmail: string,
                orgEmail: string,
                secondEmail: string,
                phoneNumber: string,
                address: string,
                classCode: string,
                majorBlockCode: string,
                applyForYear: number,
                startYear: number,
                startMonth: number,
                extendedSemester: string,
                numOfSemesterReduced: string,
                totalSemester: number,
                totalSemesterMax: number,
                trainingTime: string,
                trainingTimeMax: string,
                semesterStart: string,
                semesterTrainingTime: string,
                semesterTrainingTimeMax: string,
                graduationTime: string,
                graduationTimeMax: string,
                status: {
                    id: number,
                    code: string,
                    name: string
                },
                teachingDep: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                trainingManagementDep: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                trainingType: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                trainingLevel: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                trainingForms: {
                    id: 1,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                major: {
                    id: number,
                    code: string,
                    sevenDigitCode: string,
                    type: string,
                    nameVi: string,
                    nameEn: string
                },
                bknet: string,
                bankAccountNumber: string,
                bank: string,
                curriculum: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                trainingSession: string,
                campus: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                localTraining: string,
                program: {
                    id: number,
                    code: string,
                    nameVi: string,
                    nameEn: string
                },
                ocbCif: string,
                semesterYearGraduated: string,
                graduationDecisionNumber: string,
                graduationDecisionDate: string,
                majorGraduated: string,
                lastUpdatedAt: string,
                imageLastUpdatedAt: string,
                studentStatusLastUpdatedAt: string,
                note: string
            },
            sign: string
        }
    }

    interface ILogOutAPI {
        status: string,
        data: {
            ok: boolean,
            msg: string,
            details: {
                lms_redirect: string,
                cas_final: string,
                mybk_status: number,
                mybk_cas_redirect: string,
                cas_from_mybk_status: number,
                mybk_final_redirect: string,
                mybk_final_status: number
            }
        }
    }

    interface IForumAPI {
        status: string,
        created: boolean,
        forum: {
            forum_id: string,
            forum_name: string,
            course_id: string,
            course_code: string,
            semester: string,
            created_at: string
        }
    }

    interface IDiscussionAPI {
        status: string,
        data: DiscussionItem[]
    }

    interface DiscussionItem {
        forum_id: string,
        user_id: string,
        content: string,
        updated_at: string,
        deleted_at: string,
        discussion_id: string,
        title: string,
        created_at: string,
        is_deleted: boolean,
        user: {
            user_id: string,
            lms_id: string,
            student_code: string,
            email: string,
            created_at: string,
            first_name: string,
            last_name: string,
            avatar_url: string
        }
    }

    interface IGetDiscussionAPI {
        status: string,
        data: IGetDiscussionItem
    }

    interface IGetDiscussionItem {
        forum_id: string,
        user_id: string,
        content: string,
        updated_at: string,
        deleted_at: string,
        discussion_id: string,
        title: string,
        created_at: string,
        is_deleted: boolean,
        user: {
            user_id: string,
            lms_id: string,
            student_code: string,
            email: string,
            created_at: string,
            first_name: string,
            last_name: string,
            avatar_url: string
        }
        media: IMediaDiscussion[]
        comment: ICommentDiscussion[]
    }

    interface ICommentDiscussion {
        parent_comment_id: string,
        comment_id: string,
        created_at: string,
        discussion_id: string,
        user_id: string,
        content: string,
        is_deleted: boolean,
        replies: ICommentDiscussion[]
    }

    interface IMediaDiscussion {
        cloudinary_public_id: string,
        media_id: string,
        created_at: string,
        discussion_id: string,
        image_url: string
    }

    interface ICreateDiscusionAPI {
        discussion_id: string,
        forum_id: string,
        user_id: string,
        title: string,
        content: string,
        created_at: string,
        updated_at: null
    }
}