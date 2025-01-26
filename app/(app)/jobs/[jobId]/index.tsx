import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, Divider, Text } from "@ui-kitten/components";
import useJob from "@/hooks/useJob";
import { View } from "react-native";
import React, { useMemo } from "react";
import useLocations from "@/hooks/useLocations";
import { IconSymbol } from "@/components/ui/IconSymbol";
import WorkMode from "@/enums/WorkMode";
import * as changeCase from "change-case";

export default function JobScreen() {
  const { jobId } = useLocalSearchParams();
  const { data: jobData, isLoading } = useJob(Number(jobId));
  const locations = useLocations();

  const payPerMonth = useMemo(
    () => {
      if (!jobData) return false;
      return jobData![0].job_applications.payPerMonth;
    },
    [jobData])

  const allowancePerDay = useMemo(
    () => {
      if (!jobData) return false;
      return jobData![0].job_applications.allowancePerDay;
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

  const workLocation = useMemo(() => {
    if (!jobData || !locations.data) return null;
    return locations.data.find(loc => loc.id === jobData[0].job_applications.locationId);
  }, [jobData, locations.data])

  const workMode = useMemo(() => {
    if (!jobData) return null;
    try {
      switch (Number(jobData![0].job_applications.workMode)) {
        case 0: return changeCase.capitalCase(WorkMode.HYBRID);
        case 1: return changeCase.capitalCase(WorkMode.REMOTE);
        case 2: return changeCase.capitalCase(WorkMode.ONSITE);
      }
    } catch {
      return changeCase.capitalCase(jobData![0].job_applications.workMode + "")
    }
  }, [jobData])

  const deadline = useMemo(() => {
    if (!jobData) return null;
    return jobData![0].job_applications.deadline;
  }, [jobData])

  if (isLoading) return null;

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <View style={{ padding: 20 }}>
        <Text category="h4" style={{ marginBottom: 20 }}>
          {jobData![0].job_applications.name}
        </Text>
        <Text>
          {jobData![0].companies.name} {companyLocation ? "| " + companyLocation.city : ""}
        </Text>
      </View>
      <Divider />
      <View style={{ padding: 20 }}>
        <Text category="h5">
          Job Details
        </Text>
        {allowancePerDay &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="pesosign.square.fill" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Allowance per day
              </Text>
              <Text style={{ marginTop: 5 }}>
                ₱ {allowancePerDay}
              </Text>
            </View>
          </View>}
        {payPerMonth &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="pesosign.square.fill" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Pay per month
              </Text>
              <Text style={{ marginTop: 5 }}>
                ₱ {payPerMonth}
              </Text>
            </View>
          </View>}
        {workMode &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="briefcase.fill" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Work Mode
              </Text>
              <Text style={{ marginTop: 5 }}>
                {workMode}
              </Text>
            </View>
          </View>}
        {deadline &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="clock" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Deadline
              </Text>
              <Text style={{ marginTop: 5 }}>
                {new Date(deadline).toDateString()}
              </Text>
            </View>
          </View>}
      </View>
      <Divider />
      {
        hasDescription && <View style={{ padding: 20 }}>
          <Text category="h5">
            Full Job Description
          </Text>
          <Text style={{ marginTop: 10 }}>
            {jobData![0].job_applications.description}
          </Text>
        </View>
      }
      <Divider />
      {
        workLocation && <>
          <View style={{ padding: 20 }}>
            <Text category="h5">
              Location
            </Text>
            <Text style={{ marginTop: 10 }}>
              {workLocation.city}
            </Text>
          </View>
          <Divider />
        </>
      }
      <View style={{ padding: 20 }}>
        <Button size="large">
          Edit Job Details
        </Button>
      </View>
    </ThemedScrollView >
  )
}