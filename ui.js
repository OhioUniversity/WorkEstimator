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
import { calculateWorkload } from './calc.js';


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
        const inputValues = this.initializeElements();
        this.initializeEventListeners(inputValues);
      })
      .catch((error) => console.error('Error loading UI content:', error));

  }

connectedCallback() {
  const inputValues = this.initializeElements();
        
  this.initializeEventListeners(inputValues);
  const workload = calculateWorkload(inputValues);

  // Update the UI with the initial workload estimates
  this.updateWorkloadEstimates(workload);
}

initializeElements() {
  const elements = {
    classWeeks: this.shadowRoot.querySelector('#classWeeks') || { value: '15' },
    readingPages: this.shadowRoot.querySelector('#weeklyPagesInput') || { value: '0' },
    pageDensity: this.shadowRoot.querySelector('#pageDensitySelect') || { value: '450 Words' },
    difficulty: this.shadowRoot.querySelector('#difficultySelect') || { value: 'No New Concepts' },
    purpose: this.shadowRoot.querySelector('#purposeSelect') || { value: 'Survey' },
    pagesPerHour: this.shadowRoot.querySelector('#pagesPerHourInput') || { value: '10' },
    semesterPages: this.shadowRoot.querySelector('#semesterPagesInput') || { value: '0' },
    pageDensityWriting: this.shadowRoot.querySelector('#pageDensityWritingSelect') || { value: '250 Words' },
    genre: this.shadowRoot.querySelector('#genreSelect') || { value: 'Reflection/Narrative' },
    drafting: this.shadowRoot.querySelector('#draftingSelect') || { value: 'No Drafting' },
    hoursPerPage: this.shadowRoot.querySelector('#hoursPerPageInput') || { value: '0.5' },
    weeklyVideos: this.shadowRoot.querySelector('#weeklyVideosInput') || { value: '0' },
    discussionPosts: this.shadowRoot.querySelector('#discussionPostsInput') || { value: '0' },
    discussionFormat: this.shadowRoot.querySelector('#discussionFormatSelect') || { value: 'Text' },
    avgLength: this.shadowRoot.querySelector('#avgLengthInput') || { value: '250' },
    avgLengthMinutes: this.shadowRoot.querySelector('#avgLengthMinutesInput') || { value: '3' },
    discussionHoursPerWeek: this.shadowRoot.querySelector('#hoursPerWeekInput') || { value: '1' },
    exams: this.shadowRoot.querySelector('#examsInput') || { value: '0' },
    studyHours: this.shadowRoot.querySelector('#studyHoursInput') || { value: '5' },
    takeHomeExams: this.shadowRoot.querySelector('#takeHomeExamsCheckbox') || { checked: false },
    examTimeLimit: this.shadowRoot.querySelector('#examTimeLimitInput') || { value: '60' },
    numberPerSemester: this.shadowRoot.querySelector('#numberPerSemesterInput') || { value: '0' },
    hoursPerAssignment: this.shadowRoot.querySelector('#hoursPerAssignmentInput') || { value: '0' },
    independent: this.shadowRoot.querySelector('#independentCheckbox') || { checked: false },
    meetingsPerWeek: this.shadowRoot.querySelector('#meetingsPerWeek') || { value: '0' },
    meetingLength: this.shadowRoot.querySelector('#meetingLength') || { value: '0' },
    readingRateCheckbox: this.shadowRoot.querySelector('#readingRateCheckbox') || { checked: false },
    writingRateCheckbox: this.shadowRoot.querySelector('#writingRateCheckbox') || { checked: false },
    discussionRateCheckbox: this.shadowRoot.querySelector('#discussionRateCheckbox') || { checked: false },
    readingRateContainer: this.shadowRoot.querySelector('#readingRateContainer') || {},
    writingRateContainer: this.shadowRoot.querySelector('#writingRateContainer') || {},
    discussionRateContainer: this.shadowRoot.querySelector('#discussionRateContainer') || {},
    takeHomeExamsContainer: this.shadowRoot.querySelector('#takeHomeExamsContainer') || {},
    textInputContainer: this.shadowRoot.querySelector('#textInputContainer') || {},
    audioInputContainer: this.shadowRoot.querySelector('#audioInputContainer') || {},
    sliderValue: this.shadowRoot.querySelector('#sliderValue') || { textContent: '0' },
    total: this.shadowRoot.querySelector('#total') || { textContent: '0.00 hours/week' },
    independentDisplay: this.shadowRoot.querySelector('#independent') || { textContent: '0.00 hours/week' },
    contact: this.shadowRoot.querySelector('#contact') || { textContent: '0.00 hours/week' },
    readingRateDisplay: this.shadowRoot.querySelector('#readingRateDisplay') || { textContent: '67 pages per hour' },
    writingRateDisplay: this.shadowRoot.querySelector('#writingRateDisplay') || { textContent: '0.75 hours per page' },
    hoursPerWeekDiscussionDisplay: this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay') || { textContent: '0.00 hours/week' },
  };
  return elements;
}
  
 initializeEventListeners(inputValues) {
  // Attach event listeners to all input elements in inputValues
  Object.values(inputValues).forEach((input) => {
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      const eventType = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        const updatedInputValues = this.initializeElements(this.shadowRoot); // Reinitialize input values
        const workload = calculateWorkload(updatedInputValues);
        this.updateWorkloadEstimates(workload);
      });
    }
  });

  // Attach change event listeners for checkboxes
  const checkboxes = [
    { checkbox: this.shadowRoot.querySelector('#readingRateCheckbox'), container: this.shadowRoot.querySelector('#readingRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#writingRateCheckbox'), container: this.shadowRoot.querySelector('#writingRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#discussionRateCheckbox'), container: this.shadowRoot.querySelector('#discussionRateContainer') },
    { checkbox: this.shadowRoot.querySelector('#takeHomeExamsCheckbox'), container: this.shadowRoot.querySelector('#takeHomeExamsContainer') },
  ];

  checkboxes.forEach(({ checkbox, container }) => {
    if (!checkbox || !container) return; // Skip if either is not found
    checkbox.addEventListener('change', (e) => {
      container.classList.toggle('hidden', !e.target.checked);
    });
  });

  // Attach event listener for discussion format selection
  this.shadowRoot.querySelector('#discussionFormatSelect').addEventListener('change', (e) => {
    const textInputContainer = this.shadowRoot.querySelector('#textInputContainer');
    const audioInputContainer = this.shadowRoot.querySelector('#audioInputContainer');
    if (e.target.value === 'Text') {
      textInputContainer.classList.remove('hidden');
      audioInputContainer.classList.add('hidden');
    } else {
      textInputContainer.classList.add('hidden');
      audioInputContainer.classList.remove('hidden');
    }
  });

  // Attach event listener for slider
  this.shadowRoot.querySelector('#hoursPerAssignmentInput').addEventListener('input', (e) => {
    this.shadowRoot.querySelector('#sliderValue').textContent = e.target.value;
  });
}

/// This function will update the workload estimates and rates in the UI
updateWorkloadEstimates(estimates) {
  const w = estimates.workload;
  this.shadowRoot.querySelector('#total').textContent = `Total: ${w.total.toFixed(2)} hours/week`;
  this.shadowRoot.querySelector('#independent').textContent = `Independent: ${w.independentTime.toFixed(2)} hours/week`;
  this.shadowRoot.querySelector('#contact').textContent = `Contact: ${w.contactTime.toFixed(2)} hours/week`;
  this.shadowRoot.querySelector('#readingRateDisplay').textContent = `${w.readingRate.toFixed(0)} pages per hour`;
  this.shadowRoot.querySelector('#writingRateDisplay').textContent = `${w.writingRate.toFixed(2)} hours per page`;
  this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').textContent = `${w.discussionTime.toFixed(2)} hours/week`;
}
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)
