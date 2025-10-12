import AgendaItem from '@/components/mocks/AgendaItem';
import { getTheme, lightThemeColor, themeColor } from '@/components/mocks/theme';
import { APP_COLOR } from '@/utils/constant';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";
import rightArrowIcon from '@/assets/images/next.png';
import leftArrowIcon from '@/assets/images/previous.png';
import { MarkedDates } from 'react-native-calendars/src/types';
import { fetchScheduleAPI } from '@/utils/api';
import Toast from 'react-native-root-toast';

interface Props {
    weekView?: boolean;
}

const CalendarTab = ({ weekView }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<IScheduleSection[]>([]);

    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor,
    });

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
                const res = await fetchScheduleAPI("thinh.nguyenhoquoc", "@Thinh7020", "20251");
                console.log("SCHEDULE RESPONSE:", res);
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
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {!isLoading && schedule.length > 0 ? (
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
                    <Text>Đang tải lịch...</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CalendarTab;

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
});
