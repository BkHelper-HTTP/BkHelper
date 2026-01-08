import { useCurrentApp } from "@/context/app.context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router"
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";


const RootPage = () => {
    const { setAppState } = useCurrentApp()
    const [state, setState] = useState<any>();

    if (true) {
        return (
            // <Redirect href={"/(tabs)"} />
            // <Redirect href={"/(auth)/signin"} />
            <Redirect href={"/(auth)/welcome"} />
        )
    }

    // return (<></>)
}

export default RootPage