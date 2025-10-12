import NotificationListScreen from "@/app/notification/notification.list.screen"
import { useCurrentApp } from "@/context/app.context"
import { fetchNotificationsAPI } from "@/utils/api"
import { useEffect, useState } from "react"
import Toast from "react-native-root-toast"
import { SafeAreaView } from "react-native-safe-area-context"

const NotificationTab = () => {
    const [conversations, setConversations] = useState<ConversationItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { appState } = useCurrentApp()

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true)
            if (appState?.sesskey && appState?.cookies.MoodleSession && appState?.cookies.MOODLEID1_ && appState?.userid) {
                const res = await fetchNotificationsAPI(appState?.sesskey!, appState?.cookies.MoodleSession!, appState?.cookies.MOODLEID1_, appState?.userid)
                if (res.data?.conversations) {
                    setConversations(res.data.conversations)
                } else {
                    Toast.show("Can't get notifications", {
                        duration: Toast.durations.LONG,
                        textColor: "white",
                        backgroundColor: "red",
                        opacity: 1,
                        position: Toast.positions.BOTTOM
                    });
                }
            } else {
                Toast.show("Get notifications failure", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    opacity: 1,
                    position: Toast.positions.BOTTOM
                });
            }
            setIsLoading(false)
        }
        fetchNotifications()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NotificationListScreen
                conversations={conversations}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </SafeAreaView>
    )
}

export default NotificationTab