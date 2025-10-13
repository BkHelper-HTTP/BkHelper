import { Redirect } from "expo-router"
// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

const RootPage = () => {
    if (true) {
        return (
            <Redirect href={"/(tabs)"} />
            // <Redirect href={"/(auth)/signin"} />
        )
    }
}

export default RootPage