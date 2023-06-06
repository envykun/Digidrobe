import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { initDatabase } from "@Database/database";
import { SnackbarContextProvider } from "@Context/SnackbarContext";
import { SnackbarWrapper } from "@Components/Snackbar/SnackbarWrapper";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetContainer } from "@Components/Modal/BottomSheetContainer";
import { BottomSheetContextProvider } from "@Context/BottomSheetContext";
import { initializeSettings } from "@Hooks/useAsyncStorage";
import RootNavigator from "@Routes/RootNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await initializeSettings();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      console.info("Data initialized.");
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SnackbarContextProvider>
      <BottomSheetContextProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <BottomSheetContainer />
          <SnackbarWrapper />
        </View>
      </BottomSheetContextProvider>
    </SnackbarContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
