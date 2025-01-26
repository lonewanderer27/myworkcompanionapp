import { ThemedScrollView } from "@/components/ThemedScrollView";
import useJobs from "@/hooks/useJobs";
import useJobStatus from "@/hooks/useJobStatus";
import { CheckBox, IndexPath, Input, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { Alert, View } from "react-native";
import * as changeCase from "change-case";
import * as Yup from "yup";
import { Button } from "@ui-kitten/components";
import { useMemo, useState } from "react";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import { db } from "@/app/_layout";
import useJobLog from "@/hooks/useJobLog";
import { eq } from "drizzle-orm";

export default function UpdateJobLogScreen() {
  const { jobLogId } = useLocalSearchParams();
  const { data: jobLogData, refetch } = useJobLog(Number(jobLogId));
  const jobStatusData = useJobStatus();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue } = useFormik<{
    jobApplicationStatusId?: number,
    jobApplicationId?: number,
    summary: string,
    description: string,
    me: boolean
  }>({
    initialValues: {
      jobApplicationId: jobLogData![0].job_application_logs.jobApplicationId ?? undefined,
      jobApplicationStatusId: jobLogData![0].job_application_logs.jobApplicationStatusId ?? undefined,
      summary:  jobLogData![0].job_application_logs.summary ?? "",
      description: jobLogData![0].job_application_logs.description ?? "",
      me: jobLogData![0].job_application_logs.me ?? false
    },
    enableReinitialize: true,
    onSubmit: async (data, { setSubmitting }) => {
      try {
        // submit our data
        setSubmitting(true);
        console.log("Data to submit:\n", JSON.stringify(data, null, 2))
        // @ts-ignore
        const res = await db
          .update(jobApplicationLogs)
          .set(data)
          .where(eq(jobApplicationLogs.id, Number(jobLogId)));
        console.log(res);
        setSubmitting(false);
        refetch();
        router.canGoBack() ? router.back() : null;
      } catch (err) {
        console.error(err);
        Alert.alert("Incomplete Information", "Please complete all required fields to continue")
      }
    },
    validationSchema: Yup.object().shape({
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      jobApplicationStatusId: Yup.number().oneOf(jobStatusData.data?.map(n => n.id) ?? []),
      me: Yup.boolean()
    })
  })

  const jobApplicationStatusIdSelectedIndex = useMemo(
    () => {
      if (values.jobApplicationStatusId == undefined) return undefined;
      return new IndexPath(values.jobApplicationStatusId!);
    },
    [values.jobApplicationStatusId])

  const jobApplicationStatusIdVal = useMemo(() => {
    // find the job application object based on the ID
    const jobApplicationStatusObj = jobStatusData.data?.find(loc => loc.id === values.jobApplicationStatusId);
    if (jobApplicationStatusObj == undefined) return "";
    return changeCase.capitalCase(jobApplicationStatusObj?.name);
  }, [values.jobApplicationStatusId])

  const handleJobApplicationStatusIdOnSelect = (index: IndexPath) => {
    // find the job application object based on the index
    const jobApplicationStatusObj = jobStatusData.data?.[index.row]!;
    setFieldValue("jobApplicationStatusId", jobApplicationStatusObj.id);
  }

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Update Job Log
      </Text>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Job Application"
          status={errors.jobApplicationId ? "danger" : undefined}
          caption={errors.jobApplicationId}
          // @ts-ignore
          selectedIndex={0}
          // @ts-ignore
          value={jobLogData![0].job_applications.name}
        >

          <SelectItem title={jobLogData![0].job_applications.name} />
        </Select>
      </View>
      <View style={{ marginTop: 20, flexDirection: "row" }}>
        <Select
          label="Status"
          status={errors.jobApplicationStatusId ? "danger" : undefined}
          caption={errors.jobApplicationStatusId}
          // @ts-ignore
          selectedIndex={jobApplicationStatusIdSelectedIndex}
          // @ts-ignore
          value={jobApplicationStatusIdVal}
          // @ts-ignore
          onSelect={handleJobApplicationStatusIdOnSelect}
          style={{ flex: 4 }}
        >
          {jobStatusData.data?.map(jc => (
            <SelectItem key={jc.id} title={changeCase.capitalCase(jc.name)} />
          ))}
        </Select>
        <View style={{ paddingLeft: 10 }}>
          <Text category="label" appearance="hint" style={{ marginBottom: 10 }}>
            Me
          </Text>
          <Toggle
            checked={values.me}
            onChange={check => setFieldValue("me", check)}
          />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Summary"
          multiline
          numberOfLines={3}
          value={values.summary}
          onChangeText={handleChange("summary")}
          onBlur={handleBlur("summary")}
          status={errors.summary ? "danger" : undefined}
          caption={errors.summary}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Description"
          value={values.description}
          multiline
          numberOfLines={13}
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          status={errors.description ? "danger" : undefined}
          caption={errors.description}
        />
      </View>
      <View style={{ marginVertical: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Save
        </Button>
      </View>
    </ThemedScrollView>
  )
}