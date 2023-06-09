import { Dimensions, View, Text, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

interface DigiLineChartProps {
  chartData: LineChartData;
  chartConfig?: AbstractChartConfig;
}

export default function DigiLineChart({ chartData, chartConfig }: DigiLineChartProps) {
  return (
    <ScrollView horizontal>
      <LineChart
        data={chartData}
        width={Dimensions.get("screen").width}
        height={240}
        fromZero
        bezier
        yAxisSuffix="x"
        yLabelsOffset={20}
        xLabelsOffset={16}
        verticalLabelRotation={270}
        chartConfig={
          chartConfig ?? {
            backgroundColor: "rgb(216, 181, 111)",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "rgb(255, 255, 255)",
            decimalPlaces: 0,
            color: (opacity) => `rgba(216, 181, 111, ${opacity})`,
            labelColor: () => "#7a7a7a",
            strokeWidth: 2,
            style: {},
          }
        }
        segments={4}
        style={{
          marginVertical: 16,
          borderRadius: 8,
        }}
        withDots={false}
        withOuterLines={false}
      />
    </ScrollView>
  );
}
