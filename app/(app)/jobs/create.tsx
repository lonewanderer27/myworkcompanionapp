import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Button, IndexPath, Input, Select, SelectItem, Text } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import { useMemo } from "react";
import useLocations from "@/hooks/useLocations";
import useCompanies from "@/hooks/useCompanies";
import useJobs from "@/hooks/useJobs";

export default function JobCreateScreen() {
  const jobsData = useJobs();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue } = useFormik<{
    name: string,
    companyId?: number,
    contactPersonId: number,
    locationId?: number,
    hoursPerWeek?: number,
    allowancePerMonth?: number,
    description: string,
    applicationUrl: string,
    workMode?: number
  }>({
    initialValues: {
      name: "",
      companyId: undefined,
      contactPersonId: -1,
      locationId: undefined,
      hoursPerWeek: 0,
      allowancePerMonth: 0,
      description: "",
      applicationUrl: "",
      workMode: undefined
    },
    onSubmit: async (data, { setSubmitting }) => {
      // submit our data
      setSubmitting(true);
      console.log(data)
      const res = await db.insert(companies).values(data);
      console.log(res);
      setSubmitting(false);

      // refetch our database
      jobsData.refetch();

      // go back to the previous screen
      router.canGoBack() ? router.back() : null;
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Job role is a required field"),
      hoursPerWeek: Yup.number().optional(),
      allowancePerMonth: Yup.number().optional(),
      description: Yup.string(),
      applicationUrl: Yup.string().url("Must be a valid URL").optional(),
      workMode: Yup.number().min(0).max(2).optional()
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

  const locationsData = useLocations();
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

  const companiesData = useCompanies();

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

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        New Job Application
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
          numberOfLines={6}
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
            <SelectItem title={lc.name ?? lc.fullName} />
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
            <SelectItem title={lc.city} />
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
          label="Allowance per month"
          keyboardType="numeric"
          value={values.allowancePerMonth?.toString()}
          onChangeText={handleChange("allowancePerMonth")}
          onBlur={handleBlur("allowancePerMonth")}
          status={errors.allowancePerMonth ? "danger" : undefined}
          caption={errors.allowancePerMonth}
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
      <View style={{ marginVertical: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Save
        </Button>
      </View>
    </ThemedScrollView>
  )
}