import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import axios from "axios";

const API_URL = "http://10.141.213.51:3000"; // Update with your backend URL

export default function HomeScreen() {
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    // Listen for user responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response.actionIdentifier === "YES_ACTION") {
          console.log("User clicked YES, sending response...");
          await handleUserResponse("yes");
        } else if (response.actionIdentifier === "NO_ACTION") {
          console.log("User clicked NO, stopping notifications.");
          await handleUserResponse("no");
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // Fetch message from backend
  const fetchMessage = async () => {
    try {
      const response = await axios.get(`${API_URL}/getMessage`);
      return response.data.message; // Ensure backend sends { message: "text" }
    } catch (error) {
      console.error("Error fetching message:", error);
      return "are you seat in the chair ";
    }
  };

  // Handle user response
  const handleUserResponse = async (response) => {
    try {
      await axios.post(`${API_URL}/respond`, { response });
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  // Schedule Notification for 1 minute
  const scheduleNotification = async () => {
    const message = await fetchMessage();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Notification",
        body: message,
        categoryIdentifier: "message",
      },
      trigger: { seconds: 20 }, // Triggers in 1 minute
    });

    setNotificationId(id);

    // If the user doesn't respond within 1 minute, mark them as inactive
    setTimeout(async () => {
      if (notificationId) {
        console.log("User did not respond, marking inactive...");
        await handleUserResponse("inactive");
      }
    }, 600); // 1 minute
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Expo Notification Example</Text>
      <Button title="Start Notifications" onPress={scheduleNotification} />
    </View>
  );
}

// Expo Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
