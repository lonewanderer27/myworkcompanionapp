import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Button, Card, Divider, Text } from "@ui-kitten/components";
import useJob from "@/hooks/useJob";
import { Linking, ScrollView, View } from "react-native";
import React, { useMemo } from "react";
import useLocations from "@/hooks/useLocations";
import { IconSymbol } from "@/components/ui/IconSymbol";
import WorkMode from "@/enums/WorkMode";
import * as changeCase from "change-case";
import useJobLogs from "@/hooks/useJobLogs";
import Chip from "@/components/Chip";
import useJobStatus from "@/hooks/useJobStatus";

export default function JobScreen() {
  const { jobId } = useLocalSearchParams();
  const { data: jobData, isLoading } = useJob(Number(jobId));
  const { data: jobLogsData } = useJobLogs(Number(jobId), 3);
  const { data: jobStatuses } = useJobStatus();
  const locations = useLocations();

  const handleEdit = () => {
    router.push(`/(app)/jobs/${jobId}/update`)
  }

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

  const glassdoorUrl = useMemo(() => {
    if (!jobData) return null;
    return jobData![0].companies.glassdoorUrl;
  }, [jobData])

  const companyUrl = useMemo(() => {
    if (!jobData) return null;
    return jobData![0].companies.website;
  }, [jobData])

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url);
  }

  const currentJobStatus = useMemo(() => {
    if (!jobLogsData || !jobStatuses) return null;
    return jobStatuses?.find(js => js.id === jobLogsData!.at(-1)?.job_application_logs.jobApplicationStatusId)
  }, [jobData,])

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
      {jobLogsData && jobLogsData.length > 0 && <>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: -5 }}>
            <Text category="h5">
              Status Logs
            </Text>
            <View style={{ marginTop: -5 }}>
              <Chip>
                <Text>
                  Latest: {changeCase.capitalCase(currentJobStatus?.name + "")}
                </Text>
              </Chip>
            </View>
          </View>
          <ScrollView horizontal style={{ marginTop: 15 }}>
            {jobLogsData?.map((jl, index) => (
              <Card key={index} style={{ maxWidth: 275, marginRight: 10 }}>
                <Text appearance="hint">
                  {jl.job_application_logs.me == false ? "Re: " : "You: "}
                  {jl.job_application_logs.summary + "\n"}
                </Text>
                <Text numberOfLines={4}>
                  {String(jl.job_application_logs.description).replace("\n\n", " ").replace("\n", "")}
                </Text>
              </Card>
            ))}
            <Card style={{ maxWidth: 275, marginRight: 10, justifyContent: "center" }}>
              <Text numberOfLines={2}>
                View
                More
              </Text>
            </Card>
          </ScrollView>
        </View>
        <Divider />
      </>}
      {
        hasDescription && <>
          <View style={{ padding: 20 }}>
            <Text category="h5">
              Full Job Description
            </Text>
            <Text style={{ marginTop: 10 }}>
              {jobData![0].job_applications.description}
            </Text>
          </View>
          <Divider />
        </>
      }
      {
        workLocation && <>
          <View style={{ padding: 20, }}>
            <Text category="h5">
              Location
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <IconSymbol name="map" size={24} color="gray" />
              <View style={{ marginTop: 2, marginLeft: 5 }}>
                <Text>
                  {workLocation.city}
                </Text>
              </View>
            </View>
          </View>
          <Divider />
        </>
      }
      <View style={{ padding: 20 }}>
        <Text category="h5">
          Employer
        </Text>
        <Text>
          Check out few details about {jobData![0].companies.name}
        </Text>
        {companyUrl &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="link" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Website
              </Text>
              <Text
                style={{ textDecorationLine: "underline", marginTop: 5 }}
                onPress={() => handleOpenUrl(companyUrl)}>
                {companyUrl}
              </Text>
            </View>
          </View>}
        {glassdoorUrl &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="link" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Glassdoor
              </Text>
              <Text
                style={{ textDecorationLine: "underline", marginTop: 5 }}
                onPress={() => handleOpenUrl(glassdoorUrl)}>
                {glassdoorUrl}
              </Text>
            </View>
          </View>}
      </View>
      <Divider />
      <View style={{ padding: 20 }}>
        <Button size="large" onPress={handleEdit}>
          Edit Job Details
        </Button>
      </View>
    </ThemedScrollView >
  )
}