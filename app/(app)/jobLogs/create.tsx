import { ThemedScrollView } from "@/components/ThemedScrollView";
import useJobs from "@/hooks/useJobs";
import useJobStatus from "@/hooks/useJobStatus";
import { IndexPath, Input, Select, SelectItem, Text } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { useFormik } from "formik";
import { View } from "react-native";
import * as changeCase from "change-case";
import * as Yup from "yup";
import jobApplications from "@/db/schema/jobApplications";
import { useMemo } from "react";

export default function CreateJobLogScreen() {
  const jobsData = useJobs();
  const jobStatusData = useJobStatus();
  console.log("Job Applications:\n", jobsData.data)
  console.log("Job Statuses:\n", jobStatusData.data)

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue } = useFormik<{
    jobApplicationStatusId?: number,
    jobApplicationId?: number,
    summary: string,
    description: string
  }>({
    initialValues: {
      jobApplicationId: undefined,
      jobApplicationStatusId: undefined,
      summary: "",
      description: ""
    },
    onSubmit: async (data, { setSubmitting }) => {

    },
    validationSchema: Yup.object().shape({
      summary: Yup.string().required("Job summary is required"),
      description: Yup.string().required("Job description is required"),
      jobApplicationStatusId: Yup.number().oneOf(jobStatusData.data?.map(n => n.id) ?? []),
      jobApplicationId: Yup.number().oneOf(jobsData.data?.map(n => n.id) ?? [])
    })
  })

  const jobApplicationIdVal = useMemo(() => {
    // find the company object based on the ID
    const jobApplicationObj = jobsData.data?.find(loc => loc.id === values.jobApplicationId);
    if (jobApplicationObj == undefined) return "";
    return jobApplicationObj?.name;
  }, [values.jobApplicationId])

  const jobApplicationIdSelectedIndex = useMemo(
    () => {
      if (values.jobApplicationId == undefined) return undefined;
      return new IndexPath(values.jobApplicationId!);
    },
    [values.jobApplicationId])

  const handleJobApplicationIdOnSelect = (index: IndexPath) => {
    // find the company object based on the index
    const companyObj = jobsData.data?.[index.row]!;
    setFieldValue("companyId", companyObj.id);
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
        Create Job Update
      </Text>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Job Application"
          status={errors.jobApplicationId ? "danger" : undefined}
          caption={errors.jobApplicationId}
        >
          {jobsData.data?.map(jc => (
            <SelectItem key={jc.id} title={jc.name} />
          ))}
        </Select>
      </View>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Status"
          status={errors.jobApplicationStatusId ? "danger" : undefined}
          caption={errors.jobApplicationStatusId}
        // @ts-ignore
        >
          {jobStatusData.data?.map(jc => (
            <SelectItem key={jc.id} title={changeCase.capitalCase(jc.name)} />
          ))}
        </Select>
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Summary"
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
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          status={errors.description ? "danger" : undefined}
          caption={errors.description}
        />
      </View>
    </ThemedScrollView>
  )
}