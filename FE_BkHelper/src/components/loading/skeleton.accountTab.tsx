import React from "react";
import { Dimensions, View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const { width: sWidth } = Dimensions.get("window");

const SkeletonAccountTab = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 60 }}>
            <ContentLoader
                speed={2}
                width={sWidth}
                height={300}
                backgroundColor="#f3f3f3"
                foregroundColor="#e0e0e0"
            >
                {/* Avatar */}
                <Circle cx={sWidth / 2} cy="55" r="55" />

                {/* Name */}
                <Rect
                    x={sWidth / 2 - 80}
                    y="130"
                    rx="6"
                    ry="6"
                    width="160"
                    height="18"
                />

                {/* Role */}
                <Rect
                    x={sWidth / 2 - 60}
                    y="160"
                    rx="6"
                    ry="6"
                    width="120"
                    height="14"
                />

                {/* Menu item 1 */}
                <Rect x="24" y="200" rx="8" ry="8" width={sWidth - 48} height="50" />

                {/* Menu item 2 */}
                <Rect x="24" y="260" rx="8" ry="8" width={sWidth - 48} height="50" />
            </ContentLoader>

            {/* Sign out button */}
            <ContentLoader
                speed={2}
                width={sWidth}
                height={80}
                backgroundColor="#f3f3f3"
                foregroundColor="#e0e0e0"
                style={{ marginTop: 20 }}
            >
                <Rect
                    x="24"
                    y="10"
                    rx="10"
                    ry="10"
                    width={sWidth - 48}
                    height="50"
                />
            </ContentLoader>
        </View>
    );
};

export default SkeletonAccountTab;
