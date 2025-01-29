import { router, Stack } from "expo-router";
import { Button, ButtonGroup, Divider, Input, List, ListItem, Text } from "@ui-kitten/components";
import { useFormik } from "formik";
import { useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedView } from "@/components/ThemedView";
import { Alert, View } from "react-native";
import useSkillCategories from "@/hooks/useSkillCategories";
import { SkillCategoryType } from "@/db/schema/skillCategories";
import * as Yup from "yup";
import React from "react";
import { db } from "@/app/_layout";
import skills from "@/db/schema/skills";

export default function CreateSkillScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const [search, setSearch] = useState("");
  const { data: skillCategoriesData, refetch } = useSkillCategories();
  const filteredCategories = useMemo(
    () => skillCategoriesData?.filter(scd => scd.name.includes(search)),
    [skillCategoriesData, search]
  );

  const { handleChange, handleBlur, handleSubmit, values, errors, isSubmitting, setFieldValue, resetForm } = useFormik<{
    categoryId?: number,
    name: string
  }>({
    initialValues: {
      categoryId: undefined,
      name: ""
    },
    onSubmit: async (data, { setSubmitting }) => {
      console.log("Data to be submitted: ", JSON.stringify(data, null, 2));

      // submit new skill
      setSubmitting(true);
      await db.insert(skills).values(data);
      setSubmitting(false);

      // refresh our database
      refetch();

      // ask our user if they want to add another skill
      // or go back to the main screen
      Alert.alert(
        "Add Another Skill",
        "Do you want to add another institution or go back to the main screen?",
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
        ])
    },
    validationSchema: Yup.object({
      categoryId: Yup.number().optional(),
      name: Yup.string().required("Name is a required field")
    })
  })

  const handleOpenSearch = () => sheetRef.current?.expand();
  const handleSetCategory = (id: number) => {
    setFieldValue("categoryId", id);
    sheetRef.current?.close();
  }
  const handleClearCategory = () => setFieldValue("skillCategoryId", undefined);
  const selectedCategory = useMemo(() => skillCategoriesData?.find(
    sc => sc.id === values.categoryId),
    [skillCategoriesData, values.categoryId])

  const renderItem = ({ item, index }: { item: SkillCategoryType, index: number }) => {
    return (
      <>
        <ListItem
          style={{ paddingHorizontal: 20 }}
          onPress={() => handleSetCategory(item.id)}
        >
          <Text>{item.name}</Text>
        </ListItem>
        <Divider />
      </>
    )
  }

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{ headerTitle: "", headerShadowVisible: false }}
      />
      <Text category="h4" style={{ textAlign: 'center', marginBottom: 20 }}>
        New Skill
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text appearance="hint" style={{ marginBottom: 5 }}>
          Skill Category
        </Text>
        <ButtonGroup appearance="outline" status="basic">
          <Button onPress={handleOpenSearch} style={{ flex: 1 }}>
            {values.categoryId ? selectedCategory?.name : "Select Category"}
          </Button>
          {values.categoryId ? <Button onPress={handleClearCategory}>
            Clear
          </Button> : <></>}
        </ButtonGroup>
      </View>
      <View style={{ marginTop: 20 }}>
        <Input
          label="Name"
          value={values.name}
          onChangeText={handleChange("name")}
          placeholder="Enter skill name"
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
      <BottomSheet
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        containerStyle={{ flex: 1 }}
        onChange={e => console.log(JSON.stringify(e, null, 2))}
      >
        <BottomSheetView>
          <Input
            style={{ paddingHorizontal: 20 }}
            placeholder="Search for skill categories"
            value={search}
            onChangeText={e => setSearch(e)}
          />
          <List
            data={filteredCategories}
            renderItem={renderItem}
            scrollEnabled
          />
        </BottomSheetView>
      </BottomSheet>
    </ThemedView>
  )
}