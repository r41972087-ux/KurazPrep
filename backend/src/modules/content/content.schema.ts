import { Type } from '@sinclair/typebox';

// ─── Request Schemas ─────────────────────────────────────────────────

export const SyncParamsSchema = Type.Object({
  id: Type.String({ description: 'Subject UUID' }),
});

// ─── Response Schemas ────────────────────────────────────────────────

const ShortNoteSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  contentMarkdown: Type.String(),
  orderIndex: Type.Integer(),
  isHighYield: Type.Boolean(),
  curriculumVersion: Type.String(),
  isVerified: Type.Boolean(),
  updatedAt: Type.String(),
});

const QuestionOptionSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
});

const QuestionSchema = Type.Object({
  id: Type.String(),
  prompt: Type.String(),
  options: Type.Array(QuestionOptionSchema),
  correctOptionId: Type.String(),
  explanation: Type.String(),
  difficulty: Type.String(),
  sourceExamYear: Type.Union([Type.Integer(), Type.Null()]),
  isHighYield: Type.Boolean(),
  curriculumVersion: Type.String(),
});

const UnitSyncSchema = Type.Object({
  id: Type.String(),
  unitNumber: Type.Integer(),
  title: Type.String(),
  notes: Type.Array(ShortNoteSchema),
  questions: Type.Array(QuestionSchema),
});

export const SyncPayloadSchema = Type.Object({
  subjectId: Type.String(),
  subjectName: Type.String(),
  stream: Type.String(),
  gradeLevel: Type.Integer(),
  contentHash: Type.String({ description: 'SHA-256 hash of the content — use as ETag for delta sync' }),
  syncedAt: Type.String(),
  units: Type.Array(UnitSyncSchema),
});
