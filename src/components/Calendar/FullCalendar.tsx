import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import PagerView from "react-native-pager-view";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { Colors } from "@Styles/colors";

import { de } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
export interface FullCalendarProps {}

export default function FullCalendar({}: FullCalendarProps) {
  const navigation = useNavigation();
  const today = new Date();

  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { locale: de }),
  });

  useEffect(() => {
    navigation.setOptions({
      title: format(firstDayCurrentMonth, "MMMM yyyy"),
    });
  }, [navigation, firstDayCurrentMonth]);

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.header}>
        <Text>M</Text>
        <Text>D</Text>
        <Text>M</Text>
        <Text>D</Text>
        <Text>F</Text>
        <Text>S</Text>
        <Text>S</Text>
      </View>
      <PagerView style={styles.carousel} offscreenPageLimit={2} onPageSelected={nextMonth}>
        {Array.from({ length: 3 }).map((_, index) => (
          <FlatList
            key={index}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{}}
            data={days}
            numColumns={7}
            renderItem={({ item: day }) => (
              <CalendarDayItem date={day} isSelected={isEqual(day, selectedDay)} onPress={() => setSelectedDay(day)} />
            )}
          />
        ))}
      </PagerView>
    </View>
  );
}

interface CalendarDayItemProps {
  date: Date;
  isSelected: boolean;
  onPress: () => void;
}

const CalendarDayItem = ({ date, isSelected, onPress }: CalendarDayItemProps) => {
  const today = new Date();
  const day = format(date, "d");
  const isThisDay = isToday(date);
  const isThisSameMonth = isSameMonth(date, today);
  return (
    <TouchableHighlight onPress={onPress} style={styles.touchable}>
      <View style={[styles.dayItem, isSelected && !isThisDay && styles.selected]}>
        <Text style={[isThisDay && styles.today, !isThisSameMonth && styles.notSameMonth, isSelected && !isThisDay && { color: "white" }]}>
          {day}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  calendar: {
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 40,
  },
  touchable: {
    flex: 1,
    // borderWidth: 1,
    aspectRatio: 1 / 1,
  },
  dayItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flex: 1,

    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  today: {
    color: Colors.primary,
  },
  notSameMonth: {
    color: "#b1b1b1",
  },
  selected: {
    backgroundColor: Colors.primary,
  },
});
