import { ThemedScrollView } from "@/components/ThemedScrollView";
import useJobs from "@/hooks/useJobs";
import useJobStatus from "@/hooks/useJobStatus";
import { CheckBox, IndexPath, Input, Select, SelectItem, Text, Toggle } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { useFormik } from "formik";
import { Alert, View } from "react-native";
import * as changeCase from "change-case";
import * as Yup from "yup";
import { Button } from "@ui-kitten/components";
import { useEffect, useMemo, useState } from "react";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import { db } from "@/app/_layout";
import { useAtomValue } from "jotai";
import { screenAtom } from "@/atoms/screen";

export default function CreateJobLogScreen() {
  const screen = useAtomValue(screenAtom);
  const jobsData = useJobs();
  const jobStatusData = useJobStatus();
  console.log("Job Applications:\n", jobsData.data)
  console.log("Job StatusesjobApplicationObj:\n", jobStatusData.data)
  console.log("Screen: ", JSON.stringify(screen, null, 2))

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue } = useFormik<{
    jobApplicationStatusId?: number,
    jobApplicationId?: number,
    summary: string,
    description: string,
    me: boolean
  }>({
    initialValues: {
      jobApplicationId: (screen && screen.id) ? Number(screen.id) : undefined,
      jobApplicationStatusId: undefined,
      summary: "",
      description: "",
      me: false
    },
    onSubmit: async (data, { setSubmitting }) => {
      try {
        // submit our data
        setSubmitting(true);
        console.log("Data to submit:\n", JSON.stringify(data, null, 2))
        // @ts-ignore
        const res = await db.insert(jobApplicationLogs).values(data);
        console.log(res);
        setSubmitting(false);

        // refetch our database
        jobsData.refetch();

        // ask our user if they want to add another update
        // or go back to the main screen
        Alert.alert(
          "Add Another Log",
          "Do you want to add another log or go back to the main screen?",
          [
            {
              text: "Add Another",
              onPress: () => {
                // reset form to initial values except job application id
                setFieldValue("jobApplicationStatusId", undefined);
                setFieldValue("summary", "");
                setFieldValue("description", "");
                setFieldValue("me", false);
              }
            },
            {
              text: "Go Back",
              onPress: () => {
                router.canGoBack() ? router.back() : null;
              }
            }
          ]
        );
      } catch (err) {
        console.error(err);
        Alert.alert("Incomplete Information", "Please complete all required fields to continue")
      }
    },
    validationSchema: Yup.object().shape({
      summary: Yup.string().required("Summary is required"),
      description: Yup.string().required("Description is required"),
      jobApplicationStatusId: Yup.number().oneOf(jobStatusData.data?.map(n => n.id) ?? []),
      jobApplicationId: Yup.number().oneOf(jobsData.data?.map(n => n.job_applications.id) ?? []),
      me: Yup.boolean()
    })
  })

  const jobApplicationIdVal = useMemo(() => {
    // find the job application object based on the ID
    const jobApplicationObj = jobsData.data?.find(loc => loc.job_applications.id === values.jobApplicationId);
    if (jobApplicationObj == undefined) return "";
    return jobApplicationObj?.job_applications.name + " - " + jobApplicationObj.companies.name;
  }, [values.jobApplicationId])

  const jobApplicationIdSelectedIndex = useMemo(
    () => {
      if (values.jobApplicationId == undefined) return undefined;
      return new IndexPath(values.jobApplicationId!);
    },
    [values.jobApplicationId])

  const handleJobApplicationIdOnSelect = (index: IndexPath) => {
    // find the job application object based on the index
    const jobApplicationObj = jobsData.data?.[index.row]!;
    setFieldValue("jobApplicationId", jobApplicationObj.job_applications.id);
  }

  const jobApplicationStatusIdVal = useMemo(() => {
    // find the job application object based on the ID
    const jobApplicationStatusObj = jobStatusData.data?.find(loc => loc.id === values.jobApplicationStatusId);
    if (jobApplicationStatusObj == undefined) return "";
    return changeCase.capitalCase(jobApplicationStatusObj?.name);
  }, [values.jobApplicationStatusId])

  const jobApplicationStatusIdSelectedIndex = useMemo(
    () => {
      if (values.jobApplicationStatusId == undefined) return undefined;
      return new IndexPath(values.jobApplicationStatusId!);
    },
    [values.jobApplicationStatusId])

  const handleJobApplicationStatusIdOnSelect = (index: IndexPath) => {
    // find the job application object based on the index
    const jobApplicationStatusObj = jobStatusData.data?.[index.row]!;
    setFieldValue("jobApplicationStatusId", jobApplicationStatusObj.id);
  }

  if (!jobsData.data || !jobStatusData.data) return null;

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Create Job Update
      </Text>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Job Application"
          status={errors.jobApplicationId ? "danger" : undefined}
          caption={errors.jobApplicationId}
          // @ts-ignore
          selectedIndex={jobApplicationIdSelectedIndex}
          // @ts-ignore
          value={jobApplicationIdVal}
          // @ts-ignore
          onSelect={handleJobApplicationIdOnSelect}
          disabled={(screen && screen.id) ? true : false}
        >
          {jobsData.data?.map(jc => (
            <SelectItem key={jc.job_applications.id} title={jc.job_applications.name + " - " + jc.companies.name} />
          ))}
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