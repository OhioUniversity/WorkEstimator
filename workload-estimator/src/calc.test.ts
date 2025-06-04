import { calculateWorkload } from './calc';

test('calculates workload for no assignments', () => {
  const inputValues = {
    classWeeks: { value: '15' },
    readingPages: { value: '0' },
    pageDensity: { value: '450 Words' },
    difficulty: { value: 'No New Concepts' },
    purpose: { value: 'Survey' },
    pagesPerHour: { value: '20' },
    semesterPages: { value: '0' },
    pageDensityWriting: { value: '250 Words' },
    genre: { value: 'Reflection/Narrative' },
    drafting: { value: 'No Drafting' },
    hoursPerPage: { value: '1' },
    weeklyVideos: { value: '0' },
    discussionPosts: { value: '0' },
    discussionFormat: { value: 'Text' },
    avgLength: { value: '250' },
    avgLengthMinutes: { value: '3' },
    discussionHoursPerWeek: { value: '0' },
    exams: { value: '0' },
    studyHours: { value: '0' },
    takeHomeExams: { checked: false },
    examTimeLimit: { value: '60' },
    numberPerSemester: { value: '0' },
    hoursPerAssignment: { value: '0' },
    meetingsPerWeek: { value: '0' },
    meetingLength: { value: '0' },
    readingRateCheckbox: { checked: false },
    writingRateCheckbox: { checked: false },
    discussionRateCheckbox: { checked: false },
    independent: { checked: false }
  };

  const expectedOutput = {
    total: 0,
    independentTime: 0,
    contactTime: 0,
    readingRate: 67,
    writingRate: 0.75,
    discussionTime: 0,
  };

  const actual = calculateWorkload(inputValues);
  const output = actual.workload;

  expect(output.total).toBeCloseTo(expectedOutput.total, 0.01);
  expect(output.independentTime).toBeCloseTo(expectedOutput.independentTime, 0.01);
  expect(output.contactTime).toBeCloseTo(expectedOutput.contactTime, 0.01);
  expect(output.readingRate).toBeCloseTo(expectedOutput.readingRate, 0.01);
  expect(output.writingRate).toBeCloseTo(expectedOutput.writingRate, 0.01);
  expect(output.discussionTime).toBeCloseTo(expectedOutput.discussionTime, 0.01);
});

test('calculates workload with no manual overrides or checkboxes checked', () => {
  const inputValues = {
    classWeeks: { value: '15' },
    readingPages: { value: '30' },
    pageDensity: { value: '450 Words' },
    difficulty: { value: 'Some New Concepts' },
    purpose: { value: 'Understand' },
    pagesPerHour: { value: '20' },
    semesterPages: { value: '10' },
    pageDensityWriting: { value: '250 Words' },
    genre: { value: 'Argument' },
    drafting: { value: 'Minimal Drafting' },
    hoursPerPage: { value: '1' },
    weeklyVideos: { value: '2' },
    discussionPosts: { value: '1' },
    discussionFormat: { value: 'Text' },
    avgLength: { value: '250' },
    avgLengthMinutes: { value: '3' },
    discussionHoursPerWeek: { value: '0.5' },
    exams: { value: '2' },
    studyHours: { value: '5' },
    takeHomeExams: { checked: false },
    examTimeLimit: { value: '60' },
    numberPerSemester: { value: '1' },
    hoursPerAssignment: { value: '2' },
    meetingsPerWeek: { value: '1' },
    meetingLength: { value: '1' },
    readingRateCheckbox: { checked: false },
    writingRateCheckbox: { checked: false },
    discussionRateCheckbox: { checked: false },
    independent: { checked: false }
  };
  const expectedOutput = {
    total: 7.38,
    independentTime: 5.25,
    contactTime: 2.13,
    readingRate: 24,
    writingRate: 2,
    discussionTime: 1,
  };
  const actual = calculateWorkload(inputValues);
  const output = actual.workload;

  expect(output.total).toBeCloseTo(expectedOutput.total, 0.01);
  expect(output.independentTime).toBeCloseTo(expectedOutput.independentTime, 0.01);
  expect(output.contactTime).toBeCloseTo(expectedOutput.contactTime, 0.01);
  expect(output.readingRate).toBeCloseTo(expectedOutput.readingRate, 0.01);
  expect(output.writingRate).toBeCloseTo(expectedOutput.writingRate, 0.01);
  expect(output.discussionTime).toBeCloseTo(expectedOutput.discussionTime, 0.01);
});

test('calculates workload with some checkboxes checked', () => {
  const inputValues = {
    classWeeks: { value: '10' },
    readingPages: { value: '20' },
    pageDensity: { value: '600 Words' },
    difficulty: { value: 'Many New Concepts' },
    purpose: { value: 'Engage' },
    pagesPerHour: { value: '15' },
    semesterPages: { value: '25' },
    pageDensityWriting: { value: '500 Words' },
    genre: { value: 'Research' },
    drafting: { value: 'Extensive Drafting' },
    hoursPerPage: { value: '2' },
    weeklyVideos: { value: '1' },
    discussionPosts: { value: '2' },
    discussionFormat: { value: 'Audio/Video' },
    avgLength: { value: '0' },
    avgLengthMinutes: { value: '10' },
    discussionHoursPerWeek: { value: '1' },
    exams: { value: '1' },
    studyHours: { value: '8' },
    takeHomeExams: { checked: true },
    examTimeLimit: { value: '120' },
    numberPerSemester: { value: '2' },
    hoursPerAssignment: { value: '3' },
    meetingsPerWeek: { value: '2' },
    meetingLength: { value: '1.5' },
    readingRateCheckbox: { checked: true },
    writingRateCheckbox: { checked: false },
    discussionRateCheckbox: { checked: true },
    independent: { checked: true }
  };

  const expectedOutput = {
    total: 32.93,
    independentTime: 28.93,
    contactTime: 4,
    readingRate: 15,
    writingRate: 10,
    discussionTime: 1,
  };

  const actual = calculateWorkload(inputValues);
  const output = actual.workload;

  expect(output.total).toBeCloseTo(expectedOutput.total, 0.01);
  expect(output.independentTime).toBeCloseTo(expectedOutput.independentTime, 0.01);
  expect(output.contactTime).toBeCloseTo(expectedOutput.contactTime, 0.01);
  expect(output.readingRate).toBeCloseTo(expectedOutput.readingRate, 0.01);
  expect(output.writingRate).toBeCloseTo(expectedOutput.writingRate, 0.01);
  expect(output.discussionTime).toBeCloseTo(expectedOutput.discussionTime, 0.01);
});

test('calculates workload with all checkboxes checked', () => {
  const inputValues = {
    classWeeks: { value: '8' },
    readingPages: { value: '40' },
    pageDensity: { value: '750 Words' },
    difficulty: { value: 'Many New Concepts' },
    purpose: { value: 'Engage' },
    pagesPerHour: { value: '10' },
    semesterPages: { value: '60' },
    pageDensityWriting: { value: '500 Words' },
    genre: { value: 'Research' },
    drafting: { value: 'Extensive Drafting' },
    hoursPerPage: { value: '4' },
    weeklyVideos: { value: '3' },
    discussionPosts: { value: '3' },
    discussionFormat: { value: 'Audio/Video' },
    avgLength: { value: '0' },
    avgLengthMinutes: { value: '15' },
    discussionHoursPerWeek: { value: '2' },
    exams: { value: '2' },
    studyHours: { value: '12' },
    takeHomeExams: { checked: true },
    examTimeLimit: { value: '180' },
    numberPerSemester: { value: '4' },
    hoursPerAssignment: { value: '6' },
    meetingsPerWeek: { value: '4' },
    meetingLength: { value: '2' },
    readingRateCheckbox: { checked: true },
    writingRateCheckbox: { checked: true },
    discussionRateCheckbox: { checked: true },
    independent: { checked: true }
  };

  const expectedOutput = {
    total: 53.75,
    independentTime: 43.75,
    contactTime: 10,
    readingRate: 10,
    writingRate: 4,
    discussionTime: 2,
  };

  const actual = calculateWorkload(inputValues);
  const output = actual.workload;

  expect(output.total).toBeCloseTo(expectedOutput.total, 0.01);
  expect(output.independentTime).toBeCloseTo(expectedOutput.independentTime, 0.01);
  expect(output.contactTime).toBeCloseTo(expectedOutput.contactTime, 0.01);
  expect(output.readingRate).toBeCloseTo(expectedOutput.readingRate, 0.01);
  expect(output.writingRate).toBeCloseTo(expectedOutput.writingRate, 0.01);
  expect(output.discussionTime).toBeCloseTo(expectedOutput.discussionTime, 0.01);
});
