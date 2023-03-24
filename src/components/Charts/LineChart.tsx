import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

interface DigiLineChartProps {
  chartData: LineChartData;
  chartConfig?: AbstractChartConfig;
}

export default function DigiLineChart({ chartData, chartConfig }: DigiLineChartProps) {
  return (
    <LineChart
      data={chartData}
      width={Dimensions.get("window").width - 16}
      height={220}
      fromZero
      bezier
      yAxisSuffix="x"
      yAxisInterval={1}
      yLabelsOffset={20}
      onDataPointClick={(data) => console.log("CLICKED POINT", data.value)}
      chartConfig={
        chartConfig ?? {
          backgroundColor: "rgb(216, 181, 111)",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "rgb(255, 255, 255)",
          decimalPlaces: 0,
          color: (opacity) => `rgba(216, 181, 111, ${opacity})`,
          labelColor: () => "#000000",
          strokeWidth: 2,
          style: {},
        }
      }
      segments={3}
      style={{
        marginVertical: 16,
        borderRadius: 8,
        elevation: 2,
      }}
    />
  );
}
