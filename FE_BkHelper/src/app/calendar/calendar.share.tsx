import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

const CalendarShare = () => {
    const [searchText, setSearchText] = useState('CO2001');
    const [activeTab, setActiveTab] = useState('CS2');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
    };

    const classes = [
        {
            id: 1,
            subjectCode: 'CO2001',
            subjectName: 'Kỹ năng nghề nghiệp cho kỹ sư',
            group: 'L01',
            lecturer: 'Kiều Lê Thúy Chung',
            room: 'Chưa có dữ liệu',
            time: 'Chưa có dữ liệu',
            period: 'Chưa có dữ liệu',
            week: 'Chưa có dữ liệu',
        },
        {
            id: 2,
            subjectCode: 'CO2001',
            subjectName: 'Kỹ năng nghề nghiệp cho kỹ sư',
            group: 'L02',
            lecturer: 'Nguyễn Huỳnh Thông',
            room: 'Chưa có dữ liệu',
            time: 'Chưa có dữ liệu',
            period: 'Chưa có dữ liệu',
            week: 'Chưa có dữ liệu',
        },
        {
            id: 3,
            subjectCode: 'CO2001',
            subjectName: 'Kỹ năng nghề nghiệp cho kỹ sư',
            group: 'L03',
            lecturer: 'Phạm Minh Tuấn',
            room: 'Chưa có dữ liệu',
            time: 'Chưa có dữ liệu',
            period: 'Chưa có dữ liệu',
            week: 'Chưa có dữ liệu',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <FontAwesome name="calendar" size={24} color="#4361ee" />
                <Text style={styles.headerTitle}>Tìm & Lọc</Text>
            </View>

            {/* Search môn học */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Nhập mã môn học..."
                />
            </View>

            {/* Tabs CS1 / CS2 */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                    onPress={() => setActiveTab('all')}>
                    <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                        Tất cả cơ sở
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'CS1' && styles.activeTab]}
                    onPress={() => setActiveTab('CS1')}>
                    <Text style={[styles.tabText, activeTab === 'CS1' && styles.activeTabText]}>
                        CS1
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'CS2' && styles.activeTab]}
                    onPress={() => setActiveTab('CS2')}>
                    <Text style={[styles.tabText, activeTab === 'CS2' && styles.activeTabText]}>
                        CS2
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Lọc giảng viên */}
            <View style={styles.lecturerContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.lecturerScrollContent}
                >
                    {['Tất cả', 'Kiều Lê Thúy Chung', 'Nguyễn Cao Trí', 'Nguyễn Huỳnh Thông', 'Phạm Minh Tuấn', 'Võ Đại Nhật'].map(
                        (name, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.lecturerTag, name === 'Tất cả' && styles.activeLecturerTag]}>
                                <Text
                                    style={[
                                        styles.lecturerText,
                                        name === 'Tất cả' && styles.activeLecturerText,
                                    ]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        ),
                    )}
                </ScrollView>
            </View>

            {/* Chọn ngày */}
            <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}>
                <FontAwesome name="calendar" size={20} color="#666" />
                <Text style={styles.dateText}>Chọn ngày {formatDate(selectedDate)}</Text>
                <Entypo name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            {/* Nút Hôm nay & Bỏ chọn */}
            <View style={styles.dateActions}>
                <TouchableOpacity
                    style={styles.todayButton}
                    onPress={() => setSelectedDate(new Date())}>
                    <Text style={styles.todayText}>Hôm nay</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.clearText}>Bỏ chọn ngày</Text>
                </TouchableOpacity>
            </View>

            {/* Kết quả */}
            <View style={styles.resultHeader}>
                <Text style={styles.resultText}>
                    Số kết quả: {classes.length} (lọc: có theo ngày: CS2)
                </Text>
            </View>

            {/* Danh sách lớp học */}
            <ScrollView style={styles.classList}>
                {classes.map((item) => (
                    <View key={item.id} style={styles.classItem}>
                        <View style={styles.classHeader}>
                            <Text style={styles.subjectCode}>{item.subjectCode}</Text>
                            <Text style={styles.subjectName}>— {item.subjectName}</Text>
                        </View>
                        <View style={styles.classDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>NHÓM - TỔ:</Text>
                                <Text style={styles.value}>L0{item.id}</Text>
                                <Text style={styles.lecturer}>Giảng viên: {item.lecturer}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.infoTag}>
                                    <Text style={styles.infoText}>Phòng: {item.room}</Text>
                                </View>
                                <View style={styles.infoTag}>
                                    <Text style={styles.infoText}>Thời gian: {item.time}</Text>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.smallText}>Tiết: {item.period} • Tuần: {item.week}</Text>
                            </View>
                            {/* <View style={styles.groupBadge}>
                                <Text style={styles.groupText}>CS: Chưa có dữ liệu</Text>
                                <Text style={styles.groupText}>Nhóm: L0{item.id}</Text>
                            </View> */}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.clearAllButton}>
                <Text style={styles.clearAllText}>Clear</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4361ee', marginLeft: 8 },

    searchContainer: { paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#fff' },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },

    tabContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' },
    tab: {
        paddingVertical: 9,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        marginRight: 10,
    },
    activeTab: { backgroundColor: '#4361ee' },
    tabText: { color: '#666', fontWeight: '600', fontSize: 14 },
    activeTabText: { color: '#fff', fontWeight: '600' },

    // SỬA LỖI KHOẢNG TRỐNG THỪA DƯỚI GIẢNG VIÊN
    lecturerContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 8,
        borderBottomColor: '#f8f9fa',
    },
    lecturerScrollContent: {
        paddingHorizontal: 16,
        paddingRight: 40, // để có chỗ cuộn
    },
    lecturerTag: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#e9ecef',
        borderRadius: 20,
        marginRight: 10,
    },
    activeLecturerTag: { backgroundColor: '#4361ee' },
    lecturerText: { color: '#666', fontSize: 14 },
    activeLecturerText: { color: '#fff', fontWeight: '600' },

    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },

    dateActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10
    },
    todayButton: {
        backgroundColor: '#4361ee',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20
    },
    todayText: { color: '#fff', fontWeight: '600' },
    clearText: { color: '#e74c3c', fontWeight: '600' },

    resultHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultText: { color: '#666', fontSize: 13.5 },

    classList: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

    // CARD LỚP HỌC - ĐÃ TỐI ƯU HOÀN TOÀN
    classItem: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    groupBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 10,
    },
    groupText: { fontSize: 11, color: '#666', lineHeight: 14 },

    classHeader: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        paddingRight: 90, // tránh đè badge
    },
    subjectCode: {
        fontWeight: 'bold',
        color: '#4361ee',
        fontSize: 17
    },
    subjectName: {
        fontSize: 16.5,
        color: '#222',
        flex: 1
    },

    classDetails: { marginTop: 4 },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    label: { fontWeight: '600', color: '#333', fontSize: 15 },
    value: { fontWeight: 'bold', marginLeft: 6, fontSize: 15, color: '#222' },
    lecturer: {
        color: '#4361ee',
        fontSize: 15.5,
        marginTop: 6,
        fontWeight: '500'
    },

    infoTagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginBottom: 6,
    },
    infoTag: {
        backgroundColor: '#f1f3f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 10,
        marginBottom: 6,
    },
    infoText: { color: '#555', fontSize: 13.5 },

    smallText: {
        color: '#777',
        fontSize: 14,
        marginTop: 4,
    },

    clearAllButton: {
        margin: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 12,
        alignItems: 'center',
    },
    clearAllText: { color: '#666', fontWeight: '700', fontSize: 16 },
});

export default CalendarShare;