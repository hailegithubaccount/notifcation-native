import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";

export default function HomeLayout() {
  useEffect(() => {
    // Request permissions for notifications
    Notifications.requestPermissionsAsync();

    // Set notification actions (Yes / No)
    Notifications.setNotificationCategoryAsync("message", [
      {
        identifier: "YES_ACTION",
        buttonTitle: "Yes",
      },
      {
        identifier: "NO_ACTION", 
        buttonTitle: "No",
      },
    ]);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
