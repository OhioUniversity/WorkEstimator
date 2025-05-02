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
  constructor () {
    super()

    // Initialize default values
    this.total = 0
    this.independent = 0
    this.contact = 0
    this.readingRate = 67; 
    this.writingRate = 0.75; 
    this.hoursPerWeekDiscussion = 0; 

    // Attach a shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' })

    // Create a style element to hold the CSS
    /// This is the style for the custom element
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        font-family: Arial, sans-serif;
        margin: 0.5rem;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0.5rem;
      }

      h3, h4, p {
        text-align: center;
        margin: 0.5rem 0;
      }

      h4 {
        font-size: 1rem;
        font-weight: bold;
      }

      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(4, 1fr);
      }

      .panel {
        background: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      label {
        display: block;
        margin: 0.3rem 0 0.1rem;
        font-weight: bold;
      }

      input[type="number"],
      select {
        width: 100%;
        padding: 0.4rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
      }

      input[type="range"] {
        width: 100%;
        margin: 0.5rem 0;
      }

      input[type="checkbox"] {
        margin-right: 0.5rem;
      }

      .slider-value {
        display: inline-block;
        min-width: 40px;
        text-align: center;
        font-weight: bold;
      }

      .workload-estimate {
        text-align: center;
        margin-top: 1rem;
        font-weight: bold;
        font-size: 1.1rem;
      }
      .hidden {
        display: none;
      }
    `

    /// Create main container: This will hold all the elements
    const container = document.createElement('div')
    container.className = 'container'
    shadow.appendChild(style, container)

    /// Create heading: This is the heading for the main container
    /// This will hold the title and the authors as well as the link to the website
    const heading = document.createElement('h3')
    heading.textContent = 'Enhanced Course Workload Estimator'
    container.appendChild(heading)
    const subHeading = document.createElement('p')
    subHeading.textContent = 'Research & Design: '
    container.appendChild(subHeading)

    /// Create grid: This will hold the different columns of inputs
    const grid = document.createElement('div')
    grid.className = 'grid'
    container.appendChild(grid)

    // Create columns: This will create the four columns in the grid
    /// Column 1: Course Info and Reading Assignments
    /// Column 2: Writing Assignments and Videos/Podcasts
    /// Column 3: Discussion Posts and Exams
    /// Column 4: Other Assignments, Class Meetings, and Workload Estimates
    const column1 = document.createElement('div')
    column1.className = 'column'
    const column2 = document.createElement('div')
    column2.className = 'column'
    const column3 = document.createElement('div')
    column3.className = 'column'
    const column4 = document.createElement('div')
    column4.className = 'column'
    grid.appendChild(column1)
    grid.appendChild(column2)
    grid.appendChild(column3)
    grid.appendChild(column4)

    /// Panel: Course Info
    /// This panel will hold the inputs for the course info
    /// This will include the class duration in weeks
    const courseInfoHeading = document.createElement('h4')
    courseInfoHeading.textContent = 'Course Info'
    column1.appendChild(courseInfoHeading)

    const courseInfoPanel = document.createElement('div')
    courseInfoPanel.className = 'panel'
    courseInfoPanel.innerHTML = `
      <label for="Class Duration (Weeks)">Class Duration (Weeks):</label>
      <input type="number" id="classWeeks" value="15" min="0" />
    `
    column1.appendChild(courseInfoPanel)

    /// Panel: Reading Assignments
    /// This panel will hold the inputs for the reading assignments
    /// This will include the pages per week, page density, difficulty, and purpose
    /// This will also include the estimated reading rate and the option to manually adjust it
    const readingAssignmentHeading = document.createElement('h4')
    readingAssignmentHeading.textContent = 'Reading Assignments'
    column1.appendChild(readingAssignmentHeading)

    const readingAssignmentsPanel = document.createElement('div')
    readingAssignmentsPanel.className = 'panel'
    readingAssignmentsPanel.innerHTML = `
      <label for="weeklyPagesInput">Pages per Week:</label>
      <input type="number" id="weeklyPagesInput" value="0" min="0" />

      <label>Page Density:</label>
      <select id="pageDensitySelect">
        <option value="450 Words">450 Words</option>
        <option value="600 Words">600 Words</option>
        <option value="750 Words">750 Words</option>
      </select>

      <label>Difficulty:</label>
      <select id="difficultySelect">
        <option value="No New Concepts">No New Concepts</option>
        <option value="Some New Concepts">Some New Concepts</option>
        <option value="Many New Concepts">Many New Concepts</option>
      </select>

      <label>Purpose:</label>
      <select id="purposeSelect">
        <option value="Survey">Survey</option>
        <option value="Understand">Understand</option>
        <option value="Engage">Engage</option>
      </select>

      <label for="readingRateDisplay">Estimated Reading Rate:</label>
      <div id="readingRateDisplay">
        <p>${this.readingRate} pages per hour</p>
      </div>

      <div id="readingRatePanel">
        <label for="readingRateCheckbox">Manually Adjust Reading Rate:</label>
        <input type="checkbox" id="readingRateCheckbox" />
      <div id="readingRateContainer" class="hidden">
        <label for="pagesPerHourInput">Pages Read Per Hour:</label>
        <input type="number" id="pagesPerHourInput" value="10" min="0" />
      </div>
    </div>
  `;
    column1.appendChild(readingAssignmentsPanel)

    /// Panel: Writing Assignments
    /// This panel will hold the inputs for the writing assignments
    /// This will include the pages per semester, page density, genre, drafting, and estimated writing rate
    /// This will also include the option to manually adjust the writing rate
    const writingAssignmentHeading = document.createElement('h4')
    writingAssignmentHeading.textContent = 'Writing Assignments'
    column2.appendChild(writingAssignmentHeading)

    const writingAssignmentsPanel = document.createElement('div')
    writingAssignmentsPanel.className = 'panel'
    writingAssignmentsPanel.innerHTML = `
      <label for="semesterPagesInput">Pages per Semester:</label>
      <input type="number" id="semesterPagesInput" value="0" min="0" />

      <label>Page Density:</label>
      <select id="pageDensityWritingSelect">
        <option value="250 Words">250 Words</option>
        <option value="500 Words">500 Words</option>
      </select>

      <label>Genre:</label>
      <select id="genreSelect">
        <option value="Reflection/Narrative">Reflection/Narrative</option>
        <option value="Argument">Argument</option>
        <option value="Research">Research</option>
      </select>

      <label>Drafting:</label>
      <select id="draftingSelect">
        <option value="No Drafting">No Drafting</option>
        <option value="Minimal Drafting">Minimal Drafting</option>
        <option value="Extensive Drafting">Extensive Drafting</option>
      </select>

      <label for="writingRateDisplay">Estimated Writing Rate:</label>
      <div id="writingRateDisplay">
        <p>${this.writingRate} hours per page</p>
      </div>

      <div id="writingRatePanel">
        <label for="writingRateCheckbox">Manually Adjust Writing Rate:</label>
        <input type="checkbox" id="writingRateCheckbox" />
        <div id="writingRateContainer" class="hidden">
          <label for="hoursPerPageInput">Hours Per Written Page:</label>
          <input type="number" id="hoursPerPageInput" value="0.5" min="0" />
        </div>
      </div>
    `;
    column2.appendChild(writingAssignmentsPanel)

    // Panel: Videos/Podcasts
    /// This panel will hold the inputs for the videos/podcasts
    /// This will include the hours per week
    const videosPanelHeading = document.createElement('h4')
    videosPanelHeading.textContent = 'Videos/Podcasts'
    column2.appendChild(videosPanelHeading)

    const videosPanel = document.createElement('div')
    videosPanel.className = 'panel'
    videosPanel.innerHTML = ` 
      <label for="Hours per Week">Hours per Week:</label>
      <input type="number" id="weeklyVideosInput" value="0" min="0" />
  `
    column2.appendChild(videosPanel)

    // Panel: Discussion Posts
    /// This panel will hold the inputs for the discussion posts
    /// This will include the posts per week, format, avg length, and estimated discussion rate
    /// This will also include the option to manually adjust the time needed for discussion posts per week
    const discussionPostsHeading = document.createElement('h4')
    discussionPostsHeading.textContent = 'Discussion Posts'
    column3.appendChild(discussionPostsHeading)

    const discussionPostsPanel = document.createElement('div')
    discussionPostsPanel.className = 'panel'
    discussionPostsPanel.innerHTML = `
      <label for="discussionPostsInput">Posts per Week:</label>
      <input type="number" id="discussionPostsInput" value="0" min="0" />

      <label>Format:</label>
      <select id="discussionFormatSelect">
        <option value="Text">Text</option>
        <option value="Audio/Video">Audio/Video</option>
      </select>

      <div id="textInputContainer">
        <label for="avgLengthInput">Avg. Length (Words):</label>
        <input type="number" id="avgLengthInput" value="250" min="0" />
      </div>

      <div id="audioInputContainer" class="hidden">
        <label for="avgLengthMinutesInput">Avg. Length (Minutes):</label>
        <input type="number" id="avgLengthMinutesInput" value="3" min="0" />
      </div>

      <label for="hoursPerWeekDiscussionDisplay">Estimated Hours:</label>
      <div id="hoursPerWeekDiscussionDisplay">
        <p>${this.hoursPerWeekDiscussion} hours/week</p>
      </div>

      <div id="discussionRatePanel">
        <label for="discussionRateCheckbox">Manually Adjust Discussion Rate:</label>
        <input type="checkbox" id="discussionRateCheckbox" />
        <div id="discussionRateContainer" class="hidden">
          <label for="hoursPerWeekInput">Hours Per Week:</label>
          <input type="number" id="hoursPerWeekInput" value="1" min="0" />
        </div>
    </div>
  `;
    column3.appendChild(discussionPostsPanel)

    // Panel: Exams
    /// This panel will hold the inputs for the exams
    /// This will include the exams per semester and study hours per exam.
    /// This will also include the option to set the time limit for take-home exams if the checkbox is checked
    const examsHeading = document.createElement('h4')
    examsHeading.textContent = 'Exams'
    column3.appendChild(examsHeading)

    const examsPanel = document.createElement('div')
    examsPanel.className = 'panel'
    examsPanel.innerHTML = `
      <label for="examsInput">Exams per Semester:</label>
      <input type="number" id="examsInput" value="0" min="0" />

      <label for="studyHoursInput">Study Hours per Exam:</label>
      <input type="number" id="studyHoursInput" value="5" min="0" />

      <label for="takeHomeExamsCheckbox">Take-Home Exams:</label>
      <input type="checkbox" id="takeHomeExamsCheckbox" />

      <div id="takeHomeExamsContainer" class="hidden">
        <label for="examTimeLimitInput">Exam Time Limit (in Minutes):</label>
        <input type="number" id="examTimeLimitInput" value="60" min="0" />
      </div>
    `;
    column3.appendChild(examsPanel)

    // Panel: Other Assignments
    /// This panel will hold the inputs for the other assignments
    /// This will include the number of assignments per semester and the hours per assignment
    /// This will also include the option to mark the assignments as independent
    const otherAssignmentsHeading = document.createElement('h4')
    otherAssignmentsHeading.textContent = 'Other Assignments'
    column4.appendChild(otherAssignmentsHeading)

    const otherAssignmentsPanel = document.createElement('div')
    otherAssignmentsPanel.className = 'panel'
    otherAssignmentsPanel.innerHTML = `
      <label for="numberPerSemesterInput"># Per Semester:</label>
      <input type="number" id="numberPerSemesterInput" value="0" min="0" />

      <label for="hoursPerAssignmentInput">Hours Per Assignment:</label>
      <div style="display: flex; align-items: center; gap: 10px;">
      <input type="range" id="hoursPerAssignmentInput" value="0" min="0" max="50" step="1" />
      <span id="sliderValue">0</span>
      </div>

      <input type="checkbox" id="independentCheckbox"> Independent </input>
    `;
    column4.appendChild(otherAssignmentsPanel)

    // Panel: Class Meetings
    /// This panel will hold the inputs for the class meetings
    /// This will include the meetings per week and the meeting length
    const classMeetingsHeading = document.createElement('h4')
    classMeetingsHeading.textContent = 'Class Meetings'
    column4.appendChild(classMeetingsHeading)

    const classMeetingsPanel = document.createElement('div')
    classMeetingsPanel.className = 'panel'
    classMeetingsPanel.innerHTML = `
      <label for="meetingsPerWeek">Live Meetings Per Week: </label>
      <input type="number" id="meetingsPerWeek" value="0" min="0" />
      <label for="meeting length">Meeting Length (Hours): </label>
      <input type="number" id="meetingLength" value="0" min="0" />
   `
    column4.appendChild(classMeetingsPanel)

    /// Panel : Workload Estimates
    /// This panel will hold the estimates for the workload
    /// This will include the total hours per week, independent hours per week, and contact hours per week
    const workloadEstimatesHeading = document.createElement('h4')
    workloadEstimatesHeading.textContent = 'Workload Estimates'
    column4.appendChild(workloadEstimatesHeading)

    const workloadEstimates = document.createElement('div')
    workloadEstimates.className = 'panel'
    workloadEstimates.innerHTML = `
      <div id="total">Total: ${this.total} hours/week</div>
      <div id="independent">Independent: ${this.independent} hours/week</div>
      <div id="contact">Contact: ${this.contact} hours/week</div>
    `
    column4.appendChild(workloadEstimates)

    // Append everything to shadow root
    shadow.appendChild(style)
    shadow.appendChild(container)

    // These are the elements that we will use to calculate the workload
    this._classWeeks = shadow.querySelector('#classWeeks');
    this._readingPages = shadow.querySelector('#weeklyPagesInput');
    this._pageDensity = shadow.querySelector('#pageDensitySelect');
    this._difficulty = shadow.querySelector('#difficultySelect');
    this._purpose = shadow.querySelector('#purposeSelect');
    this._pagesPerHour = shadow.querySelector('#pagesPerHourInput');
    this._semesterPages = shadow.querySelector('#semesterPagesInput');
    this._pageDensityWriting = shadow.querySelector('#pageDensityWritingSelect');
    this._genre = shadow.querySelector('#genreSelect');
    this._drafting = shadow.querySelector('#draftingSelect');
    this._hoursPerPage = shadow.querySelector('#hoursPerPageInput');
    this._weeklyVideos = shadow.querySelector('#weeklyVideosInput');
    this._discussionPosts = shadow.querySelector('#discussionPostsInput');
    this._discussionFormat = shadow.querySelector('#discussionFormatSelect');
    this._avgLength = shadow.querySelector('#avgLengthInput');
    this._avgLengthMinutes = shadow.querySelector('#avgLengthMinutesInput');
    this._discussionHoursPerWeek = shadow.querySelector('#hoursPerWeekInput');
    this._exams = shadow.querySelector('#examsInput');
    this._studyHours = shadow.querySelector('#studyHoursInput');
    this._takeHomeExams = shadow.querySelector('#takeHomeExamsCheckbox');
    this._examTimeLimit = shadow.querySelector('#examTimeLimitInput');
    this._numberPerSemester = shadow.querySelector('#numberPerSemesterInput');
    this._hoursPerAssignment = shadow.querySelector('#hoursPerAssignmentInput');
    this._independent = shadow.querySelector('#independentCheckbox');
    this._meetingsPerWeek = shadow.querySelector('#meetingsPerWeek');
    this._meetingLength = shadow.querySelector('#meetingLength');

    // Add event listeners to update calculations on input changes
    const inputs = [
      this._classWeeks,
      this._readingPages,
      this._pageDensity,
      this._difficulty,
      this._purpose,
      this._semesterPages,
      this._pageDensityWriting,
      this._genre,
      this._drafting,
      this._hoursPerPage,
      this._weeklyVideos,
      this._discussionPosts,
      this._discussionFormat,
      this._avgLength,
      this._avgLengthMinutes,
      this._exams,
      this._studyHours,
      this._takeHomeExams,
      this._examTimeLimit,
      this._numberPerSemester,
      this._hoursPerAssignment,
      this._independent,
      this._meetingsPerWeek,
      this._meetingLength,
    ];

    inputs.forEach(input => input.addEventListener('input', this.calculateWorkload.bind(this)));

    /// Add event listeners for checkboxes
    this.shadowRoot.querySelector('#independentCheckbox').addEventListener('change', this.calculateWorkload.bind(this));
    this.shadowRoot.querySelector('#takeHomeExamsCheckbox').addEventListener('change', this.calculateWorkload.bind(this));
    this.shadowRoot.querySelector('#readingRateCheckbox').addEventListener('change', this.calculateWorkload.bind(this));
    this.shadowRoot.querySelector('#writingRateCheckbox').addEventListener('change', this.calculateWorkload.bind(this));
    this.shadowRoot.querySelector('#discussionRateCheckbox').addEventListener('change', this.calculateWorkload.bind(this));
    this.shadowRoot.querySelector('#discussionFormatSelect').addEventListener('change', this.toggleDiscussionInput.bind(this));

    // Add event listener for the slider to update the value display
    const slider = this.shadowRoot.querySelector('#hoursPerAssignmentInput');
    const sliderValue = this.shadowRoot.querySelector('#sliderValue');

    // Update the slider value dynamically
    slider.addEventListener('input', () => {
      sliderValue.textContent = slider.value;
    });
  }

  connectedCallback() {
    // Run the initial calculation on component load
    this.calculateWorkload();

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

    // Define elements and events for checkboxes
    const elementsToBind = [
      { element: this.shadowRoot.querySelector('#readingRateCheckbox'), container: this.shadowRoot.querySelector('#readingRateContainer') },
      { element: this.shadowRoot.querySelector('#writingRateCheckbox'), container: this.shadowRoot.querySelector('#writingRateContainer') },
      { element: this.shadowRoot.querySelector('#discussionRateCheckbox'), container: this.shadowRoot.querySelector('#discussionRateContainer') },
      { element: this.shadowRoot.querySelector('#takeHomeExamsCheckbox'), container: this.shadowRoot.querySelector('#takeHomeExamsContainer') },
    ];

    // Attach event listeners for checkboxes, once the checkbox is checked, the container will be shown
    elementsToBind.forEach(({ element, container }) => {
      element.addEventListener('change', (e) => {
        container.classList.toggle('hidden', !e.target.checked);
        this.calculateWorkload();
      });
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
    const classWeeks = parseInt(this._classWeeks.value || '1', 10);

    /// Reading workload calculation
    /// This will calculate the reading workload based on the inputs and match the reading rate to a value in the pagesPerHour object
    /// This will also calculate the reading time based on the pages per week and the reading rate
    const pagesPerWeek = parseInt(this._readingPages.value || '0', 10);
    let readingRate;
    if (!this.shadowRoot.querySelector('#readingRateCheckbox').checked) {
      readingRate = pagesPerHour[this._difficulty.value][this._purpose.value][this._pageDensity.value];
      this.readingRate = readingRate;
    } else {
      readingRate = parseInt(this._pagesPerHour.value || '0', 10);
      this.readingRate = readingRate;
    }
    const readingTime = pagesPerWeek / (readingRate || 1); // Avoid division by zero

    /// Writing workload calculation
    /// This will calculate the writing workload based on the inputs and match the writing rate to a value in the hoursPerWriting object
    /// This will also calculate the writing time based on the pages per semester and the writing rate
    const paperCount = parseInt(this._semesterPages.value || '0', 10);
    let writingRate;
    if (!this.shadowRoot.querySelector('#writingRateCheckbox').checked) {
      writingRate = hoursPerWriting[
        this._pageDensityWriting.value][this._drafting.value][this._genre.value];
      this.writingRate = writingRate;
    } else {
      writingRate = parseFloat(this._hoursPerPage.value || '0');
      this.writingRate = writingRate;
    }
    const writingTime = (paperCount * (writingRate || 0)) / classWeeks;

    /// Videos workload calculation
    /// This will calculate the video workload based on the inputs
    const videoTime = parseInt(this._weeklyVideos.value || '0', 10);
    
    /// Discussion workload calculation
    /// Calculates the weekly discussion workload based on user inputs.
    /// - For text format: Uses the average length (words) to determine the discussion rate.
    /// - For audio/video format: Uses the average length (minutes) to determine the discussion rate.
    /// - If manual adjustment is enabled, uses the user-provided hours per week.
    /// The total discussion time is calculated as: posts per week * discussion rate.
    const postsPerWeek = parseInt(this._discussionPosts.value || '0', 10);
    const discussionFormat = this._discussionFormat.value;

    let discussionRate;
    if (!this.shadowRoot.querySelector('#discussionRateCheckbox').checked) {
      if (discussionFormat === 'Text') {
        const postLength = parseInt(this._avgLength.value || '0', 10);
        discussionRate = (postLength * 0.004); 
      } else if (discussionFormat === 'Audio/Video') {
        const postLengthMinutes = parseInt(this._avgLengthMinutes.value || '0', 10);
        discussionRate = postLengthMinutes / 3; 
      }
    } else {
      discussionRate = parseFloat(this._discussionHoursPerWeek.value || '0');
    }
    const discussionTime = postsPerWeek * (discussionRate || 0);
    this.hoursPerWeekDiscussion = discussionTime; 

    /// Exams workload calculation
    /// Calculates the weekly exam workload based on the number of exams, study hours per exam, and optional take-home exam time.
    /// - Adds the exam time limit (if applicable) to the study hours.
    /// - Distributes the total exam workload evenly across the class weeks.
    const exams = parseInt(this._exams.value || '0', 10);
    const studyHours = parseFloat(this._studyHours.value || '0', 10);
    let examTimeLimit = 0;
    if (this.shadowRoot.querySelector('#takeHomeExamsCheckbox').checked) {
      examTimeLimit = parseFloat(this._examTimeLimit.value || '0') / 60; /// Convert minutes to hours
    }
    const examsTime = (exams * (studyHours + examTimeLimit)) / classWeeks;

    /// Other assignments workload calculation
    /// This will calculate the other assignments workload per week based on the inputs of the number of assignments per semester and the hours per assignment
    /// The other time will be calculated based on the number of assignments per semester, hours per assignment, and class weeks
    const otherAssignments = parseInt(this._hoursPerAssignment.value || '0', 10);
    const numberPerSemester = parseInt(this._numberPerSemester.value || '0', 10);
    const otherTime = ((otherAssignments * numberPerSemester) / classWeeks);

    /// Class meetings workload calculation
    /// This will calculate the class meetings workload per week based on the inputs of the meetings per week and the meeting length
    /// The class meeting time will be calculated based on the meetings per week and the meeting length
    const meetingsPerWeek = parseInt(this._meetingsPerWeek.value || '0', 10);
    const meetingLength = parseFloat(this._meetingLength.value || '0', 10);
    const classMeetingTime = meetingsPerWeek * meetingLength;

    // Independent and Contact workload calculation

    let independent = readingTime + writingTime + videoTime + examsTime;
    let contact = discussionTime + classMeetingTime;
    if (this._independent.checked) {
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
    this.shadowRoot.querySelector('#total').innerHTML = `Total: ${total.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#independent').innerHTML = `Independent: ${independent.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#contact').innerHTML = `Contact: ${contact.toFixed(2)} hours/week`;
    this.shadowRoot.querySelector('#readingRateDisplay').innerHTML = `${readingRate.toFixed(0)} pages per hour`;
    this.shadowRoot.querySelector('#writingRateDisplay').innerHTML = `${writingRate.toFixed(2)} hours per page`;
    this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').innerHTML = `${hoursPerWeekDiscussion.toFixed(2)} hours / week`;
  }
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)
