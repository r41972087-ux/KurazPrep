import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../src/core/database/db';
import { localSubjects, localUnits, localShortNotes } from '../../src/core/database/schema';
import { eq } from 'drizzle-orm';
import { colors, shadows } from '../../src/core/theme/colors';
import { typography } from '../../src/core/theme/typography';
import { FileText, PlayCircle } from 'lucide-react-native';

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [subject, setSubject] = useState<any>(null);
  const [sections, setSections] = useState<{title: string, data: any[]}[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      // Load Subject
      const subj = await db.select().from(localSubjects).where(eq(localSubjects.id, String(id))).get();
      setSubject(subj);

      // Load Units and Notes
      const units = await db.select().from(localUnits).where(eq(localUnits.subjectId, String(id))).execute();
      
      const loadedSections = [];
      for (const unit of units) {
        const notes = await db.select().from(localShortNotes).where(eq(localShortNotes.unitId, unit.id)).execute();
        loadedSections.push({
          title: `Unit ${unit.unitNumber}: ${unit.title}`,
          unitId: unit.id,
          data: notes
        });
      }
      setSections(loadedSections);
    };
    loadDetails();
  }, [id]);

  if (!subject) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.header}>{subject.name}</Text>
        <TouchableOpacity 
          style={styles.quizButton}
          onPress={() => router.push(`/quiz/setup?subjectId=${subject.id}`)}
        >
          <PlayCircle color="#fff" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.quizButtonText}>Practice Quiz</Text>
        </TouchableOpacity>
      </View>
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.noteItem}
            onPress={() => router.push(`/note/${item.id}`)}
          >
            <FileText color={colors.primary} size={20} style={{ marginRight: 12 }} />
            <Text style={styles.noteTitle}>{item.title}</Text>
            {item.isHighYield && <View style={styles.badge}><Text style={styles.badgeText}>High Yield</Text></View>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerArea: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: colors.border },
  header: { ...typography.h1, marginBottom: 16 },
  quizButton: { 
    flexDirection: 'row', 
    backgroundColor: colors.secondary, 
    padding: 12, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...shadows.sm 
  },
  quizButtonText: { ...typography.h3, color: '#fff', fontSize: 16 },
  sectionHeader: { ...typography.h3, padding: 16, paddingTop: 24, backgroundColor: colors.background },
  noteItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    marginHorizontal: 16, 
    marginBottom: 8, 
    borderRadius: 8,
    ...shadows.sm 
  },
  noteTitle: { ...typography.body, flex: 1 },
  badge: { backgroundColor: colors.warning + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: colors.warning, fontSize: 10, fontWeight: 'bold' }
});
