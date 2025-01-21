import { db } from "@/app/_layout";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import profileSessions from "@/db/schema/profileSessions";
import useSessionProfile from "@/hooks/useSessionProfile";
import SessionProfileDataType from "@/types/SessionProfileType";
import { Button, Input } from "@ui-kitten/components";
import { eq } from "drizzle-orm";
import { useFormik } from "formik";
import { View } from "react-native";
import * as Yup from "yup";

export default function CreateDescriptionProfileScreen() {
  const profileSession = useSessionProfile();

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting } = useFormik<{
    careerProfile: string,
    careerGoal: string
  }>({
    initialValues: {
      careerProfile: profileSession.data?.at(-1)?.data.careerProfile ?? "",
      careerGoal: profileSession.data?.at(-1)?.data.careerGoal ?? ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      setSubmitting(true);
      const prev = profileSession.data?.at(-1)?.data;
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
          .where(eq(profileSessions.id, profileSession.data![0].id))
          .returning();

        console.log("New data: ", res)
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
      <View style={{ marginTop: 20 }}>
        <Input
          label="Career Profile"
          value={values.careerProfile}
          onChangeText={handleChange("careerProfile")}
          onBlur={handleBlur("careerProfile")}
          status={errors.careerProfile ? "danger" : undefined}
          caption={errors.careerProfile}
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