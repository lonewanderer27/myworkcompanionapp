import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { drizzle } from "drizzle-orm/expo-sqlite";
import migrations from '../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components'
import * as eva from '@eva-design/eva';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import companies from '@/db/schema/companies';
import contactPeople from '@/db/schema/contactPeople';
import institutions from '@/db/schema/institutions';
import jobApplicationLogs from '@/db/schema/jobApplicationLogs';
import jobApplications from '@/db/schema/jobApplications';
import jobApplicationStatuses from '@/db/schema/jobApplicationStatuses';
import locations from '@/db/schema/locations';
import profileEducation from '@/db/schema/profileEducation';
import profileCertificates from '@/db/schema/profileCertificates';
import profileExperienceTechnologies from '@/db/schema/profileExperienceTechnologies';
import profileProjects from '@/db/schema/profileProjects';
import profilePublications from '@/db/schema/profilePublications';
import profiles from '@/db/schema/profiles';
import profileSkills from '@/db/schema/profileSkills';
import profileVolunteerings from '@/db/schema/profileVolunteerings';
import skillCategories from '@/db/schema/skillCategories';
import skills from '@/db/schema/skills';

// Instantiate our SQLite DB
const schema = {
  ...companies,
  ...contactPeople,
  ...institutions,
  ...jobApplicationLogs,
  ...jobApplications,
  ...jobApplicationStatuses,
  ...locations,
  ...profileCertificates,
  ...profileEducation,
  ...profileExperienceTechnologies,
  ...profileProjects,
  ...profilePublications,
  ...profiles,
  ...profileSkills,
  ...profileVolunteerings,
  ...skillCategories,
  ...skills
}
export const expo = SQLite.openDatabaseSync('db.db');
export const db = drizzle(expo, { schema: schema });

// Instantiate our query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expo);
  console.log("DB errors: ", error);

  useEffect(() => {
    if (loaded && success) {
      SplashScreen.hideAsync();

      (async()=>{
        // @ts-ignore
        const res = await db.query.companies.findMany();
        console.log("Companies: ", res);
      })();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ApplicationProvider {...eva} theme={colorScheme === "dark" ? eva.dark : eva.light}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ApplicationProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
