import { Type, type Static } from '@sinclair/typebox';

// ─── Request Schemas ─────────────────────────────────────────────────

export const SubjectParamsSchema = Type.Object({
  id: Type.String(),
});
export type SubjectParams = Static<typeof SubjectParamsSchema>;

export const SubjectsQuerySchema = Type.Object({
  stream: Type.Optional(
    Type.Union([
      Type.Literal('NATURAL_SCIENCE'),
      Type.Literal('SOCIAL_SCIENCE'),
    ]),
  ),
  gradeLevel: Type.Optional(Type.Integer({ minimum: 11, maximum: 12 })),
});
export type SubjectsQuery = Static<typeof SubjectsQuerySchema>;

// ─── Response Schemas ────────────────────────────────────────────────

const UnitSummarySchema = Type.Object({
  id: Type.String(),
  unitNumber: Type.Integer(),
  title: Type.String(),
  noteCount: Type.Integer(),
  questionCount: Type.Integer(),
});

export const SubjectListItemSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  stream: Type.String(),
  gradeLevel: Type.Integer(),
  iconName: Type.String(),
  unitCount: Type.Integer(),
  createdAt: Type.String(),
});

export const SubjectDetailSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  stream: Type.String(),
  gradeLevel: Type.Integer(),
  iconName: Type.String(),
  createdAt: Type.String(),
  units: Type.Array(UnitSummarySchema),
});

export const SubjectsListSchema = Type.Array(SubjectListItemSchema);
