import { List, ListItem, Text } from '@ui-kitten/components';
import { ThemedView } from '@/components/ThemedView';
import useJobLogs from '@/hooks/useJobLogs';

export default function JobApplicationLogsScreen() {
  const { data: jobLogs } = useJobLogs();
  console.log("Job Logs:\n", JSON.stringify(jobLogs, null, 2));

  const jobLogItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ListItem
        key={index}
        title={item.job_application_logs.summary + " - " + item.job_applications.name}
        description={evaProps =>
          <Text
            {...evaProps}
            numberOfLines={2}>
            {String(item.job_application_logs.description)
              .replace("\n\n", " ").replace("\n", " ")}
          </Text>}
      />
    )
  }

  return (
    <ThemedView>
      <List
        // @ts-ignore
        data={jobLogs}
        renderItem={jobLogItem}
      />
    </ThemedView>
  );
}
