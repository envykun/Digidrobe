import { PropsWithChildren } from "react";
import { Text, View, StyleSheet } from "react-native";

interface DetailProps {
  label: string;
  value?: string | number;
  suffix?: string;
  editable?: boolean;
}
export default function Detail({ label, value, suffix, editable, children }: PropsWithChildren<DetailProps>) {
  return (
    <View style={styles.detail}>
      <Text style={{ fontSize: 16, fontWeight: "100" }}>{label}</Text>
      <Text style={{ fontSize: 16, maxWidth: 240 }}>
        {value ?? (!children && "-")}
        {value || value === 0 ? suffix : null}
      </Text>
      {children && <View style={styles.children}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    gap: 16,
  },
  children: {
    flexDirection: "row",
    gap: 4,
  },
});
