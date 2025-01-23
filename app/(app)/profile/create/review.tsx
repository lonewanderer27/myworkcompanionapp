import { db } from "@/app/_layout";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import profileSessions from "@/db/schema/profileSessions";
import useSessionProfile from "@/hooks/useSessionProfile";
import { Button, Text } from "@ui-kitten/components";
import { eq } from "drizzle-orm";
import { router } from "expo-router";

export default function ReviewProfileScreen() {
  const { data, refetch, existingSession } = useSessionProfile();

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

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Text>
      </Text>
      <Button size="large" onPress={handleCompleteSessionProfile} style={{ marginTop: 20 }}>
        Save Changes
      </Button>
    </ThemedScrollView>
  )
}