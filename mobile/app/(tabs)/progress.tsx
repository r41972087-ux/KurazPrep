import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { db } from '../../src/core/database/db';
import { localQuizAttempts, localSubjects } from '../../src/core/database/schema';
import { eq, desc } from 'drizzle-orm';
import { colors, shadows } from '../../src/core/theme/colors';
import { typography } from '../../src/core/theme/typography';

export default function ProgressScreen() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProgress = async () => {
    // Fetch attempts joined with subject names
    // For MVP SQLite drizzle query:
    const data = await db.select({
      id: localQuizAttempts.id,
      score: localQuizAttempts.score,
      total: localQuizAttempts.totalQuestions,
      date: localQuizAttempts.completedAt,
      subjectName: localSubjects.name,
    })
    .from(localQuizAttempts)
    .leftJoin(localSubjects, eq(localQuizAttempts.subjectId, localSubjects.id))
    .orderBy(desc(localQuizAttempts.completedAt))
    .execute();

    setAttempts(data);
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProgress();
    setIsRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.header}>Your Progress</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Quizzes Taken</Text>
        <Text style={styles.summaryValue}>{attempts.length}</Text>
      </View>

      <Text style={styles.subHeader}>Recent History</Text>
      
      {attempts.map((attempt) => {
        const percentage = Math.round((attempt.score / attempt.total) * 100);
        const date = new Date(attempt.date).toLocaleDateString();
        
        return (
          <View key={attempt.id} style={styles.historyCard}>
            <View>
              <Text style={styles.historySubject}>{attempt.subjectName || 'Unknown Subject'}</Text>
              <Text style={styles.historyDate}>{date}</Text>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>{percentage}%</Text>
            </View>
          </View>
        );
      })}

      {attempts.length === 0 && (
        <Text style={{textAlign: 'center', marginTop: 40, color: colors.textMuted}}>
          Take a quiz to see your progress here!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  header: { ...typography.h1, marginBottom: 24 },
  summaryCard: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    ...shadows.md
  },
  summaryTitle: { ...typography.body, color: '#e0e0e0', marginBottom: 8 },
  summaryValue: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  subHeader: { ...typography.h2, marginBottom: 16 },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadows.sm
  },
  historySubject: { ...typography.h3, fontSize: 16 },
  historyDate: { ...typography.caption, marginTop: 4 },
  scorePill: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scorePillText: { color: colors.secondaryDark, fontWeight: 'bold' }
});
