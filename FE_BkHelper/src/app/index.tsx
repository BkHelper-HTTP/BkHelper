import { Redirect } from "expo-router"
// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

const RootPage = () => {
    if (true) {
        return (
            // <Redirect href={"/(tabs)"} />
            // <Redirect href={"/(auth)/signin"} />
            <Redirect href={"/(auth)/welcome"} />
        )
    }
}

export default RootPage