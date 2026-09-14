import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SubjectCard } from '../../src/components/SubjectCard';
import { db } from '../../src/core/database/db';
import { localSubjects } from '../../src/core/database/schema';
import { syncCurriculum } from '../../src/core/network/sync';
import { colors } from '../../src/core/theme/colors';
import { typography } from '../../src/core/theme/typography';

export default function SubjectsScreen() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLocalSubjects = async () => {
    try {
      const data = await db.select().from(localSubjects).execute();
      setSubjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await syncCurriculum(); // Fetch from API and save to DB
    await loadLocalSubjects(); // Reload from DB
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadLocalSubjects();
    // Auto sync on mount if empty
    db.select().from(localSubjects).execute().then((data) => {
      if (data.length === 0) handleRefresh();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Curriculum</Text>
      
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <SubjectCard 
            id={item.id}
            name={item.name}
            stream={item.stream}
            gradeLevel={item.gradeLevel}
            onPress={(id) => router.push(`/subject/${id}`)}
          />
        )}
        ListEmptyComponent={
          !isRefreshing ? (
            <Text style={styles.emptyText}>No subjects available. Pull to refresh!</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  header: { ...typography.h1, marginBottom: 24 },
  emptyText: { ...typography.body, textAlign: 'center', marginTop: 40 }
});
