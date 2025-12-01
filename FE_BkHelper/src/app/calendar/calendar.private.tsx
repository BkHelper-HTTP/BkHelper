import AgendaItem from '@/components/mocks/AgendaItem';
import { getTheme, lightThemeColor, themeColor } from '@/components/mocks/theme';
import { APP_COLOR } from '@/utils/constant';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";
import rightArrowIcon from '@/assets/images/next.png';
import leftArrowIcon from '@/assets/images/previous.png';
import { MarkedDates } from 'react-native-calendars/src/types';
import { fetchScheduleAPI } from '@/utils/api';
import Toast from 'react-native-root-toast';
import { useCurrentApp } from '@/context/app.context';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
import SkeletonCalendarTab from '@/components/loading/skeleton.calendarTab';

const { width: screenWidth } = Dimensions.get("window");

interface Props {
    weekView?: boolean;
}

const getCurrentSemesterYear = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    let semester: number;
    let yearStr: string;

    if ((month === 8 && day >= 15) || [9, 10, 11, 12].includes(month)) {
        // Học kỳ 1 (giữa tháng 8 -> 12)
        semester = 1;
        yearStr = `${year}`;
    } else if ([1, 2, 3, 4, 5].includes(month)) {
        // Học kỳ 2 (đầu năm nhưng của năm học trước)
        semester = 2;
        yearStr = `${year - 1}`;
    } else {
        // Học kỳ 3 (từ 1/6 đến 14/8, của năm học trước)
        semester = 3;
        yearStr = `${year - 1}`;
    }

    return `${yearStr}${semester}`;
};

const generateSemesterOptions = (currentSemesterYear: string) => {
    const currentYear = parseInt(currentSemesterYear.slice(0, 4), 10);
    const options: { label: string; value: string }[] = [];

    for (let y = currentYear - 2; y <= currentYear + 1; y++) {
        for (let sem = 1; sem <= 3; sem++) {
            options.push({
                label: `${y} - Học kỳ ${sem}`,
                value: `${y}${sem}`,
            });
        }
    }
    return options.sort((a, b) => b.value.localeCompare(a.value));
};


const CalendarPrivate = ({ weekView }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<IScheduleSection[]>([]);
    const [semesterYear, setSemesterYear] = useState<string>(getCurrentSemesterYear());
    const { appState } = useCurrentApp()

    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor,
    });

    const semesterOptions = useMemo(() => generateSemesterOptions(semesterYear), [semesterYear]);

    const renderItem = useCallback(({ item }: { item: IScheduleItem }) => {
        return (
            <View style={{ paddingTop: 0 }}>
                <AgendaItem item={item} />
            </View>
        );
    }, []);

    const markedDates: MarkedDates = schedule.reduce((acc, section) => {
        if (section.data && section.data.length > 0) {
            acc[section.title] = {
                marked: true,
                dotColor: APP_COLOR.DARK_BLUE,
                selectedColor: APP_COLOR.DARK_BLUE,
            };
        }
        return acc;
    }, {} as MarkedDates);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setIsLoading(true);
                if (appState?.mybk.token && appState.mybk.cookies.SESSION) {
                    const res = await fetchScheduleAPI(appState?.mybk.token, appState?.mybk.cookies.SESSION, semesterYear);
                    // console.log("SCHEDULE RESPONSE:", res);
                    if (res?.data && Array.isArray(res.data)) {
                        setSchedule(res.data);
                    } else {
                        Toast.show("Can't get schedule", {
                            duration: Toast.durations.LONG,
                            textColor: "white",
                            backgroundColor: "red",
                            position: Toast.positions.BOTTOM,
                        });
                    }
                } else {
                    Toast.show("Can't get token or SESSION", {
                        duration: Toast.durations.LONG,
                        textColor: "white",
                        backgroundColor: "red",
                        position: Toast.positions.BOTTOM,
                    });
                }
            } catch (err) {
                Toast.show("Error fetching schedule", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    position: Toast.positions.BOTTOM,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, [semesterYear]);

    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Học kỳ</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={semesterYear}
                        onValueChange={(value) => setSemesterYear(value)}
                        style={styles.picker}
                        dropdownIconColor={APP_COLOR.DARK_BLUE}
                    >
                        {semesterOptions.map((opt) => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                    </Picker>
                </View>
            </View>
            {isLoading ? (
                <SkeletonCalendarTab />
            ) : schedule.length > 0 ? (
                <CalendarProvider
                    date={schedule[0].title}
                    showTodayButton
                    theme={todayBtnTheme.current}
                >
                    {weekView ? (
                        <WeekCalendar
                            firstDay={1}
                            markedDates={markedDates}
                        />
                    ) : (
                        <ExpandableCalendar
                            theme={theme.current}
                            firstDay={1}
                            markedDates={markedDates}
                            leftArrowImageSource={leftArrowIcon}
                            rightArrowImageSource={rightArrowIcon}
                        />
                    )}

                    <AgendaList
                        sections={schedule}
                        renderItem={renderItem}
                        sectionStyle={styles.section}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                    />
                </CalendarProvider>
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Không có dữ liệu lịch học</Text>
                </View>
            )}
        </>
    );
};

export default CalendarPrivate;

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        backgroundColor: 'lightgrey',
    },
    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 0.6,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: APP_COLOR.DARK_BLUE,
        marginRight: 8,
    },
    pickerWrapper: {
        width: screenWidth * 0.8,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        height: 42,
        paddingHorizontal: 8,
    },
    picker: {
        width: '100%',
        color: '#333',
        fontSize: 15,
    },
});
