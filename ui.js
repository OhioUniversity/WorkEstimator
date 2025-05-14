/// @fileoverview Custom Web Component for estimating course workload.
/// Calculates the total weekly hours required for various academic activities, including:
/// - Reading
/// - Writing
/// - Watching videos
/// - Participating in discussions
/// - Studying for exams
/// - Attending class meetings
/// Provides real-time feedback and allows manual adjustments for customizable rates.
/// @author Kylie Roenigk


/// These are the different rates for reading and writing based on the type of assignment and the difficulty level
/// this data is based on the following sources:
/// https://cat.wfu.edu/resources/workload/estimationdetails/
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


class WorkloadEstimator extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' });

    // Load external CSS
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'ui.css');
    shadow.appendChild(link);

    // Fetch and load the HTML content
    fetch('ui.html')
      .then((response) => response.text())
      .then((html) => {
        const container = document.createElement('div');
        container.innerHTML = html;
        shadow.appendChild(container);

        // Initialize elements and event listeners after the HTML is loaded
        const inputValues = initializeElements(this.shadowRoot);
        console.log('Input Values:', inputValues); // Debug log to verify elements
        initializeEventListeners(inputValues, this.shadowRoot);
      })
      .catch((error) => console.error('Error loading UI content:', error));
      // Initialize default values
      this.total = 0;
      this.independent = 0;
      this.contact = 0;
      this.readingRate = 67;
      this.writingRate = 0.75;
      this.hoursPerWeekDiscussion = 0.0;
  }

connectedCallback() {

  // Perform the initial workload calculation
  const inputValues = initializeElements(this.shadowRoot);
  console.log('Input values:', inputValues);

  // Bind event listeners
  initializeEventListeners(inputValues, this.shadowRoot);
  console.log('Event listeners initialized');

  const workload = calculateWorkload(inputValues, this.shadowRoot);

  // Update the UI with the initial workload estimates
  updateWorkloadEstimates(
    workload.total,
    workload.independentTime,
    workload.contactTime,
    workload.readingRate,
    workload.writingRate,
    workload.discussionTime
  );
}
}

function initializeElements(shadowRoot) {
  const elements = {
    classWeeks: shadowRoot.querySelector('#classWeeks'),
    readingPages: shadowRoot.querySelector('#weeklyPagesInput'),
    pageDensity: shadowRoot.querySelector('#pageDensitySelect'),
    difficulty: shadowRoot.querySelector('#difficultySelect'),
    purpose: shadowRoot.querySelector('#purposeSelect'),
    pagesPerHour: shadowRoot.querySelector('#pagesPerHourInput'),
    semesterPages: shadowRoot.querySelector('#semesterPagesInput'),
    pageDensityWriting: shadowRoot.querySelector('#pageDensityWritingSelect'),
    genre: shadowRoot.querySelector('#genreSelect'),
    drafting: shadowRoot.querySelector('#draftingSelect'),
    hoursPerPage: shadowRoot.querySelector('#hoursPerPageInput'),
    weeklyVideos: shadowRoot.querySelector('#weeklyVideosInput'),
    discussionPosts: shadowRoot.querySelector('#discussionPostsInput'),
    discussionFormat: shadowRoot.querySelector('#discussionFormatSelect'),
    avgLength: shadowRoot.querySelector('#avgLengthInput'),
    avgLengthMinutes: shadowRoot.querySelector('#avgLengthMinutesInput'),
    discussionHoursPerWeek: shadowRoot.querySelector('#hoursPerWeekInput'),
    exams: shadowRoot.querySelector('#examsInput'),
    studyHours: shadowRoot.querySelector('#studyHoursInput'),
    takeHomeExams: shadowRoot.querySelector('#takeHomeExamsCheckbox'),
    examTimeLimit: shadowRoot.querySelector('#examTimeLimitInput'),
    numberPerSemester: shadowRoot.querySelector('#numberPerSemesterInput'),
    hoursPerAssignment: shadowRoot.querySelector('#hoursPerAssignmentInput'),
    independent: shadowRoot.querySelector('#independentCheckbox'),
    meetingsPerWeek: shadowRoot.querySelector('#meetingsPerWeek'),
    meetingLength: shadowRoot.querySelector('#meetingLength'),
    readingRateCheckbox: shadowRoot.querySelector('#readingRateCheckbox'),
    writingRateCheckbox: shadowRoot.querySelector('#writingRateCheckbox'),
    discussionRateCheckbox: shadowRoot.querySelector('#discussionRateCheckbox'),
    readingRateContainer: shadowRoot.querySelector('#readingRateContainer'),
    writingRateContainer: shadowRoot.querySelector('#writingRateContainer'),
    discussionRateContainer: shadowRoot.querySelector('#discussionRateContainer'),
    takeHomeExamsContainer: shadowRoot.querySelector('#takeHomeExamsContainer'),
    textInputContainer: shadowRoot.querySelector('#textInputContainer'),
    audioInputContainer: shadowRoot.querySelector('#audioInputContainer'),
    sliderValue: shadowRoot.querySelector('#sliderValue'),
    total: shadowRoot.querySelector('#total'),
    independentDisplay: shadowRoot.querySelector('#independent'),
    contact: shadowRoot.querySelector('#contact'),
    readingRateDisplay: shadowRoot.querySelector('#readingRateDisplay'),
    writingRateDisplay: shadowRoot.querySelector('#writingRateDisplay'),
    hoursPerWeekDiscussionDisplay: shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay'),
  };
  console.log('Initialized Elements:', elements);
  return elements;
}
  
  function initializeEventListeners(inputValues, shadowRoot) {
  // Attach event listeners to all input elements in inputValues
  Object.values(inputValues).forEach((input) => {
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      const eventType = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
        const workload = calculateWorkload(updatedInputValues, shadowRoot);
        updateWorkloadEstimates(
          workload.total,
          workload.independentTime,
          workload.contactTime,
          workload.readingRate,
          workload.writingRate,
          workload.discussionTime,
          shadowRoot
        );
      });
    }
  });

  // Attach change event listeners for checkboxes
  const checkboxes = [
    { checkbox: shadowRoot.querySelector('#readingRateCheckbox'), container: shadowRoot.querySelector('#readingRateContainer') },
    { checkbox: shadowRoot.querySelector('#writingRateCheckbox'), container: shadowRoot.querySelector('#writingRateContainer') },
    { checkbox: shadowRoot.querySelector('#discussionRateCheckbox'), container: shadowRoot.querySelector('#discussionRateContainer') },
    { checkbox: shadowRoot.querySelector('#takeHomeExamsCheckbox'), container: shadowRoot.querySelector('#takeHomeExamsContainer') },
  ];
  console.log('Checkboxes:', checkboxes);

  checkboxes.forEach(({ checkbox, container }) => {
    checkbox.addEventListener('change', (e) => {
      container.classList.toggle('hidden', !e.target.checked);
      const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
      const workload = calculateWorkload(updatedInputValues, shadowRoot);
      updateWorkloadEstimates(
        workload.total,
        workload.independentTime,
        workload.contactTime,
        workload.readingRate,
        workload.writingRate,
        workload.discussionTime,
        shadowRoot
      );
    });
  });

  // Attach event listener for discussion format selection
  shadowRoot.querySelector('#discussionFormatSelect').addEventListener('change', (e) => {
    const textInputContainer = shadowRoot.querySelector('#textInputContainer');
    const audioInputContainer = shadowRoot.querySelector('#audioInputContainer');
    if (e.target.value === 'Text') {
      textInputContainer.classList.remove('hidden');
      audioInputContainer.classList.add('hidden');
    } else {
      textInputContainer.classList.add('hidden');
      audioInputContainer.classList.remove('hidden');
    }
    const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
    const workload = calculateWorkload(updatedInputValues, shadowRoot);
    updateWorkloadEstimates(
      workload.total,
      workload.independentTime,
      workload.contactTime,
      workload.readingRate,
      workload.writingRate,
      workload.discussionTime,
      shadowRoot
    );
  });

  // Attach event listener for slider
  shadowRoot.querySelector('#hoursPerAssignmentInput').addEventListener('input', (e) => {
    shadowRoot.querySelector('#sliderValue').textContent = e.target.value;
    const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
    const workload = calculateWorkload(updatedInputValues, shadowRoot);
    updateWorkloadEstimates(
      workload.total,
      workload.independentTime,
      workload.contactTime,
      workload.readingRate,
      workload.writingRate,
      workload.discussionTime,
      shadowRoot
    );
  });
}
/// This function will update the workload estimates and rates in the UI
  function updateWorkloadEstimates(total, independent, contact, readingRate, writingRate, hoursPerWeekDiscussion, shadowRoot) {
    shadowRoot.querySelector('#total').textContent = `Total: ${total.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#independent').textContent = `Independent: ${independent.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#contact').textContent = `Contact: ${contact.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#readingRateDisplay').textContent = `${readingRate.toFixed(0)} pages per hour`;
    shadowRoot.querySelector('#writingRateDisplay').textContent = `${writingRate.toFixed(2)} hours per page`;
    shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').textContent = `${hoursPerWeekDiscussion.toFixed(2)} hours/week`;
  }

  /// Calculates the total weekly workload based on user inputs.
  /// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
  /// - Updates the workload estimates and rates dynamically in the UI.
  function calculateWorkload(inputValues, shadowRoot) {
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
  const classWeeksValue = parseInt(classWeeks?.value || '1', 10);
  const readingPagesValue = parseInt(readingPages?.value || '0', 10);
  const semesterPagesValue = parseFloat(semesterPages?.value || '0', 10);
  const weeklyVideosValue = parseFloat(weeklyVideos?.value || '0', 10);
  const discussionPostsPerWeek = parseFloat(discussionPosts?.value || '0', 10);
  const avgLengthValue = parseFloat(avgLength?.value || '0', 10);
  const avgLengthMinutesValue = parseFloat(avgLengthMinutes?.value || '0', 10);
  const discussionHoursPerWeekValue = parseFloat(discussionHoursPerWeek?.value || '0', 10);
  const examsValue = parseFloat(exams?.value || '0', 10);
  const studyHoursValue = parseFloat(studyHours?.value || '0', 10);
  const examTimeLimitValue = parseFloat(examTimeLimit?.value || '0', 10);
  const numberPerSemesterValue = parseFloat(numberPerSemester?.value || '0', 10);
  const hoursPerAssignmentValue = parseFloat(hoursPerAssignment?.value || '0', 10);
  const meetingsPerWeekValue = parseFloat(meetingsPerWeek?.value || '0', 10);
  const meetingLengthValue = parseFloat(meetingLength?.value || '0', 10);

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

  // Return the calculated values
  return { total, independentTime, contactTime, readingRate, writingRate, discussionTime };
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)