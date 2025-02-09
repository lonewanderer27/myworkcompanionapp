import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Avatar, Button, Card, Icon, Input, List, Text } from '@ui-kitten/components';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { useRef, useState } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import useJobs from '@/hooks/useJobs';
import { useDebounce } from "use-debounce";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

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

  const handleViewJobApplicationLogs = () => {
    router.push("/(app)/jobLogs");
  }

  const handleCreateJobUpdate = () => {
    router.push("/(app)/jobLogs/create")
  }

  const [devopts, setDevOpts] = useState(true);
  const toggleDevOpts = () => {
    setDevOpts(val => !val);
  }

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  console.log("Debounced search: ", debouncedSearch);
  const { data: jobsData, isFetching } = useJobs(debouncedSearch);
  console.log("Jobs:\n", jobsData?.map(j => j.job_applications.id));

  if (devopts) {
    return (
      <ThemedScrollView style={{ flex: 1, padding: 20 }}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Dev Options",
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={toggleDevOpts}>
                <Text>Hide</Text>
              </TouchableOpacity>
            )
          }}
        />
        <Button size="large" onPress={handleCreateLocations}>
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
        <Button size="large" onPress={handleViewJobApplicationLogs} style={{ marginTop: 20 }}>
          View Job Logs
        </Button>
        <Button size="large" onPress={handleCreateJobUpdate} style={{ marginTop: 20 }}>
          Create Job Update
        </Button>
      </ThemedScrollView>
    )
  } else {

    const renderItem = (item: any) => {
      const handlePress = () => {
        router.push(`/(app)/jobs/${item.item.job_applications.id}`)
      }

      return (
        <Card
          style={{ marginBottom: 10 }}
          onPress={handlePress}
        >
          <View>
            {item.item.companies.avatar && <Avatar source={{ uri: item.item.companies.avatar }} />}
            <View>
              <Text category='h6' style={{ marginVertical: 5 }}>
                {item.item.job_applications.name}
              </Text>
              <Text>
                {item.item.companies.name}
              </Text>
              <Text>
                {item.item.locations.city}
              </Text>
            </View>
          </View>
        </Card>
      )
    }

    return (
      <ThemedScrollView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "MyWorkCompanion",
            headerRight: () => (
              <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleDevOpts}>
                <Text>{devopts ? "Hide" : "Show Dev"}</Text>
              </TouchableOpacity>
            )
          }}
        />
        <Input
          style={{ padding: 20 }}
          placeholder='Job title, keywords, company or location'
          value={search}
          onChangeText={sch => setSearch(sch)}
          accessoryLeft={() => isFetching ?
            <ActivityIndicator size="small" style={{ margin: 4 }} /> :
            <IconSymbol size={28} name="magnifyingglass" color="gray" />}
        />
        <List
          style={{ paddingBottom: 20, flex: 1, flexGrow: 1 }}
          data={jobsData}
          renderItem={renderItem}
          scrollEnabled={false}
          extraData={debouncedSearch}
        />
      </ThemedScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
