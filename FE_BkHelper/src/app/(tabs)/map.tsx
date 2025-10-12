import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const source = {
    html: "<p>KIỂM TRA GIỮA KỲ - Thứ 3, ngày 30/9/2025 tại Phòng học H2-301.<br>\n<br>\nGồm 02 ca kiểm tra:<br>\n- Ca 1: 12:00 - 12:45: Gồm các SV có số cuối của MSSV từ 0 đến 4<br>\n- Ca 2: 13:00 - 13:45: Gồm các SV có số cuối của MSSV từ 5 đến 9<br>\n<br>\nCấu trúc đề kiểm tra<br>\n- Câu 1 (6.0 điểm) - 25'<br>\nTrắc nghiệm: 30 câu hỏi của Chương 1-3. Các câu hỏi bẳng tiếng Anh, tương tự các câu hỏi dùng trong các bài Quiz đã làm..<br>\nLàm bài ngay trên hệ thống LMS.<br>\n<br>\n- Câu 2 (4.0 điểm) - 20'<br>\nBài làm về McCab Basic path, MCC/MCDC, du-/dc-path<br>\nLàm bài trên giấy và nộp ngay sau ca kiểm tra.<br>\n<br>\nCác SV vắng kiểm tra, phải đăng ký với GV và sẽ được bố trí kiểm tra bù.<br>\n<br>\nCheers,</p>"
};
const MapTab = () => {
    const { width } = useWindowDimensions();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Text>
                    Map Tab
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default MapTab