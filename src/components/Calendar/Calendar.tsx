import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";
import CalendarDateItem from "./CalendarDateItem";
import { useState } from "react";
import PagerView from "react-native-pager-view";
import { addDays, compareAsc, eachDayOfInterval, subDays } from "date-fns";
import DigiButton from "@Components/Button/DigiButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface CalendarProps {
  onChange?: (date: Date) => void;
}

export default function Calendar({ onChange }: CalendarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentMonthYear = currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [position, setPosition] = useState<number>(2);

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    onChange && onChange(day);
  };

  const dates = eachDayOfInterval({
    start: subDays(currentDate, 11),
    end: addDays(currentDate, 18),
  });

  const renderFiveDaysPage = () => {
    const mappedDays = dates.reduce((all: Date[][], one, idx) => {
      const chunk = Math.floor(idx / 5);
      if (!all[chunk]) {
        all[chunk] = [];
      }
      all[chunk].push(one);
      return all;
    }, []);

    return mappedDays.map((days, z) => (
      <View key={`${z}`} style={styles.carouselWeek}>
        {days.map((day, i) => {
          const comparedDate = compareAsc(currentDate, day);
          return (
            <CalendarDateItem
              key={day.toString()}
              date={day.getDate()}
              day={day.toLocaleDateString(undefined, { weekday: "short" }).substring(0, 3)}
              current={comparedDate === 0}
              selected={compareAsc(selectedDate, day) === 0}
              past={comparedDate === 1}
              onPress={() => handleDateSelect(day)}
            />
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.calendarBox}>
      <View style={styles.dateText}>
        <Text style={{ fontSize: 16 }}>{currentMonthYear}</Text>
        <DigiButton title="Calendar" onPress={() => navigation.navigate("Calendar")} variant="text" />
      </View>
      <View style={styles.carousel}>
        <Octicons name="chevron-left" size={24} color={position === 0 ? "lightgrey" : "black"} />
        <PagerView
          initialPage={position}
          style={{ height: "100%", flexGrow: 1 }}
          onPageSelected={(e) => setPosition(e.nativeEvent.position)}
        >
          {renderFiveDaysPage()}
        </PagerView>
        <Octicons name="chevron-right" size={24} color={position === 5 ? "lightgrey" : "black"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarBox: {
    width: Dimensions.get("window").width,
    // height: 80,
    marginVertical: 16,
  },
  carousel: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
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
});
