import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Button, Input, Text } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import useCompanies from "@/hooks/useCompanies";

export default function CompanyCreateScreen() {
  const companiesData = useCompanies();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    name: string,
    fullName?: string,
    description?: string,
    website?: string,
    glassdoorUrl?: string
  }>({
    initialValues: {
      name: ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      // submit new company
      setSubmitting(true);
      console.log(data)
      const res = await db.insert(companies).values(data);
      console.log(res);
      setSubmitting(false);

      // refresh our database
      companiesData.refetch();

      // go back to the previous screen
      router.canGoBack() ? router.back() : null;
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Company name is a required field"),
      fullName: Yup.string().optional(),
      description: Yup.string().optional(),
      website: Yup.string().url("Must be a valid URL").optional(),
      glassdoorUrl: Yup.string().url("Must be a valid URL").optional()
        .test('is-glassdoor-url', "URL must start with https://www.glassdoor.com",
          val => val ? val.includes("glassdoor.com") : false)
    })
  })

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        Add Company
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Company Name"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          status={errors.name ? "danger" : undefined}
          caption={errors.name}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Full Company Name"
          value={values.fullName}
          onChangeText={handleChange("fullName")}
          onBlur={handleBlur("fullName")}
          status={errors.fullName ? "danger" : undefined}
          caption={errors.fullName}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          multiline
          label="Company Description"
          numberOfLines={6}
          value={values.description}
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          status={errors.description ? "danger" : undefined}
          caption={errors.description}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Company Website"
          value={values.website}
          onChangeText={handleChange("website")}
          onBlur={handleBlur("website")}
          status={errors.website ? "danger" : undefined}
          caption={errors.website}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Glassdoor Link"
          value={values.glassdoorUrl}
          onChangeText={handleChange("glassdoorUrl")}
          onBlur={handleBlur("glassdoorUrl")}
          status={errors.glassdoorUrl ? "danger" : undefined}
          caption={errors.glassdoorUrl}
        />
      </View>
      <View style={{ marginTop: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Save
        </Button>
      </View>
    </ThemedScrollView>
  )
}