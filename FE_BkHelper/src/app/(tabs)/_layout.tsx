import { APP_COLOR } from "@/utils/constant";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octions from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";

const TabLayout = () => {

    const getIcons = (routeName: string, focused: boolean, size: number) => {
        if (routeName === "index") {
            return (
                <FontAwesome
                    name="home"
                    size={size}
                    color={focused ? APP_COLOR.BLUE : APP_COLOR.GREY}
                />
            )
        }

        if (routeName === "calendar") {
            return (focused ?
                <FontAwesome6
                    name="calendar-days"
                    size={size}
                    color={APP_COLOR.BLUE}
                />
                :
                <FontAwesome
                    name="calendar"
                    size={size}
                    color={APP_COLOR.GREY}
                />
            )
        }
        if (routeName === "notification") {
            return (focused ?
                <Octions
                    name="bell-fill"
                    size={size}
                    color={APP_COLOR.BLUE}
                />
                :
                <Octions
                    name="bell"
                    size={size}
                    color={APP_COLOR.GREY}
                />
            )
        }
        if (routeName === "map") {
            return (focused ?
                <FontAwesome5
                    name="map-marker-alt"
                    size={size}
                    color={APP_COLOR.BLUE}
                />
                :
                <Feather
                    name="map-pin"
                    size={size}
                    color={APP_COLOR.GREY}
                />
            )
        }

        if (routeName === "account") {
            return (
                focused ?
                    <MaterialCommunityIcons
                        name="account"
                        size={size}
                        color={APP_COLOR.BLUE}
                    />
                    :
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={size}
                        color={APP_COLOR.GREY}
                    />
            )
        }

        return (
            <></>
        )
    }

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    return getIcons(route.name, focused, size);
                },
                headerShown: false,
                tabBarLabelStyle: { paddingBottom: 3 },
                tabBarActiveTintColor: APP_COLOR.BLUE

            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home"
                }}
            />

            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar"
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: "Map"
                }}
            />

            <Tabs.Screen
                name="notification"
                options={{
                    title: "Notification"
                }}
            />

            <Tabs.Screen
                name="account"
                options={{
                    title: "Account"
                }}
            />

        </Tabs>
    )
}

export default TabLayout