import { db } from "@/app/_layout";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import profileSessions from "@/db/schema/profileSessions";
import useSessionProfile from "@/hooks/useSessionProfile";
import { Button, Text } from "@ui-kitten/components";
import { eq } from "drizzle-orm";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as changeCase from "change-case";
import { Stack } from "expo-router";

export default function ReviewProfileScreen() {
  const { refetch, existingSession } = useSessionProfile();

  const handleCompleteSessionProfile = async () => {
    console.log("Completing current session profile...");
    await db
      .update(profileSessions)
      .set({ completed: true })
      .where(eq(profileSessions.id, existingSession!.id));
    await refetch();

    // redirect the user to the profile tab
    router.push("/(app)/(tabs)/profile");
  }

  console.log(existingSession && Object.values(existingSession));

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <Text category="h4" style={{ marginBottom: 20 }}>
        Review Changes
      </Text>
      {existingSession?.data && Object.entries(existingSession.data).filter(os => os[1] !== "").map(([key, value]) =>
        <View style={{ marginBottom: 17 }}>
          <Text category="label">{changeCase.capitalCase(key)}</Text>
          <TouchableOpacity>
            <Text
              style={{
                borderColor: "gray",
                borderWidth: 1,
                padding: 12,
                borderRadius: 5,
                marginTop: 5,
                lineHeight: 20
              }} category="p">
              {value}
            </Text>
          </TouchableOpacity>
        </View>)}
      <View style={{ paddingVertical: 30 }}>
        <Button size="large" onPress={handleCompleteSessionProfile}>
          Save Changes
        </Button>
      </View>
    </ThemedScrollView>
  )
}