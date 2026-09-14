import { api } from './api';
import { db } from '../database/db';
import { localSubjects, localUnits, localShortNotes, localQuestions, localQuizAttempts } from '../database/schema';
import { eq } from 'drizzle-orm';

// A simple sync function for MVP.
// In a production app, we would use transactions and contentHashes to optimize this.
export const syncCurriculum = async () => {
  try {
    // 1. Fetch all subjects
    const subjectsResponse = await api.get('/subjects');
    const subjects = subjectsResponse.data;

    for (const subject of subjects) {
      // 2. Fetch full sync payload for each subject
      // In a real scenario, check syncMetadata table and send If-None-Match header.
      const syncResponse = await api.get(`/subjects/${subject.id}/sync`);
      const payload = syncResponse.data;

      // 3. Insert/upsert into local database
      // (Using basic insert with onConflictDoUpdate in a full Drizzle setup,
      // but for MVP we can just clear and re-insert if no transactions are handy,
      // or simply rely on unique constraints)
      
      // Upsert Subject
      await db.insert(localSubjects).values({
        id: payload.subject.id,
        name: payload.subject.name,
        stream: payload.subject.stream,
        gradeLevel: payload.subject.gradeLevel,
        updatedAt: new Date().toISOString(),
      }).onConflictDoUpdate({
        target: localSubjects.id,
        set: { name: payload.subject.name, updatedAt: new Date().toISOString() }
      });

      // Upsert Units
      for (const unit of payload.units) {
        await db.insert(localUnits).values({
          id: unit.id,
          subjectId: payload.subject.id,
          unitNumber: unit.unitNumber,
          title: unit.title,
        }).onConflictDoNothing(); // Basic strategy for MVP

        // Upsert Notes
        for (const note of unit.notes) {
          await db.insert(localShortNotes).values({
            id: note.id,
            unitId: unit.id,
            title: note.title,
            contentMarkdown: note.contentMarkdown,
            isHighYield: note.isHighYield,
            curriculumVersion: note.curriculumVersion,
            isVerified: note.isVerified,
          }).onConflictDoNothing();
        }

        // Upsert Questions
        for (const question of unit.questions) {
          await db.insert(localQuestions).values({
            id: question.id,
            unitId: unit.id,
            prompt: question.prompt,
            optionsJson: JSON.stringify(question.options),
            correctOptionId: question.correctOptionId,
            explanation: question.explanation,
            isHighYield: question.isHighYield,
          }).onConflictDoNothing();
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Curriculum sync error:', error);
    return false;
  }
};

export const syncQuizAttempts = async () => {
  try {
    const pendingAttempts = await db
      .select()
      .from(localQuizAttempts)
      .where(eq(localQuizAttempts.isSynced, false))
      .execute();

    if (pendingAttempts.length === 0) return true;

    for (const attempt of pendingAttempts) {
      await api.post('/progress/quiz', {
        subjectId: attempt.subjectId,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
      });

      // Mark as synced
      await db
        .update(localQuizAttempts)
        .set({ isSynced: true })
        .where(eq(localQuizAttempts.id, attempt.id))
        .execute();
    }
    return true;
  } catch (error) {
    console.error('Quiz sync error:', error);
    return false; // Silently fail, will retry later
  }
};
