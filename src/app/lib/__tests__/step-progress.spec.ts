import { StepProgress } from '../step-progress';

type TestCaseEntry = [
  string, // description
  Record<string, number>, // step definition
  TestCaseDetail[], // test case details
];

interface TestCaseDetail {
  /** Key in step definition */
  stepKey: string;
  /** Percentage for stepKey */
  percentage: number;
  /** Expected overall percentage */
  expected: number;
}

describe('StepProgress', () => {
  const tc: TestCaseEntry[] = [
    [
      'single steps',
      { step1: 10 },
      [
        { stepKey: 'step1', percentage: 0, expected: 10 },
        { stepKey: 'step1', percentage: 50, expected: 55 },
        { stepKey: 'step1', percentage: 100, expected: 100 },
      ],
    ],
    [
      'two steps',
      { step1: 10, step2: 80 },
      [
        { stepKey: 'step1', percentage: 0, expected: 10 },
        { stepKey: 'step1', percentage: 50, expected: 45 },
        { stepKey: 'step1', percentage: 100, expected: 80 },
        { stepKey: 'step2', percentage: 0, expected: 80 },
        { stepKey: 'step2', percentage: 50, expected: 90 },
        { stepKey: 'step2', percentage: 100, expected: 100 },
      ],
    ],
  ];

  test.each(tc)('tc: %s', (description, definition, detail) => {
    let currentProgress: number | undefined = undefined;
    const progress = StepProgress.fromSteps(definition, async (p) => {
      currentProgress = p;
    });

    // Current progress should be initialized to 0
    expect(currentProgress).toBe(0);

    for (const entry of detail) {
      const { stepKey, percentage, expected } = entry;
      progress[stepKey].set(percentage);
      expect(currentProgress).toBe(expected);
    }
  });
});
