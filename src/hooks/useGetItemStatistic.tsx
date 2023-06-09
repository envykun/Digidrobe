import { getDatabase } from "@Database/database";
import { getWardrobeWears } from "@Database/item";
import { eachDayOfInterval, format, parse, startOfToday, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { useEffect, useState } from "react";
import { ChartData, Dataset } from "react-native-chart-kit/dist/HelperTypes";
import { useGet } from "./useGet";

export interface StatisticData {
  month: ChartData;
  year: ChartData;
  overall: ChartData;
}

export const useGetItemStatistic = (id: string) => {
  const db = getDatabase();
  const { data: wears, isLoading } = useGet(getWardrobeWears(db, id));
  const [dataSet, setDataSet] = useState<StatisticData>();

  const today = startOfToday();

  const getFirstWear = (data?: Array<string>) => {
    if (!data) return "";
    if (data.length === 0) return "";
    const firstDate = new Date(data[0]);
    return format(firstDate, "d.M");
  };

  const dayLabels = [format(subDays(today, 30), "d.M"), ...Array.from({ length: 29 }, () => ""), format(today, "d.M")];
  const monthLabels = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  const overallLabels = [getFirstWear(wears), ...Array.from({ length: 11 }, () => ""), format(today, "d.M")];

  const dayData = Array.from({ length: 31 }, (v, i) => i);
  const monthData = Array.from({ length: 12 }, (v, i) => Math.floor(Math.random() * 10)); // length 12
  const overallData = Array.from({ length: 12 }, () => 0); // length 12

  useEffect(() => {
    if (isLoading) return;
    const data: StatisticData = {
      month: {
        labels: dayLabels,
        datasets: [{ data: dayData }],
      },
      year: { labels: monthLabels, datasets: [{ data: monthData }] },
      overall: { labels: overallLabels, datasets: [{ data: overallData }] },
    };
    setDataSet(data);
  }, [isLoading]);

  return { data: dataSet, isLoading };
};
