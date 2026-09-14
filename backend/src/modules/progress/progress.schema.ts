import { Type } from '@sinclair/typebox';

// ─── Request Schemas ─────────────────────────────────────────────────

export const QuizSubmitBodySchema = Type.Object({
  subjectId: Type.String(),
  score: Type.Number({ minimum: 0, maximum: 100 }),
  totalQuestions: Type.Integer({ minimum: 1 }),
  details: Type.Array(
    Type.Object({
      questionId: Type.String(),
      selectedOption: Type.String(),
      isCorrect: Type.Boolean(),
    }),
  ),
});

// ─── Response Schemas ────────────────────────────────────────────────

export const QuizSubmitResponseSchema = Type.Object({
  id: Type.String(),
  score: Type.Number(),
  totalQuestions: Type.Integer(),
  completedAt: Type.String(),
});

const SubjectProgressSchema = Type.Object({
  subjectId: Type.String(),
  subjectName: Type.String(),
  totalAttempts: Type.Integer(),
  averageScore: Type.Number(),
  lastAttemptDate: Type.Union([Type.String(), Type.Null()]),
});

const WeakAreaSchema = Type.Object({
  unitId: Type.String(),
  unitTitle: Type.String(),
  subjectName: Type.String(),
  accuracy: Type.Number(),
  totalQuestions: Type.Integer(),
  correctCount: Type.Integer(),
});

const RecentAttemptSchema = Type.Object({
  id: Type.String(),
  subjectName: Type.String(),
  score: Type.Number(),
  totalQuestions: Type.Integer(),
  completedAt: Type.String(),
});

export const DashboardResponseSchema = Type.Object({
  overallStats: Type.Object({
    totalQuizzes: Type.Integer(),
    averageScore: Type.Number(),
    totalQuestionsAnswered: Type.Integer(),
    correctAnswers: Type.Integer(),
  }),
  subjectProgress: Type.Array(SubjectProgressSchema),
  weakAreas: Type.Array(WeakAreaSchema),
  recentAttempts: Type.Array(RecentAttemptSchema),
});
