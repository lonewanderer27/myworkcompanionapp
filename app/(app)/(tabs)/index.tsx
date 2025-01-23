import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@ui-kitten/components';
import { ThemedScrollView } from '@/components/ThemedScrollView';

export default function TabJobsScreen() {
  const handleCreateCompany = () => {
    router.push("/(app)/companies/create")
  };

  const handleCreateJob = () => {
    router.push("/(app)/jobs/create")
  }

  const handleCreateLocations = () => {
    router.push('/(app)/locations/create')
  }
  
  const handleViewCompanies = () => {
    router.push("/(app)/companies")
  }

  const handleCreateJobUpdate = () => {
    router.push("/(app)/jobLogs/create")
  }

  return (
    <ThemedScrollView style={styles.container}>
      <Button size="large" onPress={handleCreateLocations} style={{ marginTop: 20 }}>
        Add Locations
      </Button>
      <Button size="large" onPress={handleCreateCompany} style={{ marginTop: 20 }}>
        Add Company
      </Button>
      <Button size="large" onPress={handleViewCompanies} style={{ marginTop: 20 }}>
        View Companies
      </Button>
      <Button size="large" onPress={handleCreateJob} style={{ marginTop: 20 }}>
        Add Job
      </Button>
      <Button size="large" onPress={handleCreateJobUpdate} style={{ marginTop: 20 }}>
        Create Job Update
      </Button>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  createBtn: {
    bottom: 20,
    right: 20,
    position: "absolute",
    borderRadius: 10
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
