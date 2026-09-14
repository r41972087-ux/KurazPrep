/**
 * KurazPrep Seed Script
 *
 * Seeds the database with Grade 12 Physics (Natural Science):
 * - 1 Subject: Physics
 * - 2 Units: Vectors, Motion in Two Dimensions
 * - 5 Short Notes with Markdown + LaTeX
 * - 15 MCQs with explanations
 *
 * Run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KurazPrep database...\n');

  // ── Clear existing data (in dependency order) ─────────────────
  await prisma.quizAttemptDetail.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.shortNote.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Cleared existing data');

  // ── Subject: Physics ──────────────────────────────────────────
  const physics = await prisma.subject.create({
    data: {
      name: 'Physics',
      stream: 'NATURAL_SCIENCE',
      gradeLevel: 12,
      iconName: 'science',
    },
  });
  console.log(`✅ Created subject: ${physics.name} (${physics.id})`);

  // ────────────────────────────────────────────────────────────────
  // UNIT 1: Vectors
  // ────────────────────────────────────────────────────────────────
  const unit1 = await prisma.unit.create({
    data: {
      subjectId: physics.id,
      unitNumber: 1,
      title: 'Unit 1: Vectors',
    },
  });
  console.log(`  📚 Created unit: ${unit1.title}`);

  // ── Notes for Unit 1 ──────────────────────────────────────────
  await prisma.shortNote.createMany({
    data: [
      {
        unitId: unit1.id,
        title: 'Scalar and Vector Quantities',
        orderIndex: 1,
        isHighYield: true,
        contentMarkdown: `# Scalar and Vector Quantities

## Scalar Quantities
A **scalar** quantity has only magnitude (size). Examples:
- Mass ($m$) — e.g., 5 kg
- Temperature — e.g., 25°C
- Speed — e.g., 60 km/h
- Time — e.g., 3 seconds
- Energy — e.g., 100 J

## Vector Quantities
A **vector** quantity has both **magnitude and direction**. Examples:
- Displacement ($\\vec{d}$)
- Velocity ($\\vec{v}$)
- Acceleration ($\\vec{a}$)
- Force ($\\vec{F}$)
- Momentum ($\\vec{p}$)

> **Key Rule:** Vectors are represented by arrows. The length represents magnitude, and the arrowhead shows direction.

## Notation
- Vector: $\\vec{A}$ or **A** (bold)
- Magnitude: $|\\vec{A}|$ or simply $A$
- Unit vector: $\\hat{A} = \\frac{\\vec{A}}{|\\vec{A}|}$`,
      },
      {
        unitId: unit1.id,
        title: 'Vector Addition and Subtraction',
        orderIndex: 2,
        isHighYield: true,
        contentMarkdown: `# Vector Addition and Subtraction

## Triangle Law of Vector Addition
Place vectors **head to tail**. The resultant $\\vec{R}$ goes from the tail of the first to the head of the last.

$$\\vec{R} = \\vec{A} + \\vec{B}$$

## Parallelogram Law
Place two vectors **tail to tail**. The diagonal of the parallelogram gives the resultant.

$$|\\vec{R}| = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta}$$

where $\\theta$ is the angle between $\\vec{A}$ and $\\vec{B}$.

### Special Cases
| Angle $\\theta$ | Resultant $|\\vec{R}|$ |
|---|---|
| $0°$ (same direction) | $A + B$ |
| $180°$ (opposite) | $|A - B|$ |
| $90°$ (perpendicular) | $\\sqrt{A^2 + B^2}$ |

## Vector Subtraction
$$\\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B})$$

Reverse the direction of $\\vec{B}$, then add.`,
      },
      {
        unitId: unit1.id,
        title: 'Resolution of Vectors',
        orderIndex: 3,
        isHighYield: false,
        contentMarkdown: `# Resolution of Vectors

## Component Form
Any vector $\\vec{A}$ can be resolved into perpendicular components:

$$A_x = A\\cos\\theta \\qquad A_y = A\\sin\\theta$$

where $\\theta$ is measured from the positive x-axis.

## Reconstructing from Components
$$A = \\sqrt{A_x^2 + A_y^2}$$
$$\\theta = \\tan^{-1}\\left(\\frac{A_y}{A_x}\\right)$$

## Unit Vectors
- $\\hat{i}$ — unit vector along x-axis
- $\\hat{j}$ — unit vector along y-axis
- $\\hat{k}$ — unit vector along z-axis

$$\\vec{A} = A_x\\hat{i} + A_y\\hat{j}$$

## Adding Vectors by Components
To find $\\vec{R} = \\vec{A} + \\vec{B}$:
1. Find components: $R_x = A_x + B_x$, $R_y = A_y + B_y$
2. Find magnitude: $R = \\sqrt{R_x^2 + R_y^2}$
3. Find direction: $\\theta = \\tan^{-1}(R_y / R_x)$

> **Exam Tip:** Always resolve vectors into components when more than two vectors need to be added!`,
      },
    ],
  });
  console.log('    📝 Created 3 notes for Unit 1');

  // ── Questions for Unit 1 (8 MCQs) ────────────────────────────
  await prisma.question.createMany({
    data: [
      {
        unitId: unit1.id,
        prompt: 'Which of the following is a vector quantity?',
        options: [
          { id: 'A', text: 'Mass' },
          { id: 'B', text: 'Temperature' },
          { id: 'C', text: 'Displacement' },
          { id: 'D', text: 'Speed' },
        ],
        correctOptionId: 'C',
        explanation:
          'Displacement is a vector quantity because it has both magnitude and direction. Mass, temperature, and speed are scalar quantities.',
        difficulty: 'EASY',
        isHighYield: true,
        sourceExamYear: 2015,
      },
      {
        unitId: unit1.id,
        prompt:
          'Two forces of magnitudes 3 N and 4 N act at right angles to each other. What is the magnitude of the resultant force?',
        options: [
          { id: 'A', text: '1 N' },
          { id: 'B', text: '5 N' },
          { id: 'C', text: '7 N' },
          { id: 'D', text: '12 N' },
        ],
        correctOptionId: 'B',
        explanation:
          'When two vectors are perpendicular (θ = 90°), R = √(3² + 4²) = √(9 + 16) = √25 = 5 N.',
        difficulty: 'EASY',
        isHighYield: true,
        sourceExamYear: 2016,
      },
      {
        unitId: unit1.id,
        prompt:
          'What is the unit vector in the direction of A = 3î + 4ĵ?',
        options: [
          { id: 'A', text: '0.6î + 0.8ĵ' },
          { id: 'B', text: '3î + 4ĵ' },
          { id: 'C', text: 'î + ĵ' },
          { id: 'D', text: '0.8î + 0.6ĵ' },
        ],
        correctOptionId: 'A',
        explanation:
          'Unit vector  = A/|A|. |A| = √(3² + 4²) = 5. So  = (3/5)î + (4/5)ĵ = 0.6î + 0.8ĵ.',
        difficulty: 'MEDIUM',
        isHighYield: true,
      },
      {
        unitId: unit1.id,
        prompt:
          'If A = 2î − 3ĵ and B = −î + 5ĵ, what is A + B?',
        options: [
          { id: 'A', text: '3î − 8ĵ' },
          { id: 'B', text: 'î + 2ĵ' },
          { id: 'C', text: '−î + 2ĵ' },
          { id: 'D', text: '3î + 2ĵ' },
        ],
        correctOptionId: 'B',
        explanation:
          'A + B = (2 + (−1))î + ((−3) + 5)ĵ = 1î + 2ĵ = î + 2ĵ.',
        difficulty: 'EASY',
        isHighYield: false,
      },
      {
        unitId: unit1.id,
        prompt:
          'Two vectors of equal magnitude F act at an angle of 120° to each other. The magnitude of their resultant is:',
        options: [
          { id: 'A', text: '2F' },
          { id: 'B', text: 'F' },
          { id: 'C', text: 'F√3' },
          { id: 'D', text: 'F/2' },
        ],
        correctOptionId: 'B',
        explanation:
          'R = √(F² + F² + 2F²cos120°) = √(2F² + 2F²(−0.5)) = √(2F² − F²) = √(F²) = F.',
        difficulty: 'MEDIUM',
        isHighYield: true,
        sourceExamYear: 2017,
      },
      {
        unitId: unit1.id,
        prompt:
          'A vector P has a magnitude of 10 units and makes an angle of 30° with the x-axis. What is its x-component?',
        options: [
          { id: 'A', text: '5 units' },
          { id: 'B', text: '5√3 units' },
          { id: 'C', text: '10 units' },
          { id: 'D', text: '10√3 units' },
        ],
        correctOptionId: 'B',
        explanation:
          'Pₓ = P cos θ = 10 cos 30° = 10 × (√3/2) = 5√3 units.',
        difficulty: 'EASY',
        isHighYield: true,
      },
      {
        unitId: unit1.id,
        prompt:
          'The maximum and minimum magnitudes of the resultant of two forces are 18 N and 4 N respectively. The individual force magnitudes are:',
        options: [
          { id: 'A', text: '14 N and 4 N' },
          { id: 'B', text: '10 N and 8 N' },
          { id: 'C', text: '11 N and 7 N' },
          { id: 'D', text: '9 N and 9 N' },
        ],
        correctOptionId: 'C',
        explanation:
          'R_max = F₁ + F₂ = 18 N. R_min = |F₁ − F₂| = 4 N. Solving: F₁ = 11 N, F₂ = 7 N.',
        difficulty: 'HARD',
        isHighYield: true,
        sourceExamYear: 2018,
      },
      {
        unitId: unit1.id,
        prompt:
          'Which of the following operations is NOT defined for vectors?',
        options: [
          { id: 'A', text: 'Adding two vectors' },
          { id: 'B', text: 'Multiplying a vector by a scalar' },
          { id: 'C', text: 'Dividing a vector by another vector' },
          { id: 'D', text: 'Cross product of two vectors' },
        ],
        correctOptionId: 'C',
        explanation:
          'Division of one vector by another vector is not a defined operation in vector algebra. Addition, scalar multiplication, and cross product are all valid operations.',
        difficulty: 'EASY',
        isHighYield: false,
      },
    ],
  });
  console.log('    ❓ Created 8 questions for Unit 1');

  // ────────────────────────────────────────────────────────────────
  // UNIT 2: Motion in Two Dimensions
  // ────────────────────────────────────────────────────────────────
  const unit2 = await prisma.unit.create({
    data: {
      subjectId: physics.id,
      unitNumber: 2,
      title: 'Unit 2: Motion in Two Dimensions',
    },
  });
  console.log(`  📚 Created unit: ${unit2.title}`);

  // ── Notes for Unit 2 ──────────────────────────────────────────
  await prisma.shortNote.createMany({
    data: [
      {
        unitId: unit2.id,
        title: 'Projectile Motion',
        orderIndex: 1,
        isHighYield: true,
        contentMarkdown: `# Projectile Motion

## Definition
**Projectile motion** is the motion of an object launched into the air, subject only to gravity (air resistance neglected).

## Key Assumptions
- Acceleration due to gravity: $g = 9.8 \\text{ m/s}^2$ (downward)
- No air resistance
- $a_x = 0$ (no horizontal acceleration)
- $a_y = -g$ (constant downward)

## Equations of Motion
For a projectile launched at angle $\\theta$ with initial speed $v_0$:

### Horizontal (uniform velocity):
$$x = v_0 \\cos\\theta \\cdot t$$

### Vertical (uniformly accelerated):
$$y = v_0 \\sin\\theta \\cdot t - \\frac{1}{2}gt^2$$
$$v_y = v_0 \\sin\\theta - gt$$

## Key Formulas

### Time of flight:
$$T = \\frac{2v_0 \\sin\\theta}{g}$$

### Maximum height:
$$H = \\frac{v_0^2 \\sin^2\\theta}{2g}$$

### Range (horizontal distance):
$$R = \\frac{v_0^2 \\sin 2\\theta}{g}$$

> **Key Insight:** Maximum range occurs at $\\theta = 45°$ because $\\sin 2\\theta$ is maximized ($\\sin 90° = 1$).

## Symmetry Properties
- Time to reach max height = half the total time of flight
- Angles $\\theta$ and $(90° - \\theta)$ give the **same range** but different heights
- At the highest point, $v_y = 0$ but $v_x = v_0\\cos\\theta \\neq 0$`,
      },
      {
        unitId: unit2.id,
        title: 'Uniform Circular Motion',
        orderIndex: 2,
        isHighYield: true,
        contentMarkdown: `# Uniform Circular Motion

## Definition
**Uniform circular motion** is motion in a circle at constant speed. Although speed is constant, the velocity changes direction continuously, so the object is always accelerating.

## Key Quantities

### Period ($T$)
Time for one complete revolution:
$$T = \\frac{2\\pi r}{v}$$

### Frequency ($f$)
Number of revolutions per second:
$$f = \\frac{1}{T}$$

### Angular velocity ($\\omega$)
$$\\omega = \\frac{2\\pi}{T} = 2\\pi f = \\frac{v}{r}$$

## Centripetal Acceleration
The acceleration always points **toward the center** of the circle:
$$a_c = \\frac{v^2}{r} = \\omega^2 r$$

## Centripetal Force
$$F_c = ma_c = \\frac{mv^2}{r} = m\\omega^2 r$$

> **Important:** Centripetal force is not a new type of force — it is the net inward force that could be tension, gravity, friction, or normal force depending on the situation.

## Examples
| Situation | Source of $F_c$ |
|---|---|
| Planet orbiting Sun | Gravitational force |
| Car turning on road | Friction |
| Ball on a string | Tension |
| Electron in atom | Electrostatic force |`,
      },
    ],
  });
  console.log('    📝 Created 2 notes for Unit 2');

  // ── Questions for Unit 2 (7 MCQs) ────────────────────────────
  await prisma.question.createMany({
    data: [
      {
        unitId: unit2.id,
        prompt:
          'A ball is launched at 45° with an initial speed of 20 m/s. What is the maximum height reached? (Use g = 10 m/s²)',
        options: [
          { id: 'A', text: '5 m' },
          { id: 'B', text: '10 m' },
          { id: 'C', text: '20 m' },
          { id: 'D', text: '40 m' },
        ],
        correctOptionId: 'B',
        explanation:
          'H = v₀²sin²θ / (2g) = 20² × sin²45° / (2×10) = 400 × 0.5 / 20 = 10 m.',
        difficulty: 'MEDIUM',
        isHighYield: true,
        sourceExamYear: 2016,
      },
      {
        unitId: unit2.id,
        prompt:
          'At the highest point of a projectile trajectory, which statement is true?',
        options: [
          { id: 'A', text: 'Both velocity and acceleration are zero' },
          { id: 'B', text: 'Velocity is zero but acceleration is g downward' },
          { id: 'C', text: 'Vertical velocity is zero but horizontal velocity is non-zero' },
          { id: 'D', text: 'Speed is at its maximum value' },
        ],
        correctOptionId: 'C',
        explanation:
          'At the highest point, vy = 0 but vx = v₀cosθ remains constant. Acceleration (g downward) acts at all times.',
        difficulty: 'MEDIUM',
        isHighYield: true,
        sourceExamYear: 2017,
      },
      {
        unitId: unit2.id,
        prompt:
          'The range of a projectile is maximum when the angle of projection is:',
        options: [
          { id: 'A', text: '30°' },
          { id: 'B', text: '45°' },
          { id: 'C', text: '60°' },
          { id: 'D', text: '90°' },
        ],
        correctOptionId: 'B',
        explanation:
          'Range R = v₀²sin2θ / g. R is maximum when sin2θ = 1, i.e., 2θ = 90°, so θ = 45°.',
        difficulty: 'EASY',
        isHighYield: true,
        sourceExamYear: 2015,
      },
      {
        unitId: unit2.id,
        prompt:
          'A car moves around a circular track of radius 50 m at a constant speed of 10 m/s. What is its centripetal acceleration?',
        options: [
          { id: 'A', text: '0.5 m/s²' },
          { id: 'B', text: '2 m/s²' },
          { id: 'C', text: '5 m/s²' },
          { id: 'D', text: '500 m/s²' },
        ],
        correctOptionId: 'B',
        explanation:
          'a_c = v²/r = 10²/50 = 100/50 = 2 m/s².',
        difficulty: 'EASY',
        isHighYield: true,
      },
      {
        unitId: unit2.id,
        prompt:
          'In uniform circular motion, the centripetal acceleration is directed:',
        options: [
          { id: 'A', text: 'Along the tangent to the circle' },
          { id: 'B', text: 'Away from the center' },
          { id: 'C', text: 'Toward the center of the circle' },
          { id: 'D', text: 'In the direction of motion' },
        ],
        correctOptionId: 'C',
        explanation:
          'Centripetal means "center-seeking." The centripetal acceleration always points toward the center of the circular path.',
        difficulty: 'EASY',
        isHighYield: true,
      },
      {
        unitId: unit2.id,
        prompt:
          'A projectile is fired at 30° above the horizontal. At what other angle would it have the same range?',
        options: [
          { id: 'A', text: '45°' },
          { id: 'B', text: '60°' },
          { id: 'C', text: '75°' },
          { id: 'D', text: '90°' },
        ],
        correctOptionId: 'B',
        explanation:
          'Complementary angles give the same range: 90° − 30° = 60°. Both sin2(30°) = sin60° and sin2(60°) = sin120° have the same value.',
        difficulty: 'MEDIUM',
        isHighYield: true,
        sourceExamYear: 2018,
      },
      {
        unitId: unit2.id,
        prompt:
          'If the radius of a circular orbit is doubled while keeping the speed constant, the centripetal acceleration becomes:',
        options: [
          { id: 'A', text: 'Double' },
          { id: 'B', text: 'Half' },
          { id: 'C', text: 'Four times' },
          { id: 'D', text: 'One-fourth' },
        ],
        correctOptionId: 'B',
        explanation:
          'a_c = v²/r. If r → 2r and v stays constant: a_c(new) = v²/(2r) = (1/2)(v²/r) = half the original.',
        difficulty: 'MEDIUM',
        isHighYield: false,
      },
    ],
  });
  console.log('    ❓ Created 7 questions for Unit 2');

  // ── Summary ───────────────────────────────────────────────────
  const counts = {
    subjects: await prisma.subject.count(),
    units: await prisma.unit.count(),
    notes: await prisma.shortNote.count(),
    questions: await prisma.question.count(),
  };

  console.log('\n🎉 Seed complete!');
  console.log(`   Subjects:  ${counts.subjects}`);
  console.log(`   Units:     ${counts.units}`);
  console.log(`   Notes:     ${counts.notes}`);
  console.log(`   Questions: ${counts.questions}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
