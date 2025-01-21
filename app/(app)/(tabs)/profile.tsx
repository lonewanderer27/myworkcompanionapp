import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@ui-kitten/components';
import { router } from 'expo-router';
import { db } from '@/app/_layout';
import profileSessions from '@/db/schema/profileSessions';
import DEFAULT_SESSION_PROFILE from '@/constants/SessionProfile';
import useSessionProfile from '@/hooks/useSessionProfile';

export default function TabProfileScreen() {
  const profileSess = useSessionProfile();

  const createSessionProfile = async () => {
    console.log("Creating new profile session...")
    await db.insert(profileSessions).values({
      data: JSON.stringify(DEFAULT_SESSION_PROFILE)
    });
    await profileSess.refetch();
  }

  const handleAddSessionProfile = async () => {
    // refetch our data
    const res = await profileSess.refetch()

    // check if the profile sessions row is empty
    if (res.data?.length == 0) {
      return await createSessionProfile();
    }

    // if it's not empty, then check the last row
    // if the column: completed is false
    if (res.data?.at(-1)?.completed == false) {
      // if yes, warn in the log that we're going to continue
      // where the last session left off
      console.log("There's an existing, incomplete session. Continuing from that...")
      console.log(res.data.at(-1)?.data)
    } else {
      // if no, proceed as usual, we're going to create a new session profile
      await createSessionProfile();
    }
  }

  const handleAddProfileName = () => {
    router.push("/(app)/profile/create/name");
  };

  const handleAddProfileDesc = () => {
    router.push("/(app)/profile/create/description");
  }

  const handleAddProfileContact = () => {
    router.push("/(app)/profile/create/contact");
  }

  return (
    <ThemedView style={styles.container}>
      <Button size="large" onPress={handleAddSessionProfile} style={{ marginTop: 20 }}>
        New Profile
      </Button>
      <Button size="large" onPress={handleAddProfileName} style={{ marginTop: 20 }}>
        Add Name
      </Button>
      <Button size="large" onPress={handleAddProfileDesc} style={{ marginTop: 20 }}>
        Add Career Profile
      </Button>
      <Button size="large" onPress={handleAddProfileContact} style={{ marginTop: 20 }}>
        Add Contact
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
});
