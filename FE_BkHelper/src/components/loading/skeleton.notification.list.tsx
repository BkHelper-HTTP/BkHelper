import React from "react";
import { Dimensions } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const { height: sHeight, width: sWidth } = Dimensions.get("window");

const SkeletonNotificationList = () => (
    <ContentLoader
        speed={2}
        width={sWidth}
        height={sHeight}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
        style={{ width: "100%", paddingHorizontal: 8, paddingTop: 8 }}
    >
        <Circle cx="35" cy="35" r="25" />
        <Rect x="70" y="18" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="38" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="20" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="95" r="25" />
        <Rect x="70" y="78" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="98" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="80" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="155" r="25" />
        <Rect x="70" y="138" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="158" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="140" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="215" r="25" />
        <Rect x="70" y="198" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="218" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="200" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="275" r="25" />
        <Rect x="70" y="258" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="278" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="260" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="335" r="25" />
        <Rect x="70" y="318" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="338" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="320" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="395" r="25" />
        <Rect x="70" y="378" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="398" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="380" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="455" r="25" />
        <Rect x="70" y="438" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="458" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="440" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="515" r="25" />
        <Rect x="70" y="498" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="518" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="500" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="575" r="25" />
        <Rect x="70" y="558" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="578" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="560" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="635" r="25" />
        <Rect x="70" y="618" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="638" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="620" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="695" r="25" />
        <Rect x="70" y="678" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="698" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="680" rx="3" ry="3" width="60" height="10" />

        <Circle cx="35" cy="755" r="25" />
        <Rect x="70" y="738" rx="4" ry="4" width={sWidth * 0.5} height="14" />
        <Rect x="70" y="758" rx="3" ry="3" width={sWidth * 0.6} height="12" />
        <Rect x={sWidth - 90} y="740" rx="3" ry="3" width="60" height="10" />
    </ContentLoader>
);

export default SkeletonNotificationList;
