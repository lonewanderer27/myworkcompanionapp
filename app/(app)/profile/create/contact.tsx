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

export default function CreateContactProfileScreen() {
  const { existingSession } = useSessionProfile();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    contactNo: string,
    email: string,
    github?: string,
    gitlab?: string,
    linkedin?: string,
    twitter?: string,
    website?: string
  }>({
    initialValues: {
      contactNo: existingSession?.data.contactNo ?? "",
      email: existingSession?.data.email ?? "",
      github: existingSession?.data.github ?? "",
      gitlab: existingSession?.data.gitlab ?? "",
      linkedin: existingSession?.data.linkedin ?? "",
      twitter: existingSession?.data.twitter ?? "",
      website: existingSession?.data.website ?? ""
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
        router.push("/(app)/profile/create/review");
      } catch (err) {
        console.error(err);
      }

      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      contactNo: Yup.string().required("Contact no is a required field"),
      email: Yup.string().email().required("Email is a required field"),
      website: Yup.string().url().optional()
    })
  })

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <Text category="h4">
        Socials
      </Text>
      <Text category="label">
        Step 3 out 3
      </Text>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Contact No"
          value={values.contactNo}
          onChangeText={handleChange("contactNo")}
          onBlur={handleBlur("contactNo")}
          status={errors.contactNo ? "danger" : undefined}
          caption={errors.contactNo}
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Email"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          status={errors.email ? "danger" : undefined}
          caption={errors.email}
          keyboardType="email-address"
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="GitHub username"
          value={values.github}
          onChangeText={handleChange("github")}
          onBlur={handleBlur("github")}
          status={errors.github ? "danger" : undefined}
          caption={errors.github}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="GitLab username"
          value={values.gitlab}
          onChangeText={handleChange("gitlab")}
          onBlur={handleBlur("gitlab")}
          status={errors.gitlab ? "danger" : undefined}
          caption={errors.gitlab}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="LinkedIn username"
          value={values.linkedin}
          onChangeText={handleChange("linkedin")}
          onBlur={handleBlur("linkedin")}
          status={errors.linkedin ? "danger" : undefined}
          caption={errors.linkedin}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Twitter / X username"
          value={values.twitter}
          onChangeText={handleChange("twitter")}
          onBlur={handleBlur("twitter")}
          status={errors.twitter ? "danger" : undefined}
          caption={errors.twitter}
          keyboardType="twitter"
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Portfolio Link"
          value={values.website}
          onChangeText={handleChange("website")}
          onBlur={handleBlur("website")}
          status={errors.website ? "danger" : undefined}
          caption={errors.website}
          keyboardType="url"
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