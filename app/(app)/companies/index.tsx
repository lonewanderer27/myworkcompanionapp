import { StyleSheet } from 'react-native';
import { List, ListItem, Text } from '@ui-kitten/components';
import useCompanies from '@/hooks/useCompanies';
import { ThemedView } from '@/components/ThemedView';
import { CompanyType } from '@/db/schema/companies';

export default function TabCompaniesScreen() {
  const { data: companies } = useCompanies();

  const companyItem = ({ item, index }: { item: CompanyType; index: number }) => {
    return (
      <ListItem
        key={index}
        title={item.name}
        description={evaProps => <Text {...evaProps} numberOfLines={2}>{item.description!}</Text>}
      />
    )
  }

  return (
    // @ts-ignore
    <ThemedView>
      <List
        // @ts-ignore
        data={companies}
        renderItem={companyItem}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
});
