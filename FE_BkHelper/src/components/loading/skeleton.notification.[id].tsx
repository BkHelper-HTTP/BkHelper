import React from "react";
import { Dimensions } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const { height: sHeight, width: sWidth } = Dimensions.get("window");

const SkeletonNotificationDetail = () => (
  <ContentLoader
    speed={2}
    width={sWidth}
    height={sHeight}
    backgroundColor="#f3f3f3"
    foregroundColor="#e0e0e0"
    style={{ width: "100%" }}
  >
    <Circle cx="40" cy="40" r="25" />
    <Rect x="80" y="20" rx="4" ry="4" width="180" height="14" />
    <Rect x="80" y="40" rx="3" ry="3" width="120" height="10" />

    <Rect x="0" y="90" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="100" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="120" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="140" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="190" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="200" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="220" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="240" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="290" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="300" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="320" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="340" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="390" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="400" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="420" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="440" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="490" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="500" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="520" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="540" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="590" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="600" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="620" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="640" rx="3" ry="3" width={sWidth - 100} height="10" />

    <Rect x="0" y="690" rx="10" ry="10" width={sWidth - 40} height="80" />
    <Rect x="10" y="700" rx="3" ry="3" width={sWidth - 60} height="10" />
    <Rect x="10" y="720" rx="3" ry="3" width={sWidth - 80} height="10" />
    <Rect x="10" y="740" rx="3" ry="3" width={sWidth - 100} height="10" />
  </ContentLoader>
);

export default SkeletonNotificationDetail;
