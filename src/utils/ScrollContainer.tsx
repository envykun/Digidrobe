import { useNavigation } from "@react-navigation/native";
import { PropsWithChildren } from "react";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { headerOnScrollTransition } from "./helperFunctions";
import { useHeaderHeight } from "@react-navigation/elements";
import { layout } from "@Styles/global";

export interface ScrollContainerProps {
  isLoading?: boolean;
  refetch?: () => void;
  headerTintColor?: string;
  hideTitle?: boolean;
  disableRefresh?: boolean;
  headerTransparent?: boolean;
  headerBackgroundColor?: string;
}

export function ScrollContainer({
  children,
  isLoading = false,
  refetch,
  headerTintColor,
  hideTitle = false,
  disableRefresh,
  headerTransparent = true,
  headerBackgroundColor,
}: PropsWithChildren<ScrollContainerProps>) {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  return (
    <SafeAreaView>
      <ScrollView
        style={[layout.scrollContainer]}
        showsVerticalScrollIndicator={false}
        onLayout={(e) => {
          navigation.setOptions({
            headerTransparent: headerTransparent,
            headerTintColor: headerTintColor,
          });
        }}
        refreshControl={disableRefresh ? undefined : <RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        onScroll={(event) => headerOnScrollTransition({ event, navigation, headerHeight, headerBackgroundColor: headerBackgroundColor })}
        contentInsetAdjustmentBehavior="never"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
