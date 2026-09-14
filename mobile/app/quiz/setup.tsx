import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../src/core/database/db';
import { localQuestions, localUnits } from '../../src/core/database/schema';
import { eq, inArray } from 'drizzle-orm';
import { useQuizStore, Question } from '../../src/core/store/quizStore';

export default function QuizSetupScreen() {
  const { subjectId } = useLocalSearchParams();
  const router = useRouter();
  const initializeQuiz = useQuizStore((state) => state.initializeQuiz);
  
  const [loading, setLoading] = useState(true);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      // Find all units for this subject
      const units = await db.select().from(localUnits).where(eq(localUnits.subjectId, String(subjectId))).execute();
      const unitIds = units.map(u => u.id);
      
      if (unitIds.length > 0) {
        const questionsRecord = await db.select().from(localQuestions).where(inArray(localQuestions.unitId, unitIds)).execute();
        
        const mapped: Question[] = questionsRecord.map(q => ({
          id: q.id,
          prompt: q.prompt,
          options: JSON.parse(q.optionsJson),
          correctOptionId: q.correctOptionId,
          explanation: q.explanation || ''
        }));
        setAvailableQuestions(mapped);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [subjectId]);

  const startQuiz = () => {
    if (availableQuestions.length > 0) {
      // For MVP, just take all available questions
      initializeQuiz(String(subjectId), availableQuestions);
      router.replace('/quiz/active');
    }
  };

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz Setup</Text>
      <Text style={styles.text}>Found {availableQuestions.length} questions for this subject.</Text>
      
      <View style={{height: 20}}/>
      <Button 
        title={availableQuestions.length > 0 ? "Start Quiz" : "No Questions Available"} 
        onPress={startQuiz} 
        disabled={availableQuestions.length === 0} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold' },
  text: { fontSize: 16, marginTop: 10 }
});
