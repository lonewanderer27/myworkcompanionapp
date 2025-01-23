import { db } from "@/app/_layout";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import profileSessions from "@/db/schema/profileSessions";
import useSessionProfile from "@/hooks/useSessionProfile";
import SessionProfileDataType from "@/types/SessionProfileType";
import { Button, Input } from "@ui-kitten/components";
import { eq } from "drizzle-orm";
import { router } from "expo-router";
import { useFormik } from "formik";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import * as Yup from "yup";

export default function CreateNameProfileScreen() {
  const { existingSession } = useSessionProfile();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    name: string,
    fullName: string
  }>({
    initialValues: {
      name: existingSession?.data.name ?? "",
      fullName: existingSession?.data.fullName ?? ""
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
        router.push("/(app)/profile/create/description");
      } catch (err) {
        console.error(err);
      }

      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is a required field"),
      fullName: Yup.string().required("Full name is a required field")
    })
  })

  console.log(values)

  return (
    <ThemedScrollView style={{ flexGrow: 1, flex: 1, padding: 20 }}>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Nickname"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          status={errors.name ? "danger" : undefined}
          caption={errors.name}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Full Name"
          value={values.fullName}
          onChangeText={handleChange("fullName")}
          onBlur={handleBlur("fullName")}
          status={errors.fullName ? "danger" : undefined}
          caption={errors.fullName}
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