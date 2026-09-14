import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../src/core/database/db';
import { localShortNotes } from '../../src/core/database/schema';
import { eq } from 'drizzle-orm';
import { MarkdownRenderer } from '../../src/components/MarkdownRenderer';
import { colors } from '../../src/core/theme/colors';

export default function NoteReaderScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    const loadNote = async () => {
      const n = await db.select().from(localShortNotes).where(eq(localShortNotes.id, String(id))).get();
      setNote(n);
    };
    loadNote();
  }, [id]);

  if (!note) return <View style={styles.container}><Text>Loading note...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MarkdownRenderer>{note.contentMarkdown}</MarkdownRenderer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 }
});
