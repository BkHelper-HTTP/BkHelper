import { timelineEvents } from '@/components/mocks/timelineEvents';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const HomePage = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const eventsByDate = useMemo(() => {
        const grouped: { [date: string]: typeof timelineEvents } = {};

        timelineEvents.forEach((event) => {
            // lấy phần ngày từ start (ISO format)
            const dateKey = event.start.split('T')[0];
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(event);
        });

        return grouped;
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true },
                }}
            />
            {/* <TimelineList events={{ [selectedDate]: eventsByDate[selectedDate] || [] }} /> */}
        </View>
    );
};

export default HomePage;
