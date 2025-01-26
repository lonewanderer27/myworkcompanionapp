import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Button, IndexPath, Input, Select, SelectItem, Text } from "@ui-kitten/components";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import { useMemo } from "react";
import useLocations from "@/hooks/useLocations";
import useCompanies from "@/hooks/useCompanies";
import useJobs from "@/hooks/useJobs";
import jobApplications from "@/db/schema/jobApplications";
import WorkMode, { workModeMap } from "@/enums/WorkMode";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import useJob from "@/hooks/useJob";
import { eq } from "drizzle-orm";

export default function JobUpdateScreen() {
  const { jobId } = useLocalSearchParams();
  const { data: jobData, isLoading, refetch } = useJob(Number(jobId));
  console.log("Job:\n", JSON.stringify(jobData, null, 2));
  const jobsData = useJobs();
  const locationsData = useLocations();
  const companiesData = useCompanies();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue } = useFormik<{
    name: string,
    companyId?: number,
    contactPersonId?: number,
    locationId?: number,
    hoursPerWeek?: number,
    payPerMonth?: number,
    allowancePerDay?: number,
    description: string,
    email?: string,
    contactNo?: string,
    applicationUrl: string,
    workMode?: number,
    deadline?: Date
  }>({
    initialValues: {
      name: jobData![0].job_applications.name ?? "",
      companyId: jobData![0].job_applications.companyId ?? undefined,
      contactPersonId: jobData![0].job_applications.contactPersonId ?? undefined,
      locationId: jobData![0].job_applications.locationId ?? undefined,
      hoursPerWeek: jobData![0].job_applications.hoursPerWeek ?? 0,
      payPerMonth: jobData![0].job_applications.payPerMonth ?? 0,
      allowancePerDay: jobData![0].job_applications.allowancePerDay ?? 0,
      description: jobData![0].job_applications.description ?? "",
      email: jobData![0].job_applications.email ?? "",
      contactNo: jobData![0].job_applications.contactNo ?? "",
      applicationUrl: jobData![0].job_applications.applicationUrl ?? "",
      workMode:
        (jobData![0].job_applications.workMode! + "" === "0" || jobData![0].job_applications.workMode === WorkMode.HYBRID) ? 0
          : (jobData![0].job_applications.workMode! + "" === "1" || jobData![0].job_applications.workMode === WorkMode.ONSITE) ? 1
            : (jobData![0].job_applications.workMode! + "" === "2" || jobData![0].job_applications.workMode === WorkMode.REMOTE) ? 2
              : undefined,
      deadline: jobData![0].job_applications.deadline ? new Date(jobData![0].job_applications.workMode!) : undefined
    },
    enableReinitialize: true,
    onSubmit: async (data, { setSubmitting }) => {
      try {
        // submit our data
        setSubmitting(true);
        console.log("To be updated data:\n", JSON.stringify(data, null, 2))
        // @ts-ignore
        let res = await db.update(jobApplications).set({
          ...data,
          workMode: workModeMap[data.workMode! as keyof typeof workModeMap],
          deadline: data.deadline?.toISOString()
        }).where(eq(jobApplications.id, Number(jobId)));
        console.log(res);
        setSubmitting(false);

        // refetch our database
        refetch();

        // go back to the previous screen
        router.canGoBack() ? router.back() : null;
      } catch (err) {
        console.error(err);
        Alert.alert("Incomplete Information", "Please complete all required fields to continue")
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Job role is a required field"),
      hoursPerWeek: Yup.number().optional(),
      payPerMonth: Yup.number().optional(),
      allowancePerDay: Yup.number().optional(),
      description: Yup.string(),
      applicationUrl: Yup.string().url("Must be a valid URL").optional(),
      workMode: Yup.number().min(0).max(2).optional(),
    })
  })

  const workModeVal = useMemo(() => {
    switch (values.workMode) {
      case 0: return "Hybrid";
      case 1: return "Remote";
      case 2: return "On-Site";
      default: return "";
    }
  }, [values.workMode]);

  const workModeSelectedIndex = useMemo(
    () => {
      if (values.workMode == undefined) {
        return undefined
      }
      return new IndexPath(values.workMode!);
    },
    [values.workMode]);

  const handleWorkModeOnSelect = (index: IndexPath) => {
    setFieldValue("workMode", index.row!);
  }

  console.log("locations: ", locationsData.data);

  const locationIdVal = useMemo(() => {
    // find the location object based on the ID
    const locObj = locationsData.data?.find(loc => loc.id === values.locationId);
    if (locObj == undefined) return "";
    return locObj?.city;
  }, [values.locationId])

  const locationIdSelectedIndex = useMemo(
    () => {
      if (values.locationId == undefined) return undefined;
      return new IndexPath(values.locationId!);
    },
    [values.locationId])

  const handleLocationIdOnSelect = (index: IndexPath) => {
    // find the location object based on the index
    const locObj = locationsData.data?.[index.row]!;
    setFieldValue("locationId", locObj.id);
  }

  const companyIdVal = useMemo(() => {
    // find the company object based on the ID
    const companyObj = companiesData.data?.find(loc => loc.id === values.companyId);
    if (companyObj == undefined) return "";
    return companyObj?.name ?? companyObj.fullName;
  }, [values.companyId])

  const companyIdSelectedIndex = useMemo(
    () => {
      if (values.companyId == undefined) return undefined;
      return new IndexPath(values.companyId!);
    },
    [values.companyId])

  const handleCompanyIdOnSelect = (index: IndexPath) => {
    // find the company object based on the index
    const companyObj = companiesData.data?.[index.row]!;
    setFieldValue("companyId", companyObj.id);
  }

  const handleShowDateMode = () => {
    DateTimePickerAndroid.open({
      value: values.deadline ?? new Date(),
      onChange(event, date) {
        setFieldValue("deadline", date)
      },
      is24Hour: true,
      mode: "date"
    })
  }

  console.log("Values:\n", JSON.stringify(values, null, 2));

  if (isLoading || locationsData.isLoading || companiesData.isLoading) return null;

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Update Job Application
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Job Role"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          status={errors.name ? "danger" : undefined}
          caption={errors.name}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          multiline
          label="Job Description"
          numberOfLines={13}
          value={values.description}
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          status={errors.description ? "danger" : undefined}
          caption={errors.description}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Company"
          status={errors.companyId ? "danger" : undefined}
          caption={errors.companyId}
          // @ts-ignore
          selectedIndex={companyIdSelectedIndex}
          // @ts-ignore
          value={companyIdVal}
          // @ts-ignore
          onSelect={handleCompanyIdOnSelect}
        >
          {companiesData.data?.map(lc => (
            <SelectItem key={lc.id} title={lc.name ?? lc.fullName} />
          ))}
        </Select>
      </View>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Work Mode"
          status={errors.workMode ? "danger" : undefined}
          caption={errors.workMode}
          // @ts-ignore
          value={workModeVal}
          // @ts-ignore
          selectedIndex={workModeSelectedIndex}
          // @ts-ignore
          onSelect={handleWorkModeOnSelect}
        >
          <SelectItem title="Hybrid" />
          <SelectItem title="Remote" />
          <SelectItem title="On-Site" />
        </Select>
      </View>
      <View style={{ marginTop: 20 }}>
        <Select
          label="Location"
          status={errors.locationId ? "danger" : undefined}
          caption={errors.locationId}
          // @ts-ignore
          selectedIndex={locationIdSelectedIndex}
          // @ts-ignore
          value={locationIdVal}
          // @ts-ignore
          onSelect={handleLocationIdOnSelect}
        >
          {locationsData.data?.map(lc => (
            <SelectItem key={lc.id} title={lc.city} />
          ))}
        </Select>
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Hours per week"
          keyboardType="numeric"
          value={values.hoursPerWeek?.toString()}
          onChangeText={handleChange("hoursPerWeek")}
          onBlur={handleBlur("hoursPerWeek")}
          status={errors.hoursPerWeek ? "danger" : undefined}
          caption={errors.hoursPerWeek}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Pay per month"
          keyboardType="numeric"
          value={values.payPerMonth?.toString()}
          onChangeText={handleChange("payPerMonth")}
          onBlur={handleBlur("payPerMonth")}
          status={errors.payPerMonth ? "danger" : undefined}
          caption={errors.payPerMonth}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Allowance per day"
          keyboardType="numeric"
          value={values.allowancePerDay?.toString()}
          onChangeText={handleChange("allowancePerDay")}
          onBlur={handleBlur("allowancePerDay")}
          status={errors.allowancePerDay ? "danger" : undefined}
          caption={errors.allowancePerDay}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Email"
          keyboardType="email-address"
          value={values.email?.toString()}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          status={errors.email ? "danger" : undefined}
          caption={errors.email}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Contact No"
          keyboardType="email-address"
          value={values.contactNo?.toString()}
          onChangeText={handleChange("contactNo")}
          onBlur={handleBlur("contactN")}
          status={errors.contactNo ? "danger" : undefined}
          caption={errors.contactNo}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Application Link"
          value={values.applicationUrl}
          onChangeText={handleChange("applicationUrl")}
          onBlur={handleBlur("applicationUrl")}
          status={errors.applicationUrl ? "danger" : undefined}
          caption={errors.applicationUrl}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text category="label" appearance="hint">
          Deadline
        </Text>
        <Button
          appearance="outline"
          style={{ marginTop: 5 }}
          status="basic"
          onPress={handleShowDateMode}>
          {Date.parse(values.deadline + "") ? values.deadline?.toDateString() : "Tap to set Deadline"}
        </Button>
      </View>
      <View style={{ marginVertical: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Save
        </Button>
      </View>
    </ThemedScrollView>
  )
}