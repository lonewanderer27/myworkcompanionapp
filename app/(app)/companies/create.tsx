import { ThemedScrollView } from "@/components/ThemedScrollView";
import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import { router, Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import useCompanies from "@/hooks/useCompanies";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";


export default function CompanyCreateScreen() {
  const companiesData = useCompanies();

  const [pickedImage, setPickedImage] = useState<ImagePicker.ImagePickerAsset | undefined | null>();
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
      const res = await db.insert(companies).values({
        ...data,
        avatar: `data:${pickedImage?.mimeType};base64,${pickedImage?.base64}`
      }).returning();
      console.log("New company has been saved:\n", JSON.stringify(res, null, 2))
      // TODO: insert picture in app filesystem
      // if (pickedImage) {
      //   const imageDir = `${FileSystem.documentDirectory}companies/${res[0].id}/avatar`;
      //   await FileSystem.moveAsync({
      //     from: pickedImage!.uri,
      //     to: imageDir
      //   })
      //   console.log(`${res[0].name} avatar has been saved to ${imageDir}`);

      //   const res2 = await db.update(companies).set({
      //     avatarUrl: imageDir
      //   }).where(eq(companies.id, Number(res[0].id))).returning();
      //   console.log("New company has been saved:\n", JSON.stringify(res2, null, 2))
      // }
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

  const handleIconFromGallery = async () => {
    if (pickedImage) handleClearPickedImage();

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.1,
      base64: true
    })

    if (res.canceled) return;
    setPickedImage(res.assets[0]);
  }

  const handleClearPickedImage = () => {
    setPickedImage(undefined);
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
        Add Company
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text appearance="hint" category="label">
          Icon
        </Text>
        <View style={{ marginTop: 5 }}>
          {pickedImage ?
            <TouchableOpacity onPress={handleIconFromGallery}>
              <Avatar shape="square" source={{ uri: pickedImage.uri }} size="giant" />
            </TouchableOpacity>
            : <Button
              onPress={handleIconFromGallery}
              status="basic"
              // @ts-ignore
              accessoryLeft={(props) => <IconSymbol {...props} name="plus.square.on.square" size={32} />}>
              <Text appearance="hint">Tap to add Icon</Text>
            </Button>}
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          style={{ flex: 1 }}
          label="Name"
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
      <View style={{ marginTop: 20 }}>
        <Input
          multiline
          label="Description"
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
          label="Website"
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
          multiline
          numberOfLines={4}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button onPress={() => handleSubmit()} disabled={isSubmitting}>
          Add
        </Button>
      </View>
    </ThemedScrollView>
  )
}