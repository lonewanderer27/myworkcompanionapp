
import { ThemedScrollView } from "@/components/ThemedScrollView";
import useCompany from "@/hooks/useCompany";
import useJobLog from "@/hooks/useJobLog";
import { Divider, Text } from "@ui-kitten/components";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function JobLogScreen() {
  const { jobLogId } = useLocalSearchParams<{ jobLogId: string }>();
  const { data: jobLogData } = useJobLog(Number(jobLogId));
  const { data: companyData } = useCompany(jobLogData ? jobLogData![0].job_applications.companyId : undefined);

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
        <Text category="h6">
          {jobLogData[0].job_application_logs.me ? "You" : "They"} said...
        </Text>
        <Text style={{ marginTop: 10 }}>
          {jobLogData[0].job_application_logs.description}
        </Text>
      </View>
      <Divider />
    </ThemedScrollView>
  )
}