/// Calculates the total weekly workload based on user inputs.
/// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
const pagesPerHourData = {
  'No New Concepts': {
    Survey: { '450 Words': 67, '600 Words': 50, '750 Words': 40 },
    Understand: { '450 Words': 33, '600 Words': 25, '750 Words': 20 },
    Engage: { '450 Words': 17, '600 Words': 13, '750 Words': 10 },
  },
  'Some New Concepts': {
    Survey: { '450 Words': 47, '600 Words': 35, '750 Words': 28 },
    Understand: { '450 Words': 24, '600 Words': 18, '750 Words': 14 },
    Engage: { '450 Words': 12, '600 Words': 9, '750 Words': 7 },
  },
  'Many New Concepts': {
    Survey: { '450 Words': 33, '600 Words': 25, '750 Words': 20 },
    Understand: { '450 Words': 17, '600 Words': 13, '750 Words': 10 },
    Engage: { '450 Words': 9, '600 Words': 7, '750 Words': 5 },
  },
};

const hoursPerWriting = {
  '250 Words': {
    'No Drafting': { 'Reflection/Narrative': 0.75, Argument: 1.5, Research: 3 },
    'Minimal Drafting': { 'Reflection/Narrative': 1, Argument: 2, Research: 4 },
    'Extensive Drafting': { 'Reflection/Narrative': 1.25, Argument: 2.5, Research: 5 },
  },
  '500 Words': {
    'No Drafting': { 'Reflection/Narrative': 1.5, Argument: 3, Research: 6 },
    'Minimal Drafting': { 'Reflection/Narrative': 2, Argument: 4, Research: 8 },
    'Extensive Drafting': { 'Reflection/Narrative': 2.5, Argument: 5, Research: 10 },
  },
};

export interface InputValues {
  classWeeks: number;
  readingPages: number;
  pageDensity: string;
  difficulty: string;
  purpose: string;
  pagesPerHour: number;
  semesterPages: number;
  pageDensityWriting: string;
  genre: string;
  drafting: string;
  hoursPerPage: number;
  weeklyVideos: number;
  discussionPosts: number;
  discussionFormat: string;
  avgLength: number;
  avgLengthMinutes: number;
  discussionHoursPerWeek: number;
  exams: number;
  studyHours: number;
  takeHomeExams: boolean;
  examTimeLimit: number;
  numberPerSemester: number;
  hoursPerAssignment: number;
  meetingsPerWeek: number;
  meetingLength: number;
  readingRateCheckbox: boolean;
  writingRateCheckbox: boolean;
  discussionRateCheckbox: boolean;
  independent: boolean;
}

export function calculateWorkload(inputValues: InputValues) {
  const classWeeksValue = Math.abs(inputValues.classWeeks);
  const readingPagesValue = Math.abs(inputValues.readingPages);
  const semesterPagesValue = Math.abs(inputValues.semesterPages);
  const weeklyVideosValue = Math.abs(inputValues.weeklyVideos);
  const discussionPostsPerWeek = Math.abs(inputValues.discussionPosts);
  const avgLengthValue = Math.abs(inputValues.avgLength);
  const avgLengthMinutesValue = Math.abs(inputValues.avgLengthMinutes);
  const discussionHoursPerWeekValue = Math.abs(inputValues.discussionHoursPerWeek);
  const examsValue = Math.abs(inputValues.exams);
  const studyHoursValue = Math.abs(inputValues.studyHours);
  const examTimeLimitValue = Math.abs(inputValues.examTimeLimit);
  const numberPerSemesterValue = Math.abs(inputValues.numberPerSemester);
  const hoursPerAssignmentValue = Math.abs(inputValues.hoursPerAssignment);
  const meetingsPerWeekValue = Math.abs(inputValues.meetingsPerWeek);
  const meetingLengthValue = Math.abs(inputValues.meetingLength);

  // Reading workload calculation
  let readingRate;
  if (!inputValues.readingRateCheckbox) {
    const difficultyValue = (inputValues.difficulty ||
      'No New Concepts') as keyof typeof pagesPerHourData;
    const purposeValue = (inputValues.purpose ||
      'Survey') as keyof (typeof pagesPerHourData)['No New Concepts'];
    const pageDensityValue = (inputValues.pageDensity ||
      '450 Words') as keyof (typeof pagesPerHourData)['No New Concepts']['Survey'];
    readingRate = pagesPerHourData[difficultyValue]?.[purposeValue]?.[pageDensityValue] || 0;
  } else {
    readingRate = inputValues.pagesPerHour || 0;
  }
  const readingTime = readingPagesValue / (readingRate || 1); // Avoid division by zero

  // Writing workload calculation
  let writingRate;
  type PageDensityWritingKey = keyof typeof hoursPerWriting;
  type DraftingKey = keyof (typeof hoursPerWriting)['250 Words'];
  type GenreKey = keyof (typeof hoursPerWriting)['250 Words']['No Drafting'];
  if (!inputValues.writingRateCheckbox) {
    const pageDensityWritingValue = (inputValues.pageDensityWriting ||
      '250 Words') as PageDensityWritingKey;
    const draftingValue = (inputValues.drafting || 'No Drafting') as DraftingKey;
    const genreValue = (inputValues.genre || 'Reflection/Narrative') as GenreKey;
    writingRate = hoursPerWriting[pageDensityWritingValue]?.[draftingValue]?.[genreValue] || 0; // Default to 0 if not found
  } else {
    writingRate = inputValues.hoursPerPage || 0; // Use hours per page if writing rate checkbox is checked
  }
  const writingTime = (semesterPagesValue * (writingRate || 0)) / classWeeksValue;

  // Videos workload calculation
  const videoTime = weeklyVideosValue;

  // Discussion workload calculation
  let discussionRate;
  let discussionTime;
  if (!inputValues.discussionRateCheckbox) {
    if (inputValues.discussionFormat === 'Text') {
      discussionRate = avgLengthValue * 0.004; // Words to hours
    } else if (inputValues.discussionFormat === 'Audio/Video') {
      discussionRate = avgLengthMinutesValue / 3; // Minutes to hours
    }
    discussionTime = discussionPostsPerWeek * (discussionRate || 0);
  } else {
    discussionTime = discussionHoursPerWeekValue;
  }

  // Exams workload calculation
  let examTime = 0;
  if (inputValues.takeHomeExams) {
    examTime = examTimeLimitValue / 60; // Convert minutes to hours
  }
  const examsTime = (examsValue * (studyHoursValue + examTime)) / classWeeksValue;

  // Other assignments workload calculation
  const otherTime = (hoursPerAssignmentValue * numberPerSemesterValue) / classWeeksValue;

  // Class meetings workload calculation
  const classMeetingTime = meetingsPerWeekValue * meetingLengthValue;

  // Independent and Contact workload calculation
  let independentTime = readingTime + writingTime + videoTime + examsTime;
  let contactTime = discussionTime + classMeetingTime;
  if (inputValues.independent) {
    independentTime += otherTime;
  } else {
    contactTime += otherTime;
  }

  // Total workload calculation
  const total = independentTime + contactTime;

  const workload = {
    total,
    independentTime,
    contactTime,
    readingRate,
    writingRate,
    discussionTime,
  };

  // Return the calculated values
  return { workload };
}
