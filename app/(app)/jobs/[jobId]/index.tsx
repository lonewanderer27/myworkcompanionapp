import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Button, Divider, Text } from "@ui-kitten/components";
import useJob from "@/hooks/useJob";
import { View } from "react-native";
import React, { useMemo } from "react";
import useLocations from "@/hooks/useLocations";

export default function JobScreen() {
  const { jobId } = useLocalSearchParams();
  const { data: jobData, isLoading } = useJob(Number(jobId));
  const locations = useLocations();

  const hasAllowance = useMemo(
    () => {
      if (!jobData) return false;
      return jobData![0].job_applications.allowancePerMonth !== 0;
    },
    [jobData])

  const hasDescription = useMemo(() => {
    if (!jobData) return false;
    return jobData![0].job_applications.description.length !== 0;
  },
    [jobData])

  const companyLocation = useMemo(() => {
    if (!jobData || !locations.data) return null;
    return locations.data.find(loc => loc.id === jobData[0].companies.locationId);
  }, [jobData, locations.data])

  if (isLoading) return null;

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <View style={{ padding: 20 }}>
        <Text category="h3" style={{ marginBottom: 20 }}>
          {jobData![0].job_applications.name}
        </Text>
        <Text>
          {jobData![0].companies.name} { companyLocation ? "| "+companyLocation.city : "" }
        </Text>
      </View>
      <Divider />
      {hasDescription && <View style={{ padding: 20 }}>
        <Text category="h5">
          Job Description
        </Text>
        <Text style={{ marginTop: 10 }}>
          {jobData![0].job_applications.description}
        </Text>
      </View>}
      <Divider />
      {hasAllowance && <>
        <View style={{ padding: 20 }}>
          <Text category="h5">
            Allowance
          </Text>
          <Text style={{ marginTop: 10 }}>
            PHP {jobData![0].job_applications.allowancePerMonth!}
          </Text>
        </View>
        <Divider />
      </>}
      <View style={{ padding: 20 }}>
        <Button size="large">
          Edit Job Details
        </Button>
      </View>
    </ThemedScrollView>
  )
}