// Function to initialize the workload estimator
const pagesPerHour = {
  "No New Concepts": {
    Survey: { "450 Words": 67, "600 Words": 47, "750 Words": 33 },
    Understand: { "450 Words": 50, "600 Words": 35, "750 Words": 25 },
    Engage: { "450 Words": 40, "600 Words": 28, "750 Words": 20 }
  },
  "Some New Concepts": {
    Survey: { "450 Words": 33, "600 Words": 24, "750 Words": 17 },
    Understand: { "450 Words": 25, "600 Words": 18, "750 Words": 13 },
    Engage: { "450 Words": 20, "600 Words": 14, "750 Words": 10 }
  },
  "Many New Concepts": {
    Survey: { "450 Words": 17, "600 Words": 12, "750 Words": 9 },
    Understand: { "450 Words": 13, "600 Words": 9, "750 Words": 7 },
    Engage: { "450 Words": 10, "600 Words": 7, "750 Words": 5 }
  }
};

const hoursPerWriting = {
  "250 Words": {
    "No Drafting": { "Reflection/Narrative": 0.75, Argument: 1, Research: 1.25 },
    "Minimal Drafting": { "Reflection/Narrative": 1.5, Argument: 2, Research: 2.5 },
    "Extensive Drafting": { "Reflection/Narrative": 2, Argument: 3, Research: 4 }
  },
  "500 Words": {
    "No Drafting": { "Reflection/Narrative": 1.5, Argument: 2, Research: 2.5 },
    "Minimal Drafting": { "Reflection/Narrative": 3, Argument: 4, Research: 5 },
    "Extensive Drafting": { "Reflection/Narrative": 4, Argument: 6, Research: 8 }
  }
};

class WorkloadEstimator extends HTMLElement {
  constructor () {
    super()
    // Initialize default values
    this.total = 0
    this.independent = 0
    this.contact = 0
    this.readingRate = 67; // Default reading rate in pages per hour
    this.writingRate = 0.75; // Default writing rate in hours per page
    this.hoursPerWeekDiscussion = 0; // Default discussion rate in hours per week

    // Attach a shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' })

    // Create the main container
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
    `

    /// Create main container: This will hold all the elements
    shadow.appendChild(style)
    const container = document.createElement('div')
    container.className = 'container'
    shadow.appendChild(container)

    /// Create heading: This is the heading for the main container
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

    // Panel: Course Info
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

    // Panel: Reading Assignments
    const readingAssignmentHeading = document.createElement('h4')
    readingAssignmentHeading.textContent = 'Reading Assignments'
    column1.appendChild(readingAssignmentHeading)

    const readingAssignmentsPanel = document.createElement('div')
    readingAssignmentsPanel.className = 'panel'
    readingAssignmentsPanel.innerHTML = `
  <label for="Pages per Week">Pages per Week:</label>
  <input type="number" id="weeklyPages" value="0" min="0" />

  <label>Page Density:</label>
  <select id="pageDensity">
    <option value="450 Words">450 Words</option>
    <option value="600 Words">600 Words</option>
    <option value="750 Words">750 Words</option>
  </select>

  <label>Difficulty:</label>
  <select id="difficulty">
    <option value="No New Concepts">No New Concepts</option>
    <option value="Some New Concepts">Some New Concepts</option>
    <option value="Many New Concepts">Many New Concepts</option>
  </select>

  <label>Purpose:</label>
  <select id="purpose">
    <option value="Survey">Survey</option>
    <option value="Understand">Understand</option>
    <option value="Engage">Engage</option>
  </select>
  <label for="Estimated Reading Rate">Estimated Reading Rate:</label>
  <p> ${this.readingRate} pages per hour</p>

  <div id="readingRatePanel">
  <label for="readingRate">Manually Adjust Reading Rate:</label>
  <input type="checkbox" id="readingRate" />
  <div id="readingRateContainer" style="display: none;">
    <label for="pagesPerHour">Pages Read Per Hour:</label>
    <input type="number" id="pagesPerHour" value="10" min="0" />
  </div>
</div>

  `
    column1.appendChild(readingAssignmentsPanel)

    // Panel: Writing Assignments
    const writingAssignmentHeading = document.createElement('h4')
    writingAssignmentHeading.textContent = 'Writing Assignments'
    column2.appendChild(writingAssignmentHeading)

    const writingAssignmentsPanel = document.createElement('div')
    writingAssignmentsPanel.className = 'panel'
    writingAssignmentsPanel.innerHTML = `
  <label for="Pages per Semester">Pages per Semester:</label>
  <input type="number" id="semesterPages" value="0" min="0" />

  <label>Page Density:</label>
  <select id="pageDensityWriting">
    <option value="250 Words">250 Words</option>
    <option value="500 Words">500 Words</option>
  </select>

  <label>Genre:</label>
  <select id="genre">
    <option value="Reflection/Narrative">Reflection/Narrative</option>
    <option value="Arguement">Arguement</option>
    <option value="Research">Research</option>
  </select>

  <label>Drafting:</label>
  <select id="drafting">
    <option value="No Drafting">No Drafting</option>
    <option value="Minimal Drafting">Minimal Drafting</option>
    <option value="Extensive Drafting">Extensive Drafting</option>
  </select>

  <label for="Estimated Writing Rate">Estimated Writing Rate:</label>
  <p> ${this.writingRate} pages per hour</p>
    <div id="writingRatePanel">
  <label for="writingRate">Manually Adjust Writing Rate:</label>
  <input type="checkbox" id="writingRate" />
  <div id="writingRateContainer" style="display: none;">
    <label for="hoursPerPage">Hours Per Written Page:</label>
    <input type="number" id="hoursPerPage" value="0.5" min="0" />
  </div>
</div>
  `
    column2.appendChild(writingAssignmentsPanel)

    // Panel: Videos/Podcasts
    const videosPanelHeading = document.createElement('h4')
    videosPanelHeading.textContent = 'Videos/Podcasts'
    column2.appendChild(videosPanelHeading)

    const videosPanel = document.createElement('div')
    videosPanel.className = 'panel'
    videosPanel.innerHTML = ` 
  <label for="Hours per Week">Hours per Week:</label>
  <input type="number" id="weeklyVideos" value="0" min="0" />
  `
    column2.appendChild(videosPanel)

    // Panel: Discussion Posts
    const discussionPostsHeading = document.createElement('h4')
    discussionPostsHeading.textContent = 'Discussion Posts'
    column3.appendChild(discussionPostsHeading)

    const discussionPostsPanel = document.createElement('div')
    discussionPostsPanel.className = 'panel'
    discussionPostsPanel.innerHTML = `
  <label for="Posts per Week">Posts per Week:</label>
  <input type="number" id="discussionPosts" value="0" min="0" />
  <label>Format:</label>
  <select id="discussionFormat">
    <option value="Text">Text</option>
    <option value="Audio/Video">Audio/Video</option>
  </select>
  <label for="Avg. Length Words">Avg. Length (Words):</label>
  <input type="number" id="avgLength" value="250" min="0" />

  <label for="Hours per Post">Estimated Hours:</label>
  <p> ${this.hoursPerWeekDiscussion} pages / week</p>
<div id="discussionRatePanel">
  <label for="discussionRate">Manually Adjust Discussion Rate:</label>
  <input type="checkbox" id="discussionRate" />
  <div id="discussionRateContainer" style="display: none;">
    <label for="hoursPerWeek">Hours Per Week:</label>
    <input type="number" id="hoursPerWeek" value="1" min="0" />
  </div>
</div>

  `
    column3.appendChild(discussionPostsPanel)

    // Panel: Exams
    const examsHeading = document.createElement('h4')
    examsHeading.textContent = 'Exams'
    column3.appendChild(examsHeading)

    const examsPanel = document.createElement('div')
    examsPanel.className = 'panel'
    examsPanel.innerHTML = `
  <div id="examsPanel">
  <label for="exams">Exams per Semester:</label>
  <input type="number" id="exams" value="0" min="0" />

  <label for="studyHours">Study Hours per Exam:</label>
  <input type="number" id="studyHours" value="5" min="0" />

  <label for="takeHomeExams">Take-Home Exams:</label>
  <input type="checkbox" id="takeHomeExams" />

  <div id="takeHomeExamsContainer" style="display: none;">
    <label for="examTimeLimit">Exam Time Limit (in Minutes):</label>
    <input type="number" id="examTimeLimit" value="60" min="0" />
  </div>
</div>
  `
    column3.appendChild(examsPanel)

    // Panel: Other Assignments
    const otherAssignmentsHeading = document.createElement('h4')
    otherAssignmentsHeading.textContent = 'Other Assignments'
    column4.appendChild(otherAssignmentsHeading)

    const otherAssignmentsPanel = document.createElement('div')
    otherAssignmentsPanel.className = 'panel'
    otherAssignmentsPanel.innerHTML = `
 <label for="numberPerSemester"># Per Semester: </label>
 <input type="number" id="numberPerSemester" value="0" min="0" />
 <label for="hours per assignment">Hours Per Assignment: </label>
  <input type="range" id="hoursPerAssignment" value="0" min="0" max="50" />
    <input type="checkbox" id="independent"> Independent</input>
   `
    column4.appendChild(otherAssignmentsPanel)

    // Panel: Class Meetings
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

    // Store references for later
    this._classWeeks = shadow.querySelector('#classWeeks')
    this._readingPages = shadow.querySelector('#weeklyPages')
    this._pageDensity = shadow.querySelector('#pageDensity')
    this._difficulty = shadow.querySelector('#difficulty')
    this._purpose = shadow.querySelector('#purpose')
    this._semesterPages = shadow.querySelector('#semesterPages')
    this._pageDensityWriting = shadow.querySelector('#pageDensityWriting')
    this._genre = shadow.querySelector('#genre')
    this._drafting = shadow.querySelector('#drafting')
    this._hoursPerPage = shadow.querySelector('#hoursPerPage')
    this._weeklyVideos = shadow.querySelector('#weeklyVideos')
    this._discussionPosts = shadow.querySelector('#discussionPosts')
    this._discussionFormat = shadow.querySelector('#discussionFormat')
    this._avgLength = shadow.querySelector('#avgLength')
    this._exams = shadow.querySelector('#exams')
    this._studyHours = shadow.querySelector('#studyHours')
    this._takeHomeExams = shadow.querySelector('#takeHomeExams')
    this._examTimeLimit = shadow.querySelector('#examTimeLimit')
    this._numberPerSemester = shadow.querySelector('#numberPerSemester')
    this._hoursPerAssignment = shadow.querySelector('#hoursPerAssignment')
    this._independent = shadow.querySelector('#independent')
    this._meetingsPerWeek = shadow.querySelector('#meetingsPerWeek')
    this._meetingLength = shadow.querySelector('#meetingLength')

    // Add event listeners to update calculations
    this._classWeeks.addEventListener('input', this.calculateWorkload.bind(this))
    this._readingPages.addEventListener('input', this.calculateWorkload.bind(this))
    this._pageDensity.addEventListener('input', this.calculateWorkload.bind(this))
    this._difficulty.addEventListener('input', this.calculateWorkload.bind(this))
    this._purpose.addEventListener('input', this.calculateWorkload.bind(this))
    this._semesterPages.addEventListener('input', this.calculateWorkload.bind(this))
    this._pageDensityWriting.addEventListener('input', this.calculateWorkload.bind(this))
    this._genre.addEventListener('input', this.calculateWorkload.bind(this))
    this._drafting.addEventListener('input', this.calculateWorkload.bind(this))
    this._hoursPerPage.addEventListener('input', this.calculateWorkload.bind(this))
    this._weeklyVideos.addEventListener('input', this.calculateWorkload.bind(this))
    this._discussionPosts.addEventListener('input', this.calculateWorkload.bind(this))
    this._discussionFormat.addEventListener('input', this.calculateWorkload.bind(this))
    this._avgLength.addEventListener('input', this.calculateWorkload.bind(this))
    this._exams.addEventListener('input', this.calculateWorkload.bind(this))
    this._studyHours.addEventListener('input', this.calculateWorkload.bind(this))
    this._takeHomeExams.addEventListener('input', this.calculateWorkload.bind(this))
    this._examTimeLimit.addEventListener('input', this.calculateWorkload.bind(this))
    this._numberPerSemester.addEventListener('input', this.calculateWorkload.bind(this))
    this._hoursPerAssignment.addEventListener('input', this.calculateWorkload.bind(this))
    this._independent.addEventListener('input', this.calculateWorkload.bind(this))
    this._meetingsPerWeek.addEventListener('input', this.calculateWorkload.bind(this))
    this._meetingLength.addEventListener('input', this.calculateWorkload.bind(this))
    this.shadowRoot.querySelector('#independent').addEventListener('change', this.calculateWorkload.bind(this));
  }

  connectedCallback () {
    // Run the initial calculation on component load
    this.calculateWorkload();

    // Add event listeners for checkboxes
    this.shadowRoot.querySelector('#readingRate').addEventListener('change', (e) => {
      const container = this.shadowRoot.querySelector('#readingRateContainer');
      container.style.display = e.target.checked ? 'block' : 'none';
      this.calculateWorkload();
    });

    this.shadowRoot.querySelector('#writingRate').addEventListener('change', (e) => {
      const container = this.shadowRoot.querySelector('#writingRateContainer');
      container.style.display = e.target.checked ? 'block' : 'none';
      this.calculateWorkload();
    });

    this.shadowRoot.querySelector('#discussionRate').addEventListener('change', (e) => {
      const container = this.shadowRoot.querySelector('#discussionRateContainer');
      container.style.display = e.target.checked ? 'block' : 'none';
      this.calculateWorkload();
    });

    this.shadowRoot.querySelector('#takeHomeExams').addEventListener('change', (e) => {
      const container = this.shadowRoot.querySelector('#takeHomeExamsContainer');
      container.style.display = e.target.checked ? 'block' : 'none';
      this.calculateWorkload();
    });
  }

  calculateWorkload() {
    const classWeeks = parseInt(this._classWeeks.value || '1', 10);
    // Reading workload calculation
    const pagesPerWeek = parseInt(this._readingPages.value || '0', 10);
    let readingRate;
    if (!this.shadowRoot.querySelector('#readingRate').checked) {
      readingRate = pagesPerHour[this._difficulty.value][this._purpose.value][this._pageDensity.value];
      this.readingRate = readingRate;
    } else {
      readingRate = parseInt(this.shadowRoot.querySelector('#pagesPerHour').value || '0', 10);
      this.readingRate = readingRate;
    }
    const readingTime = (pagesPerWeek / (readingRate || 1)); // Avoid division by zero

    // Writing workload calculation
    const paperCount = parseInt(this._semesterPages.value || '0', 10);
    let writingRate;
    if (!this.shadowRoot.querySelector('#writingRate').checked) {
      writingRate = hoursPerWriting[this._pageDensityWriting.value][this._drafting.value][this._genre.value];
      this.writingRate = writingRate;
    } else {
      writingRate = parseFloat(this.shadowRoot.querySelector('#hoursPerPage').value || '0');
      this.writingRate = writingRate;
    }
    const writingTime = (paperCount * (writingRate || 0)) / classWeeks; // Avoid NaN if writingRate is undefined

    // Videos workload calculation
    const videoTime = parseInt(this._weeklyVideos.value || '0', 10);
    

    // Discussion workload calculation
    const postsPerWeek = parseInt(this._discussionPosts.value || '0', 10);
    const postLength = parseInt(this._avgLength.value || '0', 10);
    let discussionRate;
    if (!this.shadowRoot.querySelector('#discussionRate').checked) {
      const discussionFormat = this._discussionFormat.value;
      discussionRate = discussionFormat === 'Text' ? postLength * 0.05 : postLength * 0.1;
      this.hoursPerWeekDiscussion = discussionRate;
    } else {
      discussionRate = parseFloat(this.shadowRoot.querySelector('#hoursPerWeek').value || '0');
      this.hoursPerWeekDiscussion = discussionRate;
    }
    const discussionTime = (postsPerWeek * (discussionRate || 0)) / classWeeks; // Avoid NaN if discussionRate is undefined

    // Exams workload calculation
    const exams = parseInt(this._exams.value || '0', 10);
    const studyHours = parseFloat(this._studyHours.value || '0', 10);
    let examTimeLimit = 0;
    if (this.shadowRoot.querySelector('#takeHomeExams').checked) {
      examTimeLimit = parseFloat(this._examTimeLimit.value || '0') / 60; // Convert minutes to hours
    }
    const examsTime = (exams * (studyHours + examTimeLimit)) / classWeeks;

    // Other assignments workload calculation
    const otherAssignments = parseInt(this._hoursPerAssignment.value || '0', 10);
    const numberPerSemester = parseInt(this._numberPerSemester.value || '0', 10);
    const otherTime = (otherAssignments * numberPerSemester) / classWeeks;

    // Independent and Contact workload calculation
    let independent = readingTime + writingTime + videoTime + examsTime;
    let contact = discussionTime;
    if (!this.shadowRoot.querySelector('#independent').checked) {
      independent += otherTime;
    } else {
      contact += otherTime;
    }

    // Total workload calculation
    const total = independent + contact;

    // Update the workload estimates in the UI
    this.updateWorkloadEstimates(total, independent, contact);
  }

  updateWorkloadEstimates (total, independent, contact) {
    this.shadowRoot.querySelector('#total').innerHTML = `Total: ${total.toFixed(1)} hours/week`
    this.shadowRoot.querySelector('#independent').innerHTML = `Independent: ${independent.toFixed(1)} hours/week`
    this.shadowRoot.querySelector('#contact').innerHTML = `Contact: ${contact.toFixed(1)} hours/week`
  }
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)
