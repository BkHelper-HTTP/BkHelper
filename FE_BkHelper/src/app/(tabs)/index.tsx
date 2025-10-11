import { Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const HomeTab = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Text>
                    Home Tab
                </Text>
            </View>
        </SafeAreaView>
    )
}
export default HomeTab