import { Alert, ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Button, Tab, TabBar, TabView } from '@ui-kitten/components';
import { router } from 'expo-router';
import { db } from '@/app/_layout';
import profileSessions from '@/db/schema/profileSessions';
import DEFAULT_SESSION_PROFILE from '@/constants/SessionProfile';
import useSessionProfile from '@/hooks/useSessionProfile';
import { useState } from 'react';

export default function TabProfileScreen() {
  const [devopts, setDevOpts] = useState(true);
  const toggleDevOpts = () => {
    setDevOpts(val => !val);
  }
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

  const alertNoSession = () => {
    Alert.alert('Session Error', 'No existing session found. Please create a new session profile.');
  };

  const handleSetProfileName = () => {
    if (!existingSession) {
      alertNoSession();
      return;
    }
    router.push("/(app)/profile/create/name");
  };

  const handleSetProfileDesc = () => {
    if (!existingSession) {
      alertNoSession();
      return;
    }
    router.push("/(app)/profile/create/description");
  }

  const handleSetProfileContact = () => {
    if (!existingSession) {
      alertNoSession();
      return;
    }
    router.push("/(app)/profile/create/contact");
  }

  const handleReviewProfile = () => {
    if (!existingSession) {
      alertNoSession();
      return;
    }
    router.push("/(app)/profile/create/review");
  }

  const handleAddInstitution = () => {
    router.push("/(app)/institutions/create")
  }

  const handleAddSkillCategory = () => {
    router.push("/(app)/skills/category/create")
  }

  if (devopts) {
    return (
      <ThemedView style={styles.container}>
        <Button size="large" onPress={handleAddSessionProfile} style={{ marginTop: 20 }}>
          Update Profile
        </Button>
        <Button size="large" onPress={createSessionProfile} style={{ marginTop: 20 }}>
          Force create new Session Profile
        </Button>
        <Button size="large" onPress={handleSetProfileName} style={{ marginTop: 20 }}>
          Set Name
        </Button>
        <Button size="large" onPress={handleSetProfileDesc} style={{ marginTop: 20 }}>
          Set Career Profile
        </Button>
        <Button size="large" onPress={handleSetProfileContact} style={{ marginTop: 20 }}>
          Set Contact
        </Button>
        <Button size="large" onPress={handleReviewProfile} style={{ marginTop: 20 }}>
          Review Profile
        </Button>
        <Button size="large" onPress={handleAddInstitution} style={{ marginTop: 20 }}>
          Add Institution
        </Button>
        <Button size="large" onPress={handleAddSkillCategory} style={{ marginTop: 20 }}>
          Add Skill Category
        </Button>
        <Button size="large" onPress={toggleDevOpts} style={{ marginTop: 20 }}>
          Disable Dev Tools
        </Button>
      </ThemedView>
    );
  } else {
    return (
      <ThemedView style={styles.container}>
        <Button size="large" onPress={toggleDevOpts} style={{ marginTop: 20 }}>
          Enable Dev Tools
        </Button>
      </ThemedView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
});
