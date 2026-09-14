import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../../src/core/store/quizStore';
import { db } from '../../src/core/database/db';
import { localQuizAttempts } from '../../src/core/database/schema';
import { colors, shadows } from '../../src/core/theme/colors';
import { typography } from '../../src/core/theme/typography';
import * as Crypto from 'expo-crypto';

export default function QuizResultsScreen() {
  const router = useRouter();
  const { score, questions, subjectId, resetQuiz } = useQuizStore();

  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    const saveAttempt = async () => {
      if (subjectId && questions.length > 0) {
        await db.insert(localQuizAttempts).values({
          id: Crypto.randomUUID(),
          subjectId,
          score,
          totalQuestions: questions.length,
          completedAt: new Date().toISOString(),
          isSynced: false
        });
      }
    };
    saveAttempt();
  }, []);

  const handleFinish = () => {
    resetQuiz();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Quiz Complete!</Text>
        
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{percentage}%</Text>
        </View>

        <Text style={styles.statsText}>You scored {score} out of {questions.length}</Text>

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    ...shadows.lg
  },
  header: { ...typography.h1, marginBottom: 30, color: colors.primary },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: { fontSize: 40, fontWeight: '900', color: colors.text },
  statsText: { ...typography.bodyLg, marginBottom: 40 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: { ...typography.h3, color: '#fff' }
});
