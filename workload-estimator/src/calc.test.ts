import { calculateWorkload } from './calc';

test('calculates workload for no assignments', () => {
  const inputValues = wrapInputs({
    classWeeks: 15,
    readingPages: 0,
    pageDensity: '450 Words',
    difficulty: 'No New Concepts',
    purpose: 'Survey',
    pagesPerHour: 20,
    semesterPages: 0,
    pageDensityWriting: '250 Words',
    genre: 'Reflection/Narrative',
    drafting: 'No Drafting',
    hoursPerPage: 1,
    weeklyVideos: 0,
    discussionPosts: 0,
    discussionFormat: 'Text',
    avgLength: 250,
    avgLengthMinutes: 3,
    discussionHoursPerWeek: 0,
    exams: 0,
    studyHours: 0,
    takeHomeExams: false,
    examTimeLimit: 60,
    numberPerSemester: 0,
    hoursPerAssignment: 0,
    meetingsPerWeek: 0,
    meetingLength: 0,
    readingRateCheckbox: false,
    writingRateCheckbox: false,
    discussionRateCheckbox: false,
    independent: false
  });

  const expectedOutput = {
    total: 0,
    independentTime: 0,
    contactTime: 0,
    readingRate: 67,
    writingRate: 0.75,
    discussionTime: 0,
  };

  const output = calculateWorkload(inputValues).workload;
  compareWorkload(output, expectedOutput);
});

test('calculates workload with no manual overrides or checkboxes checked', () => {
  const inputValues = wrapInputs({
    classWeeks: 15,
    readingPages: 30,
    pageDensity: '450 Words',
    difficulty: 'Some New Concepts',
    purpose: 'Understand',
    pagesPerHour: 20,
    semesterPages: 10,
    pageDensityWriting: '250 Words',
    genre: 'Argument',
    drafting: 'Minimal Drafting',
    hoursPerPage: 1,
    weeklyVideos: 2,
    discussionPosts: 1,
    discussionFormat: 'Text',
    avgLength: 250,
    avgLengthMinutes: 3,
    discussionHoursPerWeek: 0.5,
    exams: 2,
    studyHours: 5,
    takeHomeExams: false,
    examTimeLimit: 60,
    numberPerSemester: 1,
    hoursPerAssignment: 2,
    meetingsPerWeek: 1,
    meetingLength: 1,
    readingRateCheckbox: false,
    writingRateCheckbox: false,
    discussionRateCheckbox: false,
    independent: false
  });
  const expectedOutput = {
    total: 7.38,
    independentTime: 5.25,
    contactTime: 2.13,
    readingRate: 24,
    writingRate: 2,
    discussionTime: 1,
  };
  const output = calculateWorkload(inputValues).workload;
  compareWorkload(output, expectedOutput);
});

test('calculates workload with some checkboxes checked', () => {
  const inputValues = wrapInputs({
    classWeeks: 10,
    readingPages: 20,
    pageDensity: '600 Words',
    difficulty: 'Many New Concepts',
    purpose: 'Engage',
    pagesPerHour: 15,
    semesterPages: 25,
    pageDensityWriting: '500 Words',
    genre: 'Research',
    drafting: 'Extensive Drafting',
    hoursPerPage: 2,
    weeklyVideos: 1,
    discussionPosts: 2,
    discussionFormat: 'Audio/Video',
    avgLength: 0,
    avgLengthMinutes: 10,
    discussionHoursPerWeek: 1,
    exams: 1,
    studyHours: 8,
    takeHomeExams: true,
    examTimeLimit: 120,
    numberPerSemester: 2,
    hoursPerAssignment: 3,
    meetingsPerWeek: 2,
    meetingLength: 1.5,
    readingRateCheckbox: true,
    writingRateCheckbox: false,
    discussionRateCheckbox: true,
    independent: true
  });

  const expectedOutput = {
    total: 32.93,
    independentTime: 28.93,
    contactTime: 4,
    readingRate: 15,
    writingRate: 10,
    discussionTime: 1,
  };

  const output = calculateWorkload(inputValues).workload;
  compareWorkload(output, expectedOutput);
});

test('calculates workload with all checkboxes checked', () => {
  const inputValues = wrapInputs({
    classWeeks: 8,
    readingPages: 40,
    pageDensity: '750 Words',
    difficulty: 'Many New Concepts',
    purpose: 'Engage',
    pagesPerHour: 10,
    semesterPages: 60,
    pageDensityWriting: '500 Words',
    genre: 'Research',
    drafting: 'Extensive Drafting',
    hoursPerPage: 4,
    weeklyVideos: 3,
    discussionPosts: 3,
    discussionFormat: 'Audio/Video',
    avgLength: 0,
    avgLengthMinutes: 15,
    discussionHoursPerWeek: 2,
    exams: 2,
    studyHours: 12,
    takeHomeExams: true,
    examTimeLimit: 180,
    numberPerSemester: 4,
    hoursPerAssignment: 6,
    meetingsPerWeek: 4,
    meetingLength: 2,
    readingRateCheckbox: true,
    writingRateCheckbox: true,
    discussionRateCheckbox: true,
    independent: true
  });

  const expectedOutput = {
    total: 53.75,
    independentTime: 43.75,
    contactTime: 10,
    readingRate: 10,
    writingRate: 4,
    discussionTime: 2,
  };

  const output = calculateWorkload(inputValues).workload;
  compareWorkload(output, expectedOutput);
});

function compareWorkload(output: any, expected: any) {
  expect(output.total).toBeCloseTo(expected.total, 0.01);
  expect(output.independentTime).toBeCloseTo(expected.independentTime, 0.01);
  expect(output.contactTime).toBeCloseTo(expected.contactTime, 0.01);
  expect(output.readingRate).toBeCloseTo(expected.readingRate, 0.01);
  expect(output.writingRate).toBeCloseTo(expected.writingRate, 0.01);
  expect(output.discussionTime).toBeCloseTo(expected.discussionTime, 0.01);
}

function wrapInputs(inputs: Record<string, any>) {
  const wrapped: Record<string, any> = {};
  for (const key in inputs) {
    // If the key is a checkbox, wrap as { checked: ... }
    if (
      key.endsWith('Checkbox') ||
      key === 'takeHomeExams' ||
      key === 'independent'
    ) {
      wrapped[key] = { checked: Boolean(inputs[key]) };
    } else {
      wrapped[key] = { value: String(inputs[key]) };
    }
  }
  return wrapped;
}
