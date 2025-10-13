import AppProvider from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
const RootLayout = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    },
  };

  return (
    <GestureHandlerRootView >
      <AppProvider>
        <ThemeProvider value={navTheme}>
          <RootSiblingParent>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: APP_COLOR.BLUE,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}>
              <Stack.Screen
                name="index"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="(auth)/signup"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="(auth)/welcome"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="(auth)/signin"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="notification/[id]"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="notification/notification.message.detail"
                options={{ headerShown: false }} />
            </Stack>
          </RootSiblingParent>
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView >
  )
}

export default RootLayout