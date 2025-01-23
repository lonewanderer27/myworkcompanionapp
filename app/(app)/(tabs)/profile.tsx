import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@ui-kitten/components';
import { router } from 'expo-router';
import { db } from '@/app/_layout';
import profileSessions from '@/db/schema/profileSessions';
import DEFAULT_SESSION_PROFILE from '@/constants/SessionProfile';
import useSessionProfile from '@/hooks/useSessionProfile';

export default function TabProfileScreen() {
  const { hasPreviousSession, previousSession, existingSession, hasExistingSession, refetch } = useSessionProfile();

  const createSessionProfile = async () => {
    console.log("Creating new profile session...");


    // if there is an existing session that's completed
    // then we copy the data from that session over to the new one
    if (hasPreviousSession) {
      await db.insert(profileSessions).values({
        data: JSON.stringify(previousSession!.data),
      });
    } else {
      // otherwise, just create a session with default values
      await db.insert(profileSessions).values({
        data: JSON.stringify(DEFAULT_SESSION_PROFILE),
      });
    }

    // refetch so we have updated data
    await refetch();
  }

  const handleAddSessionProfile = async () => {
    // refetch our data
    await refetch()

    if (!hasExistingSession) {
      await createSessionProfile();
    }

    router.push("/(app)/profile/create/name");
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
        Update Profile
      </Button>
      <Button size="large" onPress={createSessionProfile} style={{ marginTop: 20 }}>
        Force create new Profile
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
