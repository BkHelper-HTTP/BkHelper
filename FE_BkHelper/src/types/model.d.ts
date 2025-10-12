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
        sesskey: string,
        cookies: {
            JSESSIONID: string,
            CASTGC: string,
            MoodleSession: string,
            MOODLEID1_: string
        },
        userid: number
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
}