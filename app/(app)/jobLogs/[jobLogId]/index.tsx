
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { ThemedScrollView } from "@/components/ThemedScrollView";
import useCompany from "@/hooks/useCompany";
import useJobLog from "@/hooks/useJobLog";
import { Divider, Text, Button } from "@ui-kitten/components";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import * as changeCase from "change-case";
import { useMemo } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";

dayjs.extend(relativeTime)

export default function JobLogScreen() {
  const { jobLogId } = useLocalSearchParams<{ jobLogId: string }>();
  const { data: jobLogData } = useJobLog(Number(jobLogId));
  const { data: companyData } = useCompany(jobLogData ? jobLogData![0].job_applications.companyId : undefined);

  const currentJobStatus = useMemo(() => {
    if (!jobLogData) return null;
    return jobLogData[0].job_application_statuses;
  }, [jobLogData])

  const handleEdit = () => router.push(`/(app)/jobLogs/${jobLogData![0].job_application_logs.id}/update`)

  if (!jobLogData || !companyData) return null;

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <View style={{ padding: 20 }}>
        <Text category="h4" style={{ marginBottom: 20 }}>
          {jobLogData[0].job_application_logs.me ? "You: " : "Re: "}
          {jobLogData![0].job_application_logs.summary}
        </Text>
        <Text>
          {jobLogData![0].job_applications.name}
        </Text>
        <Text>
          {companyData![0].companies.name} | {companyData![0].locations.city}
        </Text>
      </View>
      <Divider />
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <IconSymbol
            name="person"
            size={36}
            color="white"
            style={{
              padding: 5,
              backgroundColor: "gray",
              borderRadius: 100,
              marginRight: 15
            }}
          />
          <View>
            <Text category="h6">
              {jobLogData[0].job_application_logs.me ?
                "Adriane James Puzon" : "Recruiter"}
            </Text>
            <Text>
              {new Date(jobLogData[0].job_application_logs.updatedAt).toDateString()}
              {" "}({dayjs().to(dayjs(jobLogData[0].job_application_logs.updatedAt))})
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: 20 }}>
          {jobLogData[0].job_application_logs.description}
        </Text>
      </View>
      <Divider />
      <View style={{ padding: 20 }}>
        <Text category="h5">
          Log Details
        </Text>
        {currentJobStatus &&
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <IconSymbol name="star" size={24} color="gray" />
            <View style={{ flex: 1, marginTop: 3, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>
                Status
              </Text>
              <Text style={{ marginTop: 5 }}>
                {changeCase.capitalCase(currentJobStatus.name)}
              </Text>
            </View>
          </View>}
      </View>
      <Divider />
      <View style={{ padding: 20 }}>
        <Button size="large" onPress={handleEdit}>
          Edit Job Log
        </Button>
      </View>
    </ThemedScrollView >
  )
}