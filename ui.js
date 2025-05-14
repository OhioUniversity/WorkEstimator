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
const pagesPerHour = {
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

        // Initialize elements and event listeners
        const inputValues = initializeElements(this.shadowRoot);
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

  const workload = calculateWorkload(inputValues);

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
  return {
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
}
  
  function initializeEventListeners(inputValues, shadowRoot) {
  // Attach event listeners to all input elements in inputValues
  Object.values(inputValues).forEach((input) => {
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.addEventListener('input', () => {
        const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
        const workload = calculateWorkload(updatedInputValues);
        updateWorkloadEstimates(
          workload.total,
          workload.independentTime,
          workload.contactTime,
          workload.readingRate,
          workload.writingRate,
          workload.discussionTime
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

  checkboxes.forEach(({ checkbox, container }) => {
    checkbox.addEventListener('change', (e) => {
      container.classList.toggle('hidden', !e.target.checked);
      const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
      const workload = calculateWorkload(updatedInputValues);
      updateWorkloadEstimates(
        workload.total,
        workload.independentTime,
        workload.contactTime,
        workload.readingRate,
        workload.writingRate,
        workload.discussionTime
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
    const workload = calculateWorkload(updatedInputValues);
    updateWorkloadEstimates(
      workload.total,
      workload.independentTime,
      workload.contactTime,
      workload.readingRate,
      workload.writingRate,
      workload.discussionTime
    );
  });

  // Attach event listener for slider
  shadowRoot.querySelector('#hoursPerAssignmentInput').addEventListener('input', (e) => {
    shadowRoot.querySelector('#sliderValue').textContent = e.target.value;
    const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
    const workload = calculateWorkload(updatedInputValues);
    updateWorkloadEstimates(
      workload.total,
      workload.independentTime,
      workload.contactTime,
      workload.readingRate,
      workload.writingRate,
      workload.discussionTime
    );
  });
}
/// This function will update the workload estimates and rates in the UI
  function updateWorkloadEstimates(total, independent, contact, readingRate, writingRate, hoursPerWeekDiscussion) {
    this.shadowRoot.querySelector('#total').textContent = `Total: ${total.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#independent').textContent = `Independent: ${independent.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#contact').textContent = `Contact: ${contact.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#readingRateDisplay').textContent = `${readingRate.toFixed(0)} pages per hour`;
    this.shadowRoot.querySelector('#writingRateDisplay').textContent = `${writingRate.toFixed(2)} hours per page`;
    this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').textContent = `${hoursPerWeekDiscussion.toFixed(2)} hours/week`;
  }

  /// Calculates the total weekly workload based on user inputs.
  /// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
  /// - Updates the workload estimates and rates dynamically in the UI.
  function calculateWorkload(inputValues) {
    console.log('Calculating workload with input values:', inputValues);
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
      independent,
      meetingsPerWeek,
      meetingLength,
    } = inputValues;

    // Reading workload calculation
    let readingRate;
    if (!this.elements.readingRateCheckbox.checked) {
      readingRate = pagesPerHour[difficulty][purpose][pageDensity];
      this.readingRate = readingRate;
    } else {
      readingRate = pagesPerHour;
      this.readingRate = readingRate;
    }
    const readingTime = readingPages / (readingRate || 1); // Avoid division by zero

    // Writing workload calculation
    let writingRate;
    if (!this.elements.writingRateCheckbox.checked) {
      writingRate = hoursPerWriting[pageDensityWriting][drafting][genre];
      this.writingRate = writingRate;
    } else {
      writingRate = hoursPerPage;
      this.writingRate = writingRate;
    }
    const writingTime = (semesterPages * (writingRate || 0)) / classWeeks;

    // Videos workload calculation
    const videoTime = weeklyVideos;

    // Discussion workload calculation
    let discussionRate;
    if (!this.elements.discussionRateCheckbox.checked) {
      if (discussionFormat === 'Text') {
        discussionRate = avgLength * 0.004;
      } else if (discussionFormat === 'Audio/Video') {
        discussionRate = avgLengthMinutes / 3;
      }
    } else {
      discussionRate = discussionHoursPerWeek;
    }
    const discussionTime = discussionPosts * (discussionRate || 0);
    this.hoursPerWeekDiscussion = discussionTime;

    // Exams workload calculation
    let examTime = 0;
    if (takeHomeExams) {
      examTime = examTimeLimit / 60; // Convert minutes to hours
    }
    const examsTime = (exams * (studyHours + examTime)) / classWeeks;

    // Other assignments workload calculation
    const otherTime = (hoursPerAssignment * numberPerSemester) / classWeeks;

    // Class meetings workload calculation
    const classMeetingTime = meetingsPerWeek * meetingLength;

    // Independent and Contact workload calculation
    let independentTime = readingTime + writingTime + videoTime + examsTime;
    let contactTime = discussionTime + classMeetingTime;
    if (independent) {
      independentTime += otherTime;
    } else {
      contactTime += otherTime;
    }

    // Total workload calculation
    const total = independentTime + contactTime;

    // Return the calculated values
    return { total, independentTime, contactTime, readingRate, writingRate, discussionTime };
  }

  // function getInputValues() {
  //   return {
  //     classWeeks: parseInt(this.elements.classWeeks.value || '1', 10),
  //     readingPages: parseInt(this.elements.readingPages.value || '0', 10),
  //     pageDensity: this.elements.pageDensity.value,
  //     difficulty: this.elements.difficulty.value,
  //     purpose: this.elements.purpose.value,
  //     pagesPerHour: parseInt(this.elements.pagesPerHour.value || '0', 10),
  //     semesterPages: parseInt(this.elements.semesterPages.value || '0', 10),
  //     pageDensityWriting: this.elements.pageDensityWriting.value,
  //     genre: this.elements.genre.value,
  //     drafting: this.elements.drafting.value,
  //     hoursPerPage: parseFloat(this.elements.hoursPerPage.value || '0'),
  //     weeklyVideos: parseInt(this.elements.weeklyVideos.value || '0', 10),
  //     discussionPosts: parseInt(this.elements.discussionPosts.value || '0', 10),
  //     discussionFormat: this.elements.discussionFormat.value,
  //     avgLength: parseInt(this.elements.avgLength.value || '0', 10),
  //     avgLengthMinutes: parseInt(this.elements.avgLengthMinutes.value || '0', 10),
  //     discussionHoursPerWeek: parseFloat(this.elements.discussionHoursPerWeek.value || '0'),
  //     exams: parseInt(this.elements.exams.value || '0', 10),
  //     studyHours: parseFloat(this.elements.studyHours.value || '0'),
  //     takeHomeExams: this.elements.takeHomeExams.checked,
  //     examTimeLimit: parseFloat(this.elements.examTimeLimit.value || '0'),
  //     numberPerSemester: parseInt(this.elements.numberPerSemester.value || '0', 10),
  //     hoursPerAssignment: parseInt(this.elements.hoursPerAssignment.value || '0', 10),
  //     independent: this.elements.independent.checked,
  //     meetingsPerWeek: parseInt(this.elements.meetingsPerWeek.value || '0', 10),
  //     meetingLength: parseFloat(this.elements.meetingLength.value || '0'),
  //   };
  // }

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)