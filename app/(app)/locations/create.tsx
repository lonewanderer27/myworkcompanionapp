import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Button, Input, Text } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { Alert, View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import locations from "@/db/schema/locations";
import useCompanies from "@/hooks/useCompanies";

export default function CompanyCreateScreen() {
  const companiesData = useCompanies();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, resetForm } = useFormik<{
    city: string,
  }>({
    initialValues: {
      city: ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      try {
        // save to db
        setSubmitting(true);
        console.log(data)
        const res = await db.insert(locations).values(data);
        console.log(res);
        setSubmitting(false);

        // refresh our database
        companiesData.refetch();

        Alert.alert(
          "Add Another City",
          "Do you want to add another location or go back to the main screen?",
          [
            {
              text: "Add Another",
              onPress: () => resetForm()
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
        console.error(err)
        Alert.alert("Incomplete Information", "Please complete all required fields to continue")
      }
    },
    validationSchema: Yup.object().shape({
      city: Yup.string().required("City is a required field"),
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
        Add Location
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="City"
          value={values.city}
          onChangeText={handleChange("city")}
          onBlur={handleBlur("city")}
          status={errors.city ? "danger" : undefined}
          caption={errors.city}
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