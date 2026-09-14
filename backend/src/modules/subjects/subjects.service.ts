import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../utils/errors.js';

export class SubjectsService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * List all subjects, optionally filtered by stream and grade level.
   */
  async listSubjects(filters: {
    stream?: string;
    gradeLevel?: number;
  }) {
    const where: { stream?: string; gradeLevel?: number } = {};
    if (filters.stream) where.stream = filters.stream;
    if (filters.gradeLevel) where.gradeLevel = filters.gradeLevel;

    const subjects = await this.prisma.subject.findMany({
      where,
      include: {
        _count: { select: { units: true } },
      },
      orderBy: { name: 'asc' },
    });

    return subjects.map((s) => ({
      id: s.id,
      name: s.name,
      stream: s.stream,
      gradeLevel: s.gradeLevel,
      iconName: s.iconName,
      unitCount: s._count.units,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  /**
   * Get a single subject with all its units and note/question counts.
   */
  async getSubjectById(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        units: {
          orderBy: { unitNumber: 'asc' },
          include: {
            _count: { select: { notes: true, questions: true } },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundError('Subject not found');
    }

    return {
      id: subject.id,
      name: subject.name,
      stream: subject.stream,
      gradeLevel: subject.gradeLevel,
      iconName: subject.iconName,
      createdAt: subject.createdAt.toISOString(),
      units: subject.units.map((u) => ({
        id: u.id,
        unitNumber: u.unitNumber,
        title: u.title,
        noteCount: u._count.notes,
        questionCount: u._count.questions,
      })),
    };
  }
}
