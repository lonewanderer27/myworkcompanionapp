import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router, Stack } from "expo-router";
import { Button, Input, Text } from "@ui-kitten/components";
import { Alert, View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "@/app/_layout";
import useSkillCategories from "@/hooks/useSkillCategories";
import skillCategories from "@/db/schema/skillCategories";

export default function CreateSkillCategoryScreen() {
  const { refetch } = useSkillCategories();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, resetForm } = useFormik<{
    name: string,
  }>({
    initialValues: {
      name: "",
    },
    onSubmit: async (data, { setSubmitting }) => {
      console.log("Data to submit:\n", JSON.stringify(data, null, 2))

      setSubmitting(true);
      try {
        await db.insert(skillCategories).values(data)
        await refetch();

        // ask our user if they want to add another update
        // or go back to the main screen
        Alert.alert(
          "Add Skill Category",
          "Do you want to add another skill category or go back to the main screen?",
          [
            {
              text: "Add Another",
              onPress: () => {
                // reset form to initial values except job application id
                resetForm()
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
      }

      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is a required field")
    })
  })

  console.log(values)

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        New Skill Category
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Name"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          status={errors.name ? "danger" : undefined}
          caption={errors.name}
        />
      </View>
      <View style={{ marginVertical: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Save
        </Button>
      </View>
    </ThemedScrollView >
  )
}