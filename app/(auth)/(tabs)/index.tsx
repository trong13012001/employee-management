import { StyleSheet, FlatList, ActivityIndicator,TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useApi } from "@/app/api";
import { useRouter } from "expo-router";
type Employee = {
  id: number;
  code: string;
  name: string;
  email: string;
  position: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { apiCall } = useApi();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1); 
  const [hasMore, setHasMore] = useState<boolean>(true); 

  const handleGetEmployee = async (pageNum: number) => {
    
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data: Employee[] = await apiCall.getEmployees(pageNum);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setEmployees((prevEmployees) => [...prevEmployees, ...data]); 
      }
    } catch (error) {
      console.error("Error fetching employees: ", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    handleGetEmployee(page);
  }, [page]);

  const renderEmployee = ({ item }: { item: Employee }) => {
  
    return (
      <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/(screen)/employee/update', // Navigate to the update screen
          params: { data: JSON.stringify(item) }        });
      }}
        style={styles.employeeCard}
      >
        <ThemedText type="subtitle">
          {item.code} {item.name}
        </ThemedText>
        <ThemedText>{item.email}</ThemedText>
        <ThemedText>{item.position}</ThemedText>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <ThemedView style={styles.employeeListContainer}>
      {employees.length > 0 ? (
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore} 
          onEndReachedThreshold={0.5} 
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" /> : null
          } 
        />
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ThemedText>No employees found.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  employeeListContainer: {
    flex: 1,
    padding: 10,
  },
  employeeCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
