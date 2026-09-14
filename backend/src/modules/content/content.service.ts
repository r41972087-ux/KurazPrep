import type { PrismaClient } from '@prisma/client';
import { computeContentHash } from '../../utils/hash.js';
import { NotFoundError } from '../../utils/errors.js';

export class ContentService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Build the full sync payload for a subject: all units, notes, and questions.
   * Also computes and stores a contentHash for delta sync.
   *
   * The client sends `If-None-Match: "<hash>"` on subsequent requests.
   * If the hash matches, the route returns 304 Not Modified.
   */
  async getSubjectSyncPayload(subjectId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        units: {
          orderBy: { unitNumber: 'asc' },
          include: {
            notes: { orderBy: { orderIndex: 'asc' } },
            questions: { orderBy: { id: 'asc' } },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundError('Subject not found');
    }

    // Build the payload
    const units = subject.units.map((unit) => ({
      id: unit.id,
      unitNumber: unit.unitNumber,
      title: unit.title,
      notes: unit.notes.map((note) => ({
        id: note.id,
        title: note.title,
        contentMarkdown: note.contentMarkdown,
        orderIndex: note.orderIndex,
        isHighYield: note.isHighYield,
        curriculumVersion: note.curriculumVersion,
        isVerified: note.isVerified,
        updatedAt: note.updatedAt.toISOString(),
      })),
      questions: unit.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options as Array<{ id: string; text: string }>,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        difficulty: q.difficulty,
        sourceExamYear: q.sourceExamYear,
        isHighYield: q.isHighYield,
        curriculumVersion: q.curriculumVersion,
      })),
    }));

    // Deterministic hash of all content for delta sync comparison
    const contentHash = computeContentHash(units);

    // Persist the hash so we can quickly compare without recomputing
    if (subject.contentHash !== contentHash) {
      await this.prisma.subject.update({
        where: { id: subjectId },
        data: { contentHash },
      });
    }

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      stream: subject.stream,
      gradeLevel: subject.gradeLevel,
      contentHash,
      syncedAt: new Date().toISOString(),
      units,
    };
  }
}
