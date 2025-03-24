import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import axios from "axios";

// ✅ Update with your backend URL
const API_URL = "https://backend-rendered-1.onrender.com/api/realN/";

export default function HomeScreen() {
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    // ✅ Request permission for notifications
    Notifications.requestPermissionsAsync();

    // ✅ Set notification actions (Yes/No)
    Notifications.setNotificationCategoryAsync("message", [
      { identifier: "YES_ACTION", buttonTitle: "Yes" },
      { identifier: "NO_ACTION", buttonTitle: "No" },
    ]);

    // ✅ Start the first notification after 1 minute
    const timer = setTimeout(() => {
      scheduleNotification();
    }, 60000); // 1 minute (60,000 ms)

    // ✅ Cleanup function
    return () => clearTimeout(timer);
  }, []);

  // ✅ Listen for notification responses
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response.actionIdentifier === "YES_ACTION") {
          console.log("User clicked YES, sending response...");
          await handleUserResponse("yes");

          // ✅ Schedule the next notification after 1 minute
          setTimeout(() => {
            scheduleNotification();
          }, 60000); // 1 minute delay
        } else if (response.actionIdentifier === "NO_ACTION") {
          console.log("User clicked NO, stopping notifications.");
          await handleUserResponse("no");
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // ✅ Fetch latest message from backend
  const fetchMessage = async () => {
    try {
      const response = await axios.get(`${API_URL}/getMessage`);
      return response.data.message;
    } catch (error) {
      console.error("Error fetching message:", error);
      return "Are you in the chair?";
    }
  };

  // ✅ Handle user response
  const handleUserResponse = async (response) => {
    try {
      await axios.post(`${API_URL}/respond`, { response });
      Alert.alert("Response Sent", `You selected: ${response}`);
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  // ✅ Schedule Notification
  const scheduleNotification = async () => {
    const message = await fetchMessage();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Seat Reservation Check",
        body: message,
        categoryIdentifier: "message",
      },
      trigger: { seconds: 0 }, // Send immediately
    });

    setNotificationId(id);

    // ✅ If no response in 2 minutes, mark as inactive
    setTimeout(async () => {
      if (notificationId) {
        console.log("User did not respond, marking inactive...");
        await handleUserResponse("inactive");
      }
    }, 120000); // 2 minutes
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Expo Notification Example</Text>
    </View>
  );
}

// ✅ Expo Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
