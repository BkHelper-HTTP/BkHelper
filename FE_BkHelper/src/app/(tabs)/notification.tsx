import MessageDetailScreen from "@/components/message/message.detail.screen"
import MessageListScreen from "@/components/message/message.list.screen"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const NotificationTab = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <MessageListScreen /> */}
            <MessageDetailScreen />
        </SafeAreaView>
    )
}

export default NotificationTab