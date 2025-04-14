// Function to initialize the workload estimator
function initializeWorkloadEstimator() {
  const root = document.getElementById("root");

  // Create the main container
  const style = document.createElement("style");
  style.textContent = `
    :host {
        display: block;
        font-family: Arial, sans-serif;
        margin: 1rem;
      }

    .container {
        max-width: 1200px;
        margin: 0 auto;
      }

        h2 {
        text-align: center;
        margin-bottom: 1rem;
      }
        .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }
        .panel {
        background: #f9f9f9;
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 5px;
      }
        label {
        display: block;
        margin: 0.5rem 0 0.2rem;
        font-weight: bold;
      }

      input[type="number"],
      input[type="text"],
      select {
        width: 100%;
        padding: 0.4rem;
        margin-bottom: 0.8rem;
        box-sizing: border-box;
      }

      .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .slider-value {
        min-width: 40px;
        text-align: center;
        font-weight: bold;
      }

      .workload-estimate {
        text-align: center;
        margin-top: 1rem;
      }

  `;

  /// Create main container: This will hold all the elements
  root.appendChild(style);
  const container = document.createElement("div");
  container.className = "container";


  /// Create heading: This is the heading for the main container
  const heading = document.createElement("h2");
  heading.textContent = "Enhanced Course Workload Estimator";
  container.appendChild(heading);

  /// Create grid: This will hold the different columns of inputs
  const grid = document.createElement("div");
  grid.className = "grid";
  container.appendChild(grid);

// Panel: Course Info
const courseInfoPanel = document.createElement("div");
courseInfoPanel.className = "panel";
courseInfoPanel.innerHTML = `
  <h3>Course Info</h3>
  <label for="Class Duration (Weeks)">Class Duration (Weeks):</label>
  <input type="number" id="classWeeks" value="15" min="0" />
  `;
  grid.appendChild(courseInfoPanel);

  // Panel: Reading Assignments
  const readingAssignmentsPanel = document.createElement("div");
  readingAssignmentsPanel.className = "panel";
  readingAssignmentsPanel.innerHTML = `
  <h3>Reading Assignments</h3>
  <label for="Pages per Week">Pages per Week:</label>
  <input type="number" id="weeklyPages" value="0" min="0" />

  <select for="Page Density">Page Density:</select>
  <select id="pageDensity">
    <option value="450 Words">450 Words</option>
    <option value="600 Words">600 Words</option>
    <option value="750 Words">750 Words</option>
  </select>

  <select for="Difficulty">Difficulty:</select>
  <select id="difficulty">
    <option value="No New Concepts">No New Concepts</option>
    <option value="Some New Concepts">Some New Concepts</option>
    <option value="Many New Concepts">Many New Concepts</option>
  </select>

  <select for="Purpose">Purpose:</select>
  <select id="purpose">
    <option value="Survey">Survey</option>
    <option value="Understand">Understand</option>
    <option value="Engage">Engage</option>
  </select>
  <label for="Estimated Reading Rate">Estimated Reading Rate:</label>
  <input type="number" id="readingRate" value="0" min="0" />

  <checkbox id="manuallyAdjust" unchecked />
  <label for="manuallyAdjust">Manually Adjust Reading Rate</label>
  `;
  grid.appendChild(readingAssignmentsPanel);

  // Panel: Writing Assignments
  const writingAssignmentsPanel = document.createElement("div");
  writingAssignmentsPanel.className = "panel";
  writingAssignmentsPanel.innerHTML = `
  <h3>Writing Assignments</h3>
  <label for="Pages per Semester">Pages per Semester:</label>
  <input type="number" id="semesterPages" value="0" min="0" />

  <select for="Page Density">Page Density:</select>
  <select id="pageDensity">
    <option value="250 Words">250 Words</option>
    <option value="500 Words">500 Words</option>
  </select>

  <select for="Genre">Genre:</select>
  <select id="genre">
    <option value="Reflection/Narrative">Reflection/Narrative</option>
    <option value="Arguement">Arguement</option>
    <option value="Research">Research</option>
  </select>

  <select for="Drafting">Drafting:</select>
  <select id="drafting">
    <option value="No Drafting">No Drafting</option>
    <option value="Minimal Drafting">Minimal Drafting</option>
    <option value="Extensive Drafting">Extensive Drafting</option>
  </select>
  <label for="Estimated Writing Rate">Estimated Writing Rate:</label>
  <input type="number" id="writingRate" value="0" min="0" />
  <checkbox id="manuallyAdjustWriting" checked />
  <label for="Hours Per Written Page">Hours Per Written Page</label>
  `;
  grid.appendChild(writingAssignmentsPanel);

  // Panel: Videos/Podcasts
  const videosPanel = document.createElement("div");
  videosPanel.className = "panel";
  videosPanel.innerHTML = `
  <h3>Videos/Podcasts</h3>  
  <label for="Hours per Week">Hours per Week:</label>
  <input type="number" id="weeklyVideos" value="0" min="0" />
  `;
  grid.appendChild(videosPanel);

  // Panel: Discussion Posts
  const discussionPostsPanel = document.createElement("div");
  discussionPostsPanel.className = "panel";
  discussionPostsPanel.innerHTML = `
  <h3>Discussion Posts</h3>
  <label for="Posts per Week">Posts per Week:</label>
  <input type="number" id="discussionPosts" value="0" min="0" />
  <select for="Format">Format:</select>
  <select id="discussionFormat">
    <option value="Text">Text</option>
    <option value="Audio/Video">Audio/Video</option>
  </select>
  <label for="Avg. Length Words">Avg. Length (Words):</label>
  <input type="number" id="avgLength" value="250" min="0" />

  <label for="Hours per Post">Estimated Hours:</label>
  <input type="number" id="hoursPerPost" value="0" min="0" />
  <checkbox id="manuallyAdjustDiscussion" checked />
  <label for="Hours Per Week">Hours Per Week:</label>
  <input type="number" id="hoursPerWeek" value="0" min="0" />
  `;
  grid.appendChild(discussionPostsPanel);

  // Panel: Exams
  const examsPanel = document.createElement("div");
  examsPanel.className = "panel";
  examsPanel.innerHTML = `
  <h3>Exams</h3>
  <label for="Exams per Semester">Exams per Semester:</label>
  <input type="number" id="exams" value="0" min="0" />
  <label for="Study Hours per Exam">Study Hours per Exam:</label>
  <input type="number" id="studyHours" value="5" min="0" />
  <checkbox id="Take-Home Exams" checked />
  <label for="Exam Time Limit (in Minutes)">Exam Time Limit (in Minutes):</label>
  <input type="number" id="examTimeLimit" value="60" min="0" />
  `;
  grid.appendChild(examsPanel);
  // Panel: Other Assignments
  const otherAssignmentsPanel = document.createElement("div");
  otherAssignmentsPanel.className = "panel";
  otherAssignmentsPanel.innerHTML = `
  `;
  grid.appendChild(otherAssignmentsPanel);

  // Panel: Class Meetings
  const classMeetingsPanel = document.createElement("div");
  classMeetingsPanel.className = "panel";
  classMeetingsPanel.innerHTML = `
  <h3>Class Meetings</h3>
  `;
  grid.appendChild(classMeetingsPanel);

  /// Panel : Workload Estimates
  const workloadEstimates = document.createElement("div");
  workloadEstimates.className = "workload-estimate";
  workloadEstimates.innerHTML = `
  <h3>Estimated Workload</h3>
  <div id="workloadOutput">Estimated Workload: 0 hours/week</div>
  `;
  container.appendChild(workloadEstimates);

  // Function to calculate workload
  function calculateWorkload() {
    const classWeeks = parseFloat(classWeeksInput.value);
    const weeklyPages = parseFloat(weeklyPagesInput.value);
    const discussionPosts = parseFloat(discussionPostsInput.value);
    const exams = parseFloat(examsInput.value);
    const otherAssignments = parseFloat(otherAssignmentsInput.value);
    const classMeetings = parseFloat(classMeetingsInput.value);

    if (
      isNaN(classWeeks) ||
      isNaN(weeklyPages) ||
      isNaN(discussionPosts) ||
      isNaN(exams) ||
      isNaN(otherAssignments) ||
      isNaN(classMeetings) ||
      classWeeks <= 0
    ) {
      workloadEstimates.textContent = "Please enter valid numbers.";
      return;
    }

    const workload =
      weeklyPages / classWeeks +
      discussionPosts +
      exams +
      otherAssignments +
      classMeetings;

    workloadEstimates.textContent = `Estimated Workload: ${workload.toFixed(2)} hours/week`;
  }

  // Add event listeners to inputs to update workload dynamically
  [
    classWeeksInput,
    weeklyPagesInput,
    discussionPostsInput,
    examsInput,
    otherAssignmentsInput,
    classMeetingsInput,
  ].forEach((input) => {
    input.addEventListener("input", calculateWorkload);
  });

  // Append the container to the root element
  root.appendChild(container);

  // Initial calculation
  calculateWorkload();
}

// Initialize the workload estimator when the page loads
document.addEventListener("DOMContentLoaded", initializeWorkloadEstimator);