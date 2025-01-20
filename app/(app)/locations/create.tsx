import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Button, Input, Text } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import locations from "@/db/schema/locations";

export default function CompanyCreateScreen() {
  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    city: string,
  }>({
    initialValues: {
      city: ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      setSubmitting(true);
      console.log(data)
      const res = await db.insert(locations).values(data);
      console.log(res);
      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is a required field"),
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