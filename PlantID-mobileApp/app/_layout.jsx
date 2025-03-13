import { Stack } from "expo-router";
import { useEffect } from "react";
import { InteractionManager } from "react-native";
import { GeoProvider } from "./context";

export default function RootLayout() {
  useEffect(() => {
    const startTime = performance.now();

    
    InteractionManager.runAfterInteractions(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`App full render time: ${renderTime.toFixed(2)} ms`);
    });
  }, []);

  return (
    <GeoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="mainScreen" />
        <Stack.Screen name="mapScreen" />
        <Stack.Screen name="photoScreen" />
        <Stack.Screen name="cameraScreen" options={{ headerShown: false }} />
      </Stack>
    </GeoProvider>
  );
}
