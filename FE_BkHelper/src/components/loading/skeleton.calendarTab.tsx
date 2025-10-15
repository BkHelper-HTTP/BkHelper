import React from "react";
import { Dimensions, View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const { width: sWidth, height: sHeight } = Dimensions.get("window");

const SkeletonCalendarTab = () => (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ContentLoader
            speed={2}
            width={sWidth}
            height={80}
            backgroundColor="#f3f3f3"
            foregroundColor="#e0e0e0"
            style={{ paddingHorizontal: 16, paddingVertical: 10 }}
        >

            <Rect x="10" y="20" rx="5" ry="5" width="80" height="16" />

            <Rect x="110" y="10" rx="8" ry="8" width={sWidth * 0.65} height="36" />
        </ContentLoader>

        <ContentLoader
            speed={2}
            width={sWidth}
            height={250}
            backgroundColor="#f3f3f3"
            foregroundColor="#e0e0e0"
            style={{ paddingHorizontal: 16, paddingTop: 10 }}
        >

            <Rect x="30" y="10" rx="6" ry="6" width={sWidth * 0.6} height="20" />

            {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
                <Rect
                    key={i}
                    x={16 + i * (sWidth / 8.5)}
                    y="50"
                    rx="6"
                    ry="6"
                    width={sWidth / 10}
                    height="20"
                />
            ))}

            {[0, 1, 2].map((row) =>
                Array(7)
                    .fill(0)
                    .map((_, col) => (
                        <Circle
                            key={`${row}-${col}`}
                            cx={30 + col * (sWidth / 8)}
                            cy={100 + row * 50}
                            r="14"
                        />
                    ))
            )}
        </ContentLoader>


        <ContentLoader
            speed={2}
            width={sWidth}
            height={sHeight - 330}
            backgroundColor="#f3f3f3"
            foregroundColor="#e0e0e0"
            style={{ width: "100%", paddingHorizontal: 8, paddingTop: 8 }}
        >
            {Array.from({ length: 6 }).map((_, index) => {
                const y = index * 80 + 10;
                return (
                    <React.Fragment key={index}>
                        <Circle cx="35" cy={y + 25} r="25" />
                        <Rect x="70" y={y + 8} rx="4" ry="4" width={sWidth * 0.5} height="14" />
                        <Rect x="70" y={y + 28} rx="3" ry="3" width={sWidth * 0.6} height="12" />
                        <Rect x={sWidth - 90} y={y + 10} rx="3" ry="3" width="60" height="10" />
                    </React.Fragment>
                );
            })}
        </ContentLoader>
    </View>
);

export default SkeletonCalendarTab;
