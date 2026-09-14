import type { PrismaClient } from '@prisma/client';

export class ProgressService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Record a completed quiz attempt with per-question details.
   */
  async submitQuizResult(
    userId: string,
    data: {
      subjectId: string;
      score: number;
      totalQuestions: number;
      details: Array<{
        questionId: string;
        selectedOption: string;
        isCorrect: boolean;
      }>;
    },
  ) {
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        subjectId: data.subjectId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        details: {
          create: data.details.map((d) => ({
            questionId: d.questionId,
            selectedOption: d.selectedOption,
            isCorrect: d.isCorrect,
          })),
        },
      },
    });

    return {
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      completedAt: attempt.completedAt.toISOString(),
    };
  }

  /**
   * Build the progress dashboard: overall stats, per-subject progress,
   * weak areas (units with < 60% accuracy), and recent attempts.
   */
  async getDashboard(userId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        subject: true,
        details: {
          include: {
            question: { include: { unit: true } },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    // ── Overall Stats ──────────────────────────────────────────
    const totalQuizzes = attempts.length;
    const allDetails = attempts.flatMap((a) => a.details);
    const totalQuestionsAnswered = allDetails.length;
    const correctAnswers = allDetails.filter((d) => d.isCorrect).length;
    const averageScore =
      totalQuizzes > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes
        : 0;

    // ── Per-Subject Progress ───────────────────────────────────
    const subjectMap = new Map<
      string,
      { subjectId: string; subjectName: string; scores: number[]; lastDate: Date | null }
    >();

    for (const attempt of attempts) {
      let entry = subjectMap.get(attempt.subjectId);
      if (!entry) {
        entry = {
          subjectId: attempt.subjectId,
          subjectName: attempt.subject.name,
          scores: [],
          lastDate: null,
        };
        subjectMap.set(attempt.subjectId, entry);
      }
      entry.scores.push(attempt.score);
      if (!entry.lastDate || attempt.completedAt > entry.lastDate) {
        entry.lastDate = attempt.completedAt;
      }
    }

    const subjectProgress = Array.from(subjectMap.values()).map((sp) => ({
      subjectId: sp.subjectId,
      subjectName: sp.subjectName,
      totalAttempts: sp.scores.length,
      averageScore:
        Math.round(
          (sp.scores.reduce((a, b) => a + b, 0) / sp.scores.length) * 100,
        ) / 100,
      lastAttemptDate: sp.lastDate?.toISOString() ?? null,
    }));

    // ── Weak Areas (units with < 60% accuracy) ─────────────────
    const unitMap = new Map<
      string,
      {
        unitId: string;
        unitTitle: string;
        subjectName: string;
        total: number;
        correct: number;
      }
    >();

    for (const detail of allDetails) {
      const unitId = detail.question.unitId;
      let entry = unitMap.get(unitId);
      if (!entry) {
        // Find subject name from attempts
        const parentAttempt = attempts.find((a) =>
          a.details.some((d) => d.question.unitId === unitId),
        );
        entry = {
          unitId,
          unitTitle: detail.question.unit.title,
          subjectName: parentAttempt?.subject.name ?? '',
          total: 0,
          correct: 0,
        };
        unitMap.set(unitId, entry);
      }
      entry.total++;
      if (detail.isCorrect) entry.correct++;
    }

    const weakAreas = Array.from(unitMap.values())
      .map((u) => ({
        unitId: u.unitId,
        unitTitle: u.unitTitle,
        subjectName: u.subjectName,
        accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 10000) / 100 : 0,
        totalQuestions: u.total,
        correctCount: u.correct,
      }))
      .filter((u) => u.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    // ── Recent Attempts (top 10) ───────────────────────────────
    const recentAttempts = attempts.slice(0, 10).map((a) => ({
      id: a.id,
      subjectName: a.subject.name,
      score: a.score,
      totalQuestions: a.totalQuestions,
      completedAt: a.completedAt.toISOString(),
    }));

    return {
      overallStats: {
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        totalQuestionsAnswered,
        correctAnswers,
      },
      subjectProgress,
      weakAreas,
      recentAttempts,
    };
  }
}
