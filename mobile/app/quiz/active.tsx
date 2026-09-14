import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../../src/core/store/quizStore';
import { colors, shadows } from '../../src/core/theme/colors';
import { typography } from '../../src/core/theme/typography';

export default function ActiveQuizScreen() {
  const router = useRouter();
  const { 
    questions, 
    currentIndex, 
    selectedOptionId, 
    isAnswerSubmitted, 
    selectOption, 
    submitAnswer, 
    nextQuestion 
  } = useQuizStore();

  const currentQ = questions[currentIndex];

  if (!currentQ) {
    return <View style={styles.container}><Text>No active quiz found.</Text></View>;
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      nextQuestion();
    } else {
      router.replace('/quiz/results');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>
      </View>

      <Text style={styles.prompt}>{currentQ.prompt}</Text>
      
      <View style={styles.options}>
        {currentQ.options.map(option => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = currentQ.correctOptionId === option.id;
          
          let bgColor = '#fff';
          let borderColor = colors.border;
          
          if (isAnswerSubmitted) {
            if (isCorrect) {
              bgColor = colors.success + '20';
              borderColor = colors.success;
            } else if (isSelected && !isCorrect) {
              bgColor = colors.error + '20';
              borderColor = colors.error;
            }
          } else if (isSelected) {
            bgColor = colors.primary + '10';
            borderColor = colors.primary;
          }

          return (
            <TouchableOpacity 
              key={option.id}
              style={[styles.optionCard, { backgroundColor: bgColor, borderColor }]}
              onPress={() => selectOption(option.id)}
              disabled={isAnswerSubmitted}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isAnswerSubmitted && currentQ.explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>Explanation</Text>
          <Text style={styles.explanationText}>{currentQ.explanation}</Text>
        </View>
      )}

      <View style={styles.footer}>
        {!isAnswerSubmitted ? (
          <TouchableOpacity 
            style={[styles.button, !selectedOptionId && styles.buttonDisabled]} 
            onPress={submitAnswer}
            disabled={!selectedOptionId}
          >
            <Text style={styles.buttonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 20 },
  progressText: { ...typography.caption, fontSize: 16 },
  prompt: { ...typography.h2, marginBottom: 24 },
  options: { marginBottom: 20 },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    ...shadows.sm,
  },
  optionText: { ...typography.bodyLg },
  explanationBox: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  explanationTitle: { ...typography.h3, color: colors.primary, marginBottom: 8 },
  explanationText: { ...typography.body },
  footer: { marginTop: 20 },
  button: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.sm,
  },
  buttonDisabled: { backgroundColor: colors.border },
  buttonText: { ...typography.h3, color: '#fff' }
});
