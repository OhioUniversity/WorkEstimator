/// Calculates the total weekly workload based on user inputs.
/// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
/// - Updates the workload estimates and rates dynamically in the UI.
const pagesPerHourData = {
  "No New Concepts": {
    Survey: { "450 Words": 67, "600 Words": 50, "750 Words": 40 },
    Understand: { "450 Words": 33, "600 Words": 25, "750 Words": 20 },
    Engage: { "450 Words": 17, "600 Words": 13, "750 Words": 10 }
  },
  "Some New Concepts": {
    Survey: { "450 Words": 47, "600 Words": 35, "750 Words": 28 },
    Understand: { "450 Words": 24, "600 Words": 18, "750 Words": 14 },
    Engage: { "450 Words": 12, "600 Words": 9, "750 Words": 7 }
  },
  "Many New Concepts": {
    Survey: { "450 Words": 33, "600 Words": 25, "750 Words": 20 },
    Understand: { "450 Words": 17, "600 Words": 13, "750 Words": 10 },
    Engage: { "450 Words": 9, "600 Words": 7, "750 Words": 5 }
  }
};

const hoursPerWriting = {
  "250 Words": {
    "No Drafting": { "Reflection/Narrative": 0.75, Argument: 1.5, Research: 3 },
    "Minimal Drafting": { "Reflection/Narrative": 1, Argument: 2, Research: 4 },
    "Extensive Drafting": { "Reflection/Narrative": 1.25, Argument: 2.5, Research: 5 }
  },
  "500 Words": {
    "No Drafting": { "Reflection/Narrative": 1.5, Argument: 3, Research: 6 },
    "Minimal Drafting": { "Reflection/Narrative": 2, Argument: 4, Research: 8 },
    "Extensive Drafting": { "Reflection/Narrative": 2.5, Argument: 5, Research: 10 }
  }
};

  export function calculateWorkload(inputValues) {
  const {
    classWeeks,
    readingPages,
    pageDensity,
    difficulty,
    purpose,
    pagesPerHour,
    semesterPages,
    pageDensityWriting,
    genre,
    drafting,
    hoursPerPage,
    weeklyVideos,
    discussionPosts,
    discussionFormat,
    avgLength,
    avgLengthMinutes,
    discussionHoursPerWeek,
    exams,
    studyHours,
    takeHomeExams,
    examTimeLimit,
    numberPerSemester,
    hoursPerAssignment,
    meetingsPerWeek,
    meetingLength,
    readingRateCheckbox,
    writingRateCheckbox,
    discussionRateCheckbox,
    independent
  } = inputValues;

  // Parse values with defaults
  const classWeeksValue = parseInt(classWeeks?.value || '15');
  const readingPagesValue = parseInt(readingPages?.value || '0');
  const semesterPagesValue = parseFloat(semesterPages?.value || '0');
  const weeklyVideosValue = parseFloat(weeklyVideos?.value || '0');
  const discussionPostsPerWeek = parseFloat(discussionPosts?.value || '0');
  const avgLengthValue = parseFloat(avgLength?.value || '250');
  const avgLengthMinutesValue = parseFloat(avgLengthMinutes?.value || '0');
  const discussionHoursPerWeekValue = parseFloat(discussionHoursPerWeek?.value || '0');
  const examsValue = parseFloat(exams?.value || '0');
  const studyHoursValue = parseFloat(studyHours?.value || '0');
  const examTimeLimitValue = parseFloat(examTimeLimit?.value || '0');
  const numberPerSemesterValue = parseFloat(numberPerSemester?.value || '0');
  const hoursPerAssignmentValue = parseFloat(hoursPerAssignment?.value || '0');
  const meetingsPerWeekValue = parseFloat(meetingsPerWeek?.value || '0');
  const meetingLengthValue = parseFloat(meetingLength?.value || '0');

  // Reading workload calculation
  let readingRate;
  if (!readingRateCheckbox.checked) {
    const difficultyValue = difficulty?.value || 'No New Concepts';
    const purposeValue = purpose?.value || 'Survey';
    const pageDensityValue = pageDensity?.value || '450 Words';
    readingRate = pagesPerHourData[difficultyValue]?.[purposeValue]?.[pageDensityValue] || 0;
  } else {
    readingRate = parseFloat(pagesPerHour?.value || '0');
  }
  const readingTime = readingPagesValue / (readingRate || 1); // Avoid division by zero

  // Writing workload calculation
  let writingRate;
  if (!writingRateCheckbox.checked) {
    const pageDensityWritingValue = pageDensityWriting?.value || '250 Words';
    const draftingValue = drafting?.value || 'No Drafting';
    const genreValue = genre?.value || 'Reflection/Narrative';
    writingRate = hoursPerWriting[pageDensityWritingValue]?.[draftingValue]?.[genreValue] || 0; // Default to 0 if not found
  } else {
    writingRate = parseFloat(hoursPerPage?.value || '0');
  }
  const writingTime = (semesterPagesValue * (writingRate || 0)) / classWeeksValue;

  // Videos workload calculation
  const videoTime = weeklyVideosValue;

  // Discussion workload calculation
  let discussionRate;
  let discussionTime;
  if (!discussionRateCheckbox.checked) {
    if (discussionFormat?.value === 'Text') {
      discussionRate = avgLengthValue * 0.004; // Words to hours
    } else if (discussionFormat?.value === 'Audio/Video') {
      discussionRate = avgLengthMinutesValue / 3; // Minutes to hours
    }
    discussionTime = discussionPostsPerWeek * (discussionRate || 0);
  } else {
    discussionTime = discussionHoursPerWeekValue;
  }

  // Exams workload calculation
  let examTime = 0;
  if (takeHomeExams?.checked) {
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
  if (independent?.checked) {
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
    discussionTime
  };

  // Return the calculated values
  return { workload };
}