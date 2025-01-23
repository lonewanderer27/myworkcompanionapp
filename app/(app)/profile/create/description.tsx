import { db } from "@/app/_layout";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import profileSessions from "@/db/schema/profileSessions";
import useSessionProfile from "@/hooks/useSessionProfile";
import SessionProfileDataType from "@/types/SessionProfileType";
import { Button, Input, Text } from "@ui-kitten/components";
import { eq } from "drizzle-orm";
import { router, Stack } from "expo-router";
import { useFormik } from "formik";
import { View } from "react-native";
import * as Yup from "yup";

export default function CreateDescriptionProfileScreen() {
  const { existingSession } = useSessionProfile();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    careerProfile: string,
    careerGoal: string
  }>({
    initialValues: {
      careerProfile: existingSession?.data.careerProfile ?? "",
      careerGoal: existingSession?.data.careerGoal ?? ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      setSubmitting(true);
      const prev = existingSession?.data;
      if (!data) {
        console.error("No active profile session!")
        return;
      };
      console.log("Previous data: ", prev)
      console.log("New data: ", data)

      // create an object with the old + new values
      const newData: SessionProfileDataType = { ...prev, ...data };

      try {
        // replace the data column in the session profile
        const res = await db.update(profileSessions)
          .set({ data: JSON.stringify(newData) })
          .where(eq(profileSessions.id, existingSession!.data.id!))
          .returning();

        console.log("New data: ", res)


        // redirect the user to the description page
        router.push("/(app)/profile/create/contact");
      } catch (err) {
        console.error(err);
      }

      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      careerProfile: Yup.string().required("Career profile is a required field"),
      careerGoal: Yup.string().required("Career goal is a required field")
    })
  })

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <Text category="h4">
        Tell us about yourself
      </Text>
      <Text category="label">
        Step 2 out 3
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Career Profile"
          value={values.careerProfile}
          onChangeText={handleChange("careerProfile")}
          onBlur={handleBlur("careerProfile")}
          status={errors.careerProfile ? "danger" : undefined}
          caption={errors.careerProfile}
          numberOfLines={13}
          multiline
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Your Goal"
          value={values.careerGoal}
          onChangeText={handleChange("careerGoal")}
          onBlur={handleBlur("careerGoal")}
          status={errors.careerGoal ? "danger" : undefined}
          caption={errors.careerGoal}
          numberOfLines={13}
          multiline
        />
      </View>
      <View style={{ marginVertical: 50 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Next
        </Button>
      </View>
    </ThemedScrollView>
  )
}