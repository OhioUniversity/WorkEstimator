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
        this.initializeElements();
        this.initializeEventListeners();
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
  // Run the initial calculation on component load
  this.calculateWorkload();

  // Define elements and their associated containers
  const elementsToBind = [
    { checkbox: this.shadowRoot.querySelector('#readingRateCheckbox'), container: this.shadowRoot.querySelector('#readingRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#writingRateCheckbox'), container: this.shadowRoot.querySelector('#writingRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#discussionRateCheckbox'), container: this.shadowRoot.querySelector('#discussionRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#takeHomeExamsCheckbox'), container: this.shadowRoot.querySelector('#takeHomeExamsContainer') },
  ];

  // Attach event listeners for checkboxes
  elementsToBind.forEach(({ checkbox, container }) => {
    checkbox.addEventListener('change', (e) => {
      container.classList.toggle('hidden', !e.target.checked);
      this.calculateWorkload();
    });
  });

  // Add event listener for format selection for discussion posts
    // Add event listener for format selection for discussion posts
    const formatSelect = this.shadowRoot.querySelector('#discussionFormatSelect');
    const textInputContainer = this.shadowRoot.querySelector('#textInputContainer');
    const audioInputContainer = this.shadowRoot.querySelector('#audioInputContainer');


    /// Toggles the visibility of input fields for discussion posts based on the selected format.
    /// - Shows the average length (words) input for text format.
    /// - Shows the average length (minutes) input for audio/video format.
    formatSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Text') {
        textInputContainer.classList.remove('hidden');
        audioInputContainer.classList.add('hidden');
      } else {
        textInputContainer.classList.add('hidden');
        audioInputContainer.classList.remove('hidden');
      }
      this.calculateWorkload();
    });
  }

  /// This function will toggle the input fields for the discussion posts based on the format selected
  /// If the format is text, the avg length input will be shown
  /// If the format is audio/video, the avg length minutes input will be shown
  toggleDiscussionInput() {
    const format = this._discussionFormat.value;
    const textInputContainer = this.shadowRoot.querySelector('#textInputContainer');
    const audioInputContainer = this.shadowRoot.querySelector('#audioInputContainer');

    if (format === 'Text') {
      textInputContainer.classList.remove('hidden');
      audioInputContainer.classList.add('hidden');
    } else {
      textInputContainer.classList.add('hidden');
      audioInputContainer.classList.remove('hidden');
    }
  }

  /// Calculates the total weekly workload based on user inputs.
  /// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
  /// - Updates the workload estimates and rates dynamically in the UI.
  calculateWorkload() {
    const classWeeks = parseInt(this.elements.classWeeks.value || '1', 10);

    /// Reading workload calculation
    /// This will calculate the reading workload based on the inputs and match the reading rate to a value in the pagesPerHour object
    /// This will also calculate the reading time based on the pages per week and the reading rate
    const pagesPerWeek = parseInt(this.elements.readingPages.value || '0', 10);
    let readingRate;
    if (!this.shadowRoot.querySelector('#readingRateCheckbox').checked) {
      readingRate = pagesPerHour[this.elements.difficulty.value][this.elements.purpose.value][this.elements.pageDensity.value];
      this.readingRate = readingRate;
    } else {
      readingRate = parseInt(this.elements.pagesPerHour.value || '0', 10);
      this.readingRate = readingRate;
    }
    const readingTime = pagesPerWeek / (readingRate || 1); // Avoid division by zero

    /// Writing workload calculation
    /// This will calculate the writing workload based on the inputs and match the writing rate to a value in the hoursPerWriting object
    /// This will also calculate the writing time based on the pages per semester and the writing rate
    const paperCount = parseInt(this.elements.semesterPages.value || '0', 10);
    let writingRate;
    if (!this.shadowRoot.querySelector('#writingRateCheckbox').checked) {
      writingRate = hoursPerWriting[
        this.elements.pageDensityWriting.value][this.elements.drafting.value][this.elements.genre.value];
      this.writingRate = writingRate;
    } else {
      writingRate = parseFloat(this.elements.hoursPerPage.value || '0');
      this.writingRate = writingRate;
    }
    const writingTime = (paperCount * (writingRate || 0)) / classWeeks;

    /// Videos workload calculation
    /// This will calculate the video workload based on the inputs
    const videoTime = parseInt(this.elements.weeklyVideos.value || '0', 10);
    
    /// Discussion workload calculation
    /// Calculates the weekly discussion workload based on user inputs.
    /// - For text format: Uses the average length (words) to determine the discussion rate.
    /// - For audio/video format: Uses the average length (minutes) to determine the discussion rate.
    /// - If manual adjustment is enabled, uses the user-provided hours per week.
    /// The total discussion time is calculated as: posts per week * discussion rate.
    const postsPerWeek = parseInt(this.elements.discussionPosts.value || '0', 10);
    const discussionFormat = this.elements.discussionFormat.value;

    let discussionRate;
    if (!this.shadowRoot.querySelector('#discussionRateCheckbox').checked) {
      if (discussionFormat === 'Text') {
        const postLength = parseInt(this.elements.avgLength.value || '0', 10);
        discussionRate = (postLength * 0.004); 
      } else if (discussionFormat === 'Audio/Video') {
        const postLengthMinutes = parseInt(this.elements.avgLengthMinutes.value || '0', 10);
        discussionRate = postLengthMinutes / 3; 
      }
    } else {
      discussionRate = parseFloat(this.elements.discussionHoursPerWeek.value || '0');
    }
    const discussionTime = postsPerWeek * (discussionRate || 0);
    this.hoursPerWeekDiscussion = discussionTime; 

    /// Exams workload calculation
    /// Calculates the weekly exam workload based on the number of exams, study hours per exam, and optional take-home exam time.
    /// - Adds the exam time limit (if applicable) to the study hours.
    /// - Distributes the total exam workload evenly across the class weeks.
    const exams = parseInt(this.elements.exams.value || '0', 10);
    const studyHours = parseFloat(this.elements.studyHours.value || '0', 10);
    const examTimeLimit = 0;
    if (this.shadowRoot.querySelector('#takeHomeExamsCheckbox').checked) {
      examTimeLimit = parseFloat(this.elements.examTimeLimit.value || '0') / 60; /// Convert minutes to hours
    }
    const examsTime = (exams * (studyHours + examTimeLimit)) / classWeeks;

    /// Other assignments workload calculation
    /// This will calculate the other assignments workload per week based on the inputs of the number of assignments per semester and the hours per assignment
    /// The other time will be calculated based on the number of assignments per semester, hours per assignment, and class weeks
    const otherAssignments = parseInt(this.elements.hoursPerAssignment.value || '0', 10);
    const numberPerSemester = parseInt(this.elements.numberPerSemester.value || '0', 10);
    const otherTime = ((otherAssignments * numberPerSemester) / classWeeks);

    /// Class meetings workload calculation
    /// This will calculate the class meetings workload per week based on the inputs of the meetings per week and the meeting length
    /// The class meeting time will be calculated based on the meetings per week and the meeting length
    const meetingsPerWeek = parseInt(this.elements.meetingsPerWeek.value || '0', 10);
    const meetingLength = parseFloat(this.elements.meetingLength.value || '0', 10);
    const classMeetingTime = meetingsPerWeek * meetingLength;

    // Independent and Contact workload calculation

    let independent = readingTime + writingTime + videoTime + examsTime;
    let contact = discussionTime + classMeetingTime;
    if (this.elements.independent.checked) {
      independent += otherTime;
    } else {
      contact += otherTime;
    }

    // Total workload calculation
    const total = independent + contact;

    // Update the workload estimates in the UI
    this.updateWorkloadEstimates(total, independent, contact, readingRate, writingRate, discussionTime);
  }

  /// This function will update the workload estimates and rates in the UI
  updateWorkloadEstimates(total, independent, contact, readingRate, writingRate, hoursPerWeekDiscussion) {
    this.shadowRoot.querySelector('#total').textContent = `Total: ${total.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#independent').textContent = `Independent: ${independent.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#contact').textContent = `Contact: ${contact.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#readingRateDisplay').textContent = `${readingRate.toFixed(0)} pages per hour`;
    this.shadowRoot.querySelector('#writingRateDisplay').textContent = `${writingRate.toFixed(2)} hours per page`;
    this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').textContent = `${hoursPerWeekDiscussion.toFixed(2)} hours/week`;
  }

  updatePlaceholders() {
    this.elements.readingRateDisplay.textContent = `${this.readingRate} pages per hour`;
    this.elements.writingRateDisplay.textContent = `${this.writingRate} hours per page`;
    this.elements.hoursPerWeekDiscussionDisplay.textContent = `${this.hoursPerWeekDiscussion} hours/week`;
    this.elements.total.textContent = `Total: ${this.total} hours/week`;
    this.elements.independentDisplay.textContent = `Independent: ${this.independent} hours/week`;
    this.elements.contact.textContent = `Contact: ${this.contact} hours/week`;
  }

  initializeElements() {
    // Store references to all elements in a single object
    this.elements = {
      classWeeks: this.shadowRoot.querySelector('#classWeeks'),
      readingPages: this.shadowRoot.querySelector('#weeklyPagesInput'),
      pageDensity: this.shadowRoot.querySelector('#pageDensitySelect'),
      difficulty: this.shadowRoot.querySelector('#difficultySelect'),
      purpose: this.shadowRoot.querySelector('#purposeSelect'),
      pagesPerHour: this.shadowRoot.querySelector('#pagesPerHourInput'),
      semesterPages: this.shadowRoot.querySelector('#semesterPagesInput'),
      pageDensityWriting: this.shadowRoot.querySelector('#pageDensityWritingSelect'),
      genre: this.shadowRoot.querySelector('#genreSelect'),
      drafting: this.shadowRoot.querySelector('#draftingSelect'),
      hoursPerPage: this.shadowRoot.querySelector('#hoursPerPageInput'),
      weeklyVideos: this.shadowRoot.querySelector('#weeklyVideosInput'),
      discussionPosts: this.shadowRoot.querySelector('#discussionPostsInput'),
      discussionFormat: this.shadowRoot.querySelector('#discussionFormatSelect'),
      avgLength: this.shadowRoot.querySelector('#avgLengthInput'),
      avgLengthMinutes: this.shadowRoot.querySelector('#avgLengthMinutesInput'),
      discussionHoursPerWeek: this.shadowRoot.querySelector('#hoursPerWeekInput'),
      exams: this.shadowRoot.querySelector('#examsInput'),
      studyHours: this.shadowRoot.querySelector('#studyHoursInput'),
      takeHomeExams: this.shadowRoot.querySelector('#takeHomeExamsCheckbox'),
      examTimeLimit: this.shadowRoot.querySelector('#examTimeLimitInput'),
      numberPerSemester: this.shadowRoot.querySelector('#numberPerSemesterInput'),
      hoursPerAssignment: this.shadowRoot.querySelector('#hoursPerAssignmentInput'),
      independent: this.shadowRoot.querySelector('#independentCheckbox'),
      meetingsPerWeek: this.shadowRoot.querySelector('#meetingsPerWeek'),
      meetingLength: this.shadowRoot.querySelector('#meetingLength'),
      readingRateCheckbox: this.shadowRoot.querySelector('#readingRateCheckbox'),
      writingRateCheckbox: this.shadowRoot.querySelector('#writingRateCheckbox'),
      discussionRateCheckbox: this.shadowRoot.querySelector('#discussionRateCheckbox'),
      readingRateContainer: this.shadowRoot.querySelector('#readingRateContainer'),
      writingRateContainer: this.shadowRoot.querySelector('#writingRateContainer'),
      discussionRateContainer: this.shadowRoot.querySelector('#discussionRateContainer'),
      takeHomeExamsContainer: this.shadowRoot.querySelector('#takeHomeExamsContainer'),
      textInputContainer: this.shadowRoot.querySelector('#textInputContainer'),
      audioInputContainer: this.shadowRoot.querySelector('#audioInputContainer'),
      sliderValue: this.shadowRoot.querySelector('#sliderValue'),
      total: this.shadowRoot.querySelector('#total'),
      independentDisplay: this.shadowRoot.querySelector('#independent'),
      contact: this.shadowRoot.querySelector('#contact'),
      readingRateDisplay: this.shadowRoot.querySelector('#readingRateDisplay'),
      writingRateDisplay: this.shadowRoot.querySelector('#writingRateDisplay'),
      hoursPerWeekDiscussionDisplay: this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay'),
    };

    // Update placeholders with default values
    this.updatePlaceholders();
  }

  initializeEventListeners() {
    // Attach input event listeners for workload calculation
    const inputs = [
      this.elements.classWeeks,
      this.elements.readingPages,
      this.elements.pageDensity,
      this.elements.difficulty,
      this.elements.purpose,
      this.elements.pagesPerHour,
      this.elements.semesterPages,
      this.elements.pageDensityWriting,
      this.elements.genre,
      this.elements.drafting,
      this.elements.hoursPerPage,
      this.elements.weeklyVideos,
      this.elements.discussionPosts,
      this.elements.discussionFormat,
      this.elements.avgLength,
      this.elements.avgLengthMinutes,
      this.elements.discussionHoursPerWeek,
      this.elements.exams,
      this.elements.studyHours,
      this.elements.takeHomeExams,
      this.elements.examTimeLimit,
      this.elements.numberPerSemester,
      this.elements.hoursPerAssignment,
      this.elements.independent,
      this.elements.meetingsPerWeek,
      this.elements.meetingLength,
    ];

    inputs.forEach((input) =>
      input.addEventListener('input', this.calculateWorkload.bind(this))
    );

    // Attach change event listeners for checkboxes
    const checkboxes = [
      { checkbox: this.elements.readingRateCheckbox, container: this.elements.readingRateContainer },
      { checkbox: this.elements.writingRateCheckbox, container: this.elements.writingRateContainer },
      { checkbox: this.elements.discussionRateCheckbox, container: this.elements.discussionRateContainer },
      { checkbox: this.elements.takeHomeExams, container: this.elements.takeHomeExamsContainer },
    ];

    checkboxes.forEach(({ checkbox, container }) => {
      checkbox.addEventListener('change', (e) => {
        container.classList.toggle('hidden', !e.target.checked);
        this.calculateWorkload();
      });
    });

    // Attach event listener for discussion format selection
    this.elements.discussionFormat.addEventListener('change', (e) => {
      if (e.target.value === 'Text') {
        this.elements.textInputContainer.classList.remove('hidden');
        this.elements.audioInputContainer.classList.add('hidden');
      } else {
        this.elements.textInputContainer.classList.add('hidden');
        this.elements.audioInputContainer.classList.remove('hidden');
      }
      this.calculateWorkload();
    });

    // Attach event listener for slider
    this.elements.hoursPerAssignment.addEventListener('input', () => {
      this.elements.sliderValue.textContent = this.elements.hoursPerAssignment.value;
    });
  }
}
// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)
