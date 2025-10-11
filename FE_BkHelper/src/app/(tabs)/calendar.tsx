import AgendaItem from '@/components/mocks/AgendaItem';
import { agendaItems } from '@/components/mocks/agendaItems';
import testIDs from '@/components/mocks/tetsIDs';
import { getTheme, lightThemeColor, themeColor } from '@/components/mocks/theme';
import { APP_COLOR } from '@/utils/constant';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar, WeekCalendar } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";

import rightArrowIcon from '@/assets/images/next.png';
import leftArrowIcon from '@/assets/images/previous.png';
import { MarkedDates } from 'react-native-calendars/src/types';

interface Props {
    weekView?: boolean;
}

const CalendarTab = (props: Props) => {
    const ITEMS: any[] = agendaItems;
    const { weekView } = props;

    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor
    });

    const renderItem = useCallback(({ item }: any) => {
        const isLongItem = item.itemCustomHeightType === 'LongEvent';
        return <View style={{ paddingTop: isLongItem ? 40 : 0 }}><AgendaItem item={item} /></View>;
    }, []);

    const markedDates = ITEMS.reduce((acc: MarkedDates, section: any) => {
        if (section.data && section.data.length > 0) {
            acc[section.title] = {
                marked: true,
                dotColor: APP_COLOR.DARK_BLUE,
                selectedColor: APP_COLOR.DARK_BLUE,
            };
        }
        return acc;
    }, {});


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CalendarProvider
                date={ITEMS[1]?.title}
                showTodayButton
                theme={todayBtnTheme.current}
            >
                {weekView ? (
                    <WeekCalendar
                        testID={testIDs.weekCalendar.CONTAINER}
                        firstDay={1}
                        markedDates={markedDates}
                    />
                ) : (
                    <ExpandableCalendar
                        testID={testIDs.expandableCalendar.CONTAINER}
                        theme={theme.current}
                        firstDay={1}
                        markedDates={markedDates}
                        leftArrowImageSource={leftArrowIcon}
                        rightArrowImageSource={rightArrowIcon}
                    />
                )}
                <AgendaList
                    sections={ITEMS}
                    renderItem={renderItem}
                    sectionStyle={styles.section}
                    infiniteListProps={
                        {
                            itemHeight: 80,
                            titleHeight: 50,
                            itemHeightByType: {
                                LongEvent: 120
                            }
                        }
                    }
                    initialNumToRender={5}
                    removeClippedSubviews
                />
            </CalendarProvider>
        </SafeAreaView>
    )
}
export default CalendarTab

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        backgroundColor: 'lightgrey'
    },
    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize'
    }
});