import { ThemedScrollView } from '@/components/ThemedScrollView'
import useJob from '@/hooks/useJob'
import useJobLogs from '@/hooks/useJobLogs'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Button, Divider, Text } from '@ui-kitten/components'
import { Pressable, TouchableOpacity, View } from 'react-native'
import useLocations from '@/hooks/useLocations'
import { IconSymbol } from '@/components/ui/IconSymbol'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { JobApplicationLogType } from '@/db/schema/jobApplicationLogs'
import * as changeCase from "change-case";
import useJobStatus from '@/hooks/useJobStatus'
import { JobApplicationStatusType } from '@/db/schema/jobApplicationStatuses'

dayjs.extend(relativeTime)

const JobLogItem = ({ jobLog, jobStatus }: { jobLog: JobApplicationLogType, jobStatus: JobApplicationStatusType }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(vl => !vl);

  if (!visible) {
    return (
      <>
        <TouchableOpacity style={{ padding: 20 }} onPress={toggleVisible}>
          <View style={{ flexDirection: "row" }}>
            <IconSymbol
              name="person"
              size={36}
              color="white"
              style={{
                padding: 5,
                backgroundColor: "gray",
                borderRadius: 100,
                marginRight: 15,
                maxHeight: 48
              }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <Text category="h6">
                  {jobLog.me ?
                    "You " : "Recruiter "}
                </Text>
                <View style={{ flexDirection: "row", alignContent: "center", marginTop: 2 }}>
                  <IconSymbol name="star" size={20} color="gray" />
                  <View style={{ marginLeft: 5 }}>
                    <Text>
                      {changeCase.capitalCase(jobStatus.name)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text>
                {new Date(jobLog.updatedAt).toDateString()}
                <Text appearance="hint">
                  {" "}({dayjs().to(dayjs(jobLog.updatedAt))})
                </Text>
              </Text>
            </View>
          </View>
          <Text numberOfLines={3} style={{ marginTop: 10 }}>
            {jobLog.description.replaceAll("\n", " ")}
          </Text>
        </TouchableOpacity>
        <Divider />
      </>
    )
  } else return (
    <>
      <Pressable style={{ padding: 20 }} onPress={toggleVisible}>
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
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Text category="h6">
                {jobLog.me ?
                  "You " : "Recruiter "}
              </Text>
              <View style={{ flexDirection: "row", alignContent: "center", marginTop: 2 }}>
                <IconSymbol name="star" size={20} color="gray" />
                <View style={{ marginLeft: 5 }}>
                  <Text>
                    {changeCase.capitalCase(jobStatus.name)}
                  </Text>
                </View>
              </View>
            </View>
            <Text>
              {new Date(jobLog.updatedAt).toDateString()}
              <Text appearance='hint'>
                {" "}({dayjs().to(dayjs(jobLog.updatedAt))})
              </Text>
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: 20 }}>
          {jobLog.description}
        </Text>
      </Pressable>
      <Divider />
    </>
  )
}

const JobLogsOfJobScreen = () => {
  const { jobId } = useLocalSearchParams();
  const { data: jobData } = useJob(Number(jobId));
  const { data: jobLogs } = useJobLogs(Number(jobId));
  const { data: jobLogStatuses } = useJobStatus();
  const locations = useLocations();

  const companyLocation = useMemo(() => {
    if (!jobData || !locations.data) return null;
    return locations.data.find(loc => loc.id === jobData[0].companies.locationId);
  }, [jobData, locations.data])

  const handleAddLog = () => router.push(`/(app)/jobLogs/create`)

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
      {jobData && jobLogStatuses && jobLogs && jobLogs?.map((jl, index) =>
        <JobLogItem
          key={index}
          jobLog={jl.job_application_logs}
          jobStatus={jobLogStatuses!.find(jls =>
            jl.job_application_logs.jobApplicationStatusId === jls.id)!}
        />)}
      <View style={{ padding: 20 }}>
        <Button size="large" onPress={handleAddLog}>
          Add Log
        </Button>
      </View>
    </ThemedScrollView>
  )
}

export default JobLogsOfJobScreen