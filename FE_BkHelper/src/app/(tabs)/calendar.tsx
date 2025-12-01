import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CalendarPrivate from "../calendar/calendar.private";
import CalendarShare from "../calendar/calendar.share";

const screenWidth = Dimensions.get("window").width;

const CalendarTab = () => {
    const [mode, setMode] = useState<"private" | "share">("private");

    // Animation value
    const anim = useRef(new Animated.Value(0)).current;

    const switchMode = (value: "private" | "share") => {
        setMode(value);

        Animated.timing(anim, {
            toValue: value === "private" ? 0 : 1,
            duration: 260,
            useNativeDriver: false,
        }).start();
    };

    // Interpolation cho highlight trượt
    const highlightTranslate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, screenWidth / 2 - 32],
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View
                style={{
                    flexDirection: "row",
                    padding: 6,
                    marginHorizontal: 16,
                    borderRadius: 16,
                    backgroundColor: "#E8ECF1",
                    marginTop: 12,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 6,
                        bottom: 6,
                        width: (screenWidth - 32) / 2 - 6,
                        borderRadius: 12,
                        backgroundColor: "#0066FF",
                        transform: [{ translateX: highlightTranslate }],
                    }}
                />

                {/* Private button */}
                <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 10 }}
                    onPress={() => switchMode("private")}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: "600",
                            color: mode === "private" ? "white" : "#4A4A4A",
                        }}
                    >
                        Lịch của tôi
                    </Text>
                </TouchableOpacity>

                {/* Share button */}
                <TouchableOpacity
                    style={{ flex: 1, paddingVertical: 10 }}
                    onPress={() => switchMode("share")}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 15,
                            fontWeight: "600",
                            color: mode === "share" ? "white" : "#4A4A4A",
                        }}
                    >
                        Lịch chung
                    </Text>
                </TouchableOpacity>
            </View>

            <Animated.View
                style={{
                    flex: 1,
                    marginTop: 10,
                    opacity: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: mode === "private" ? [1, 0.3] : [0.3, 1],
                    }),
                    transform: [
                        {
                            translateX: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            }),
                        },
                    ],
                }}
            >
                {mode === "private" ? <CalendarPrivate /> : <CalendarShare />}
            </Animated.View>
        </SafeAreaView>
    );
};

export default CalendarTab;
