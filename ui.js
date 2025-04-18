// Function to initialize the workload estimator
class WorkloadEstimator extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM for encapsulation
    const shadow = this.attachShadow({ mode: 'open' });

    // Create the main container
    const style = document.createElement("style");
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
    `;

    /// Create main container: This will hold all the elements
    shadow.appendChild(style);
    const container = document.createElement("div");
    container.className = "container";
    shadow.appendChild(container);

    /// Create heading: This is the heading for the main container
    const heading = document.createElement("h3");
    heading.textContent = "Enhanced Course Workload Estimator";
    container.appendChild(heading);
    const subHeading = document.createElement("p");
    subHeading.textContent = "Research & Design: ";
    container.appendChild(subHeading);

    /// Create grid: This will hold the different columns of inputs
    const grid = document.createElement("div");
    grid.className = "grid";
    container.appendChild(grid);

    // Create columns: This will create the four columns in the grid
    const column1 = document.createElement("div");
    column1.className = "column";
    const column2 = document.createElement("div");
    column2.className = "column";
    const column3 = document.createElement("div");
    column3.className = "column";
    const column4 = document.createElement("div");
    column4.className = "column";
    grid.appendChild(column1);
    grid.appendChild(column2);
    grid.appendChild(column3);
    grid.appendChild(column4);

    // Panel: Course Info
    const courseInfoHeading = document.createElement("h4");
    courseInfoHeading.textContent = "Course Info";
    column1.appendChild(courseInfoHeading);

    const courseInfoPanel = document.createElement("div");
    courseInfoPanel.className = "panel";
    courseInfoPanel.innerHTML = `
  <label for="Class Duration (Weeks)">Class Duration (Weeks):</label>
  <input type="number" id="classWeeks" value="15" min="0" />
  `;
    column1.appendChild(courseInfoPanel);

    // Panel: Reading Assignments
    const readingAssignmentHeading = document.createElement("h4");
    readingAssignmentHeading.textContent = "Reading Assignments";
    column1.appendChild(readingAssignmentHeading);

    const readingAssignmentsPanel = document.createElement("div");
    readingAssignmentsPanel.className = "panel";
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
  <p>{ {readingRate}} pages per hour</p>

  <input type="checkbox" id="readingRate"> Manually Adjust </input>
  <label for="pagesPerHour">Pages Read Per Hour:</label>
  <input type="number" id="pagesPerHour" value="10" min="0" />

  `;
    column1.appendChild(readingAssignmentsPanel);

    // Panel: Writing Assignments
    const writingAssignmentHeading = document.createElement("h4");
    writingAssignmentHeading.textContent = "Writing Assignments";
    column2.appendChild(writingAssignmentHeading);

    const writingAssignmentsPanel = document.createElement("div");
    writingAssignmentsPanel.className = "panel";
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
  <p>{ {writingRate}} pages per hour</p>
    <input type="checkbox" id="writingRate"> Manually Adjust </input>
  <label for="Hours Per Written Page">Hours Per Written Page: </label>
  <input type="number" id="hoursPerPage" value="0.5" min="0" />
  `;
    column2.appendChild(writingAssignmentsPanel);

    // Panel: Videos/Podcasts
    const videosPanelHeading = document.createElement("h4");
    videosPanelHeading.textContent = "Videos/Podcasts";
    column2.appendChild(videosPanelHeading);

    const videosPanel = document.createElement("div");
    videosPanel.className = "panel";
    videosPanel.innerHTML = ` 
  <label for="Hours per Week">Hours per Week:</label>
  <input type="number" id="weeklyVideos" value="0" min="0" />
  `;
    column2.appendChild(videosPanel);

    // Panel: Discussion Posts
    const discussionPostsHeading = document.createElement("h4");
    discussionPostsHeading.textContent = "Discussion Posts";
    column3.appendChild(discussionPostsHeading);

    const discussionPostsPanel = document.createElement("div");
    discussionPostsPanel.className = "panel";
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
  <p>{ {hoursPerWeekDiscussion}} pages / week</p>
  <input type="checkbox" id="discussionRate"> Manually Adjust </input>
  <label for="Hours Per Week">Hours Per Week:</label>
  <input type="number" id="hoursPerWeek" value="1" min="0" />

  `;
    column3.appendChild(discussionPostsPanel);

    // Panel: Exams
    const examsHeading = document.createElement("h4");
    examsHeading.textContent = "Exams";
    column3.appendChild(examsHeading);

    const examsPanel = document.createElement("div");
    examsPanel.className = "panel";
    examsPanel.innerHTML = `
  <label for="Exams per Semester">Exams per Semester:</label>
  <input type="number" id="exams" value="0" min="0" />
  <label for="Study Hours per Exam">Study Hours per Exam:</label>
  <input type="number" id="studyHours" value="5" min="0" />
    <input type="checkbox" id="takeHomeExams"> Take-Home Exams </input>
  <label for="Exam Time Limit (in Minutes)">Exam Time Limit (in Minutes):</label>
  <input type="number" id="examTimeLimit" value="60" min="0" />
  `;
    column3.appendChild(examsPanel);

    // Panel: Other Assignments
    const otherAssignmentsHeading = document.createElement("h4");
    otherAssignmentsHeading.textContent = "Other Assignments";
    column4.appendChild(otherAssignmentsHeading);

    const otherAssignmentsPanel = document.createElement("div");
    otherAssignmentsPanel.className = "panel";
    otherAssignmentsPanel.innerHTML = `
 <label for="numberPerSemester"># Per Semester: </label>
 <input type="number" id="numberPerSemester" value="0" min="0" />
 <label for="hours per assignment">Hours Per Assignment: </label>
  <input type="range" id="hoursPerAssignment" value="0" min="0" max="50" />
    <input type="checkbox" id="independent"> Independent</input>
   `;
    column4.appendChild(otherAssignmentsPanel);

    // Panel: Class Meetings
    const classMeetingsHeading = document.createElement("h4");
    classMeetingsHeading.textContent = "Class Meetings";
    column4.appendChild(classMeetingsHeading);

    const classMeetingsPanel = document.createElement("div");
    classMeetingsPanel.className = "panel";
    classMeetingsPanel.innerHTML = `
      <label for="meetingsPerWeek">Live Meetings Per Week: </label>
      <input type="number" id="meetingsPerWeek" value="0" min="0" />
      <label for="meeting length">Meeting Length (Hours): </label>
      <input type="number" id="meetingLength" value="0" min="0" />
   `;
    column4.appendChild(classMeetingsPanel);

    /// Panel : Workload Estimates
    const workloadEstimatesHeading = document.createElement("h4");
    workloadEstimatesHeading.textContent = "Workload Estimates";
    column4.appendChild(workloadEstimatesHeading);

    const workloadEstimates = document.createElement("div");
    workloadEstimates.className = "panel";
    workloadEstimates.innerHTML = `
    <div id="totalWorkLoad">Total: {{totalWorkLoad}} hours/week</div>
    <div id="independentWorkload">Independent: {{independentWorkLoad}} hours/week</div>
    <div id="contactWorkload">Contact: {{contactWorkload}} hours/week</div>
  `;
    column4.appendChild(workloadEstimates);

    // Append everything to shadow root
    shadow.appendChild(style);
    shadow.appendChild(container);

    // Store references for later
    this._classWeeks = shadow.querySelector('#classWeeks');
    this._readingPages = shadow.querySelector('#weeklyPages');
    this._pageDensity = shadow.querySelector('#pageDensity');
    this._difficulty = shadow.querySelector('#difficulty');
    this._purpose = shadow.querySelector('#purpose');
    this._semesterPages = shadow.querySelector('#semesterPages');
    this._pageDensityWriting = shadow.querySelector('#pageDensityWriting');
    this._genre = shadow.querySelector('#genre');
    this._drafting = shadow.querySelector('#drafting');
    this._hoursPerPage = shadow.querySelector('#hoursPerPage');
    this._weeklyVideos = shadow.querySelector('#weeklyVideos');
    this._discussionPosts = shadow.querySelector('#discussionPosts');
    this._discussionFormat = shadow.querySelector('#discussionFormat');
    this._avgLength = shadow.querySelector('#avgLength');
    this._exams = shadow.querySelector('#exams');
    this._studyHours = shadow.querySelector('#studyHours');
    this._numberPerSemester = shadow.querySelector('#numberPerSemester');
    this._hoursPerAssignment = shadow.querySelector('#hoursPerAssignment');
    this._independent = shadow.querySelector('#independent');
    this._meetingsPerWeek = shadow.querySelector('#meetingsPerWeek');
    this._meetingLength = shadow.querySelector('#meetingLength');

    // Add event listeners to update calculations
    this._classWeeks.addEventListener('input', this.calculateWorkload.bind(this));
    this._readingPages.addEventListener('input', this.calculateWorkload.bind(this));
    this._pageDensity.addEventListener('input', this.calculateWorkload.bind(this));
    this._difficulty.addEventListener('input', this.calculateWorkload.bind(this));
    this._purpose.addEventListener('input', this.calculateWorkload.bind(this));
    this._semesterPages.addEventListener('input', this.calculateWorkload.bind(this));
    this._pageDensityWriting.addEventListener('input', this.calculateWorkload.bind(this));
    this._genre.addEventListener('input', this.calculateWorkload.bind(this));
    this._drafting.addEventListener('input', this.calculateWorkload.bind(this));
    this._hoursPerPage.addEventListener('input', this.calculateWorkload.bind(this));
    this._weeklyVideos.addEventListener('input', this.calculateWorkload.bind(this));
    this._discussionPosts.addEventListener('input', this.calculateWorkload.bind(this));
    this._discussionFormat.addEventListener('input', this.calculateWorkload.bind(this));
    this._avgLength.addEventListener('input', this.calculateWorkload.bind(this));
    this._exams.addEventListener('input', this.calculateWorkload.bind(this));
    this._studyHours.addEventListener('input', this.calculateWorkload.bind(this));
    this._numberPerSemester.addEventListener('input', this.calculateWorkload.bind(this));
    this._hoursPerAssignment.addEventListener('input', this.calculateWorkload.bind(this));
    this._independent.addEventListener('input', this.calculateWorkload.bind(this));
    this._meetingsPerWeek.addEventListener('input', this.calculateWorkload.bind(this));
    this._meetingLength.addEventListener('input', this.calculateWorkload.bind(this));
  }

  connectedCallback() {
    // Run the initial calculation on component load
    this.calculateWorkload();
  }

  calculateWorkload() {
    // Reading workload calculation
    const pagesPerWeek = parseInt(this._readingPages.value || '0', 10);
    const manualReadingRate = this.shadowRoot.querySelector('#readingRate').checked;
    const readingRate = manualReadingRate
      ? parseInt(this.shadowRoot.querySelector('#pagesPerHour').value || '0', 10)
      : 1 / (this.getDensityMultiplier() * this.getDifficultyMultiplier());
    const readingTime = pagesPerWeek / readingRate;

    // Writing workload calculation
    const paperCount = parseInt(this._semesterPages.value || '0', 10);
    const manualWritingRate = this.shadowRoot.querySelector('#writingRate').checked;
    const writingRate = manualWritingRate
      ? parseFloat(this.shadowRoot.querySelector('#hoursPerPage').value || '0.5')
      : this.getDraftingMultiplier();
    const writingTime = paperCount * writingRate;

    // Discussion workload calculation
    const postsPerWeek = parseInt(this._discussionPosts.value || '0', 10);
    const postLength = parseInt(this._avgLength.value || '0', 10);
    const manualDiscussionRate = this.shadowRoot.querySelector('#discussionRate').checked;
    const discussionTime = manualDiscussionRate
      ? parseFloat(this.shadowRoot.querySelector('#hoursPerWeek').value || '1')
      : postsPerWeek * postLength * 0.05;

    // Other assignments workload calculation
    const otherAssignments = parseInt(this._hoursPerAssignment.value || '0', 10);

    // Total workload calculation
    const total = readingTime + writingTime + discussionTime + otherAssignments;

    // Independent workload calculation
    const independent = readingTime + writingTime + otherAssignments;

    // Contact workload calculation
    const contact = discussionTime;

    // Update the workload estimates in the UI
    this.updateWorkloadEstimates(total, independent, contact);

    // Update specific panels
    this.shadowRoot.querySelector('#readingRatePanel').innerHTML = `Reading Time: ${readingTime.toFixed(1)} hours/week`;
    this.shadowRoot.querySelector('#writingRatePanel').innerHTML = `Writing Time: ${writingTime.toFixed(1)} hours/week`;
    this.shadowRoot.querySelector('#discussionRatePanel').innerHTML = `Discussion Time: ${discussionTime.toFixed(1)} hours/week`;
    this.shadowRoot.querySelector('#otherAssignmentsPanel').innerHTML = `Other Assignments: ${otherAssignments.toFixed(1)} hours/week`;
  }

  updateWorkloadEstimates(total, independent, contact) {
    this.shadowRoot.querySelector('#totalWorkLoad').innerHTML = `Total: ${total.toFixed(1)} hours/week`;
    this.shadowRoot.querySelector('#independentWorkload').innerHTML = `Independent: ${independent.toFixed(1)} hours/week`;
    this.shadowRoot.querySelector('#contactWorkload').innerHTML = `Contact: ${contact.toFixed(1)} hours/week`;
  }

  // Helper to adjust reading time based on density
  getDensityMultiplier() {
    switch (this._pageDensity.value) {
      case '450 Words':
        return 1.0;
      case '600 Words':
        return 0.75;
      case '750 Words':
        return 0.6;
      default:
        return 1.0;
    }
  }

  // Helper to adjust reading time based on difficulty
  getDifficultyMultiplier() {
    switch (this._difficulty.value) {
      case 'No New Concepts':
        return 1.0;
      case 'Some New Concepts':
        return 1.25;
      case 'Many New Concepts':
        return 1.5;
      default:
        return 1.0;
    }
  }

  // Helper to adjust writing time based on drafting
  getDraftingMultiplier() {
    switch (this._drafting.value) {
      case 'No Drafting':
        return 0.5;
      case 'Minimal Drafting':
        return 1.0;
      case 'Extensive Drafting':
        return 1.5;
      default:
        return 1.0;
    }
  }
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator);