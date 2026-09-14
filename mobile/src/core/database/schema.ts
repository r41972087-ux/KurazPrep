import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const localSubjects = sqliteTable('local_subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  stream: text('stream'),
  gradeLevel: integer('grade_level').notNull(),
  iconName: text('icon_name'),
  updatedAt: text('updated_at').notNull(),
});

export const localUnits = sqliteTable('local_units', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull().references(() => localSubjects.id),
  unitNumber: integer('unit_number').notNull(),
  title: text('title').notNull(),
});

export const localShortNotes = sqliteTable('local_short_notes', {
  id: text('id').primaryKey(),
  unitId: text('unit_id').notNull().references(() => localUnits.id),
  title: text('title').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  isHighYield: integer('is_high_yield', { mode: 'boolean' }).default(false),
  curriculumVersion: text('curriculum_version').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
});

export const localQuestions = sqliteTable('local_questions', {
  id: text('id').primaryKey(),
  unitId: text('unit_id').notNull().references(() => localUnits.id),
  prompt: text('prompt').notNull(),
  optionsJson: text('options_json').notNull(), // Serialized JSON array of options
  correctOptionId: text('correct_option_id').notNull(),
  explanation: text('explanation'),
  isHighYield: integer('is_high_yield', { mode: 'boolean' }).default(false),
});

export const localQuizAttempts = sqliteTable('local_quiz_attempts', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull().references(() => localSubjects.id),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  completedAt: text('completed_at').notNull(),
  isSynced: integer('is_synced', { mode: 'boolean' }).default(false),
});

export const syncMetadata = sqliteTable('sync_metadata', {
  subjectId: text('subject_id').primaryKey(),
  contentHash: text('content_hash').notNull(),
  lastSyncedAt: text('last_synced_at').notNull(),
});
