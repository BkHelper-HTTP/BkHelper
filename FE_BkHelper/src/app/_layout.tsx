import AppProvider from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: "https://48cd84ef14e78358fd23d6a172b8da29@o4510499653419008.ingest.us.sentry.io/4510502713491456",
  enableInExpoDevelopment: true,
  debug: true,
});

const RootLayout = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    },
  };

  // Sentry.Native.captureException(new Error("Test error by student"));

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

              <Stack.Screen
                name="account/view.profile.screen"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="forum/forum.view.screen"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="forum/forum.details.screen"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="forum/forum.add.screen"
                options={{ headerShown: false }} />

              <Stack.Screen
                name="chat/chat.screen"
                options={{ headerShown: false }} />

            </Stack>
          </RootSiblingParent>
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView >
  )
}

export default RootLayout