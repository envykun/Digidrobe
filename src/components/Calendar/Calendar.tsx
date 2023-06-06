import { View, Text, Dimensions, StyleSheet, FlatList } from "react-native";
import { Octicons } from "@expo/vector-icons";
import CalendarDateItem from "./CalendarDateItem";
import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { addDays, eachDayOfInterval, format, getDate, isBefore, isEqual, isSameDay, isToday, subDays } from "date-fns";
import DigiButton from "@Components/Button/DigiButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { de } from "date-fns/locale";
import { RootStackParamList } from "@Routes/Navigator.interface";

interface CalendarProps {
  today: Date;
  selectedDate: Date;
  onChange?: (date: Date) => void;
}

export default function Calendar({ today, selectedDate, onChange }: CalendarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const currentMonthYear = format(today, "MMMM yyyy", { locale: de });
  const [itemWidth, setItemWidth] = useState(0);
  const carouselRef = createRef<FlatList>();

  const handleDateSelect = (day: Date) => {
    onChange && onChange(day);
  };

  const dates: Array<Date> = eachDayOfInterval({
    start: subDays(today, 11),
    end: addDays(today, 18),
  });

  const scrollToToday = () => {
    carouselRef.current?.scrollToIndex({ animated: true, index: dates.findIndex((day) => isToday(day)) - 1 });
    onChange && onChange(today);
  };

  useEffect(() => {
    scrollToToday();
  }, [isFocused]);
  return (
    <View style={styles.calendarBox}>
      <View style={styles.dateText}>
        <Text style={{ fontSize: 16 }} onPress={scrollToToday}>
          {currentMonthYear}
        </Text>
        <DigiButton title="Calendar" onPress={() => navigation.navigate("Calendar")} variant="text" />
      </View>
      <View style={styles.carouselWrapper}>
        <Octicons name="chevron-left" size={24} color={"black"} />
        <View style={styles.carousel} onLayout={(event) => setItemWidth(event.nativeEvent.layout.width / 5)}>
          <FlatList
            ref={carouselRef}
            horizontal
            pagingEnabled
            data={dates}
            initialNumToRender={100}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                carouselRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
            renderItem={({ item: day }: { item: Date }) => (
              <CalendarDateItem
                key={day.toString()}
                date={getDate(day)}
                day={format(day, "EE", { locale: de })}
                current={isToday(day)}
                selected={isSameDay(selectedDate, day)}
                past={isBefore(day, today) && !isToday(day)}
                onPress={() => handleDateSelect(day)}
                width={itemWidth}
              />
            )}
          />
        </View>
        <Octicons name="chevron-right" size={24} color={"black"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarBox: {
    width: Dimensions.get("window").width,
    height: "100%",
    flex: 1,
    paddingVertical: 16,
  },
  carousel: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  dateText: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselWeek: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  carouselWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
});
