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
        const inputValues = initializeElements(this.shadowRoot);
        initializeEventListeners(inputValues, this.shadowRoot);
      })
      .catch((error) => console.error('Error loading UI content:', error));

  }

connectedCallback() {
  const inputValues = initializeElements(this.shadowRoot);
        
  initializeEventListeners(inputValues, this.shadowRoot);
  console.log('Input values:', inputValues);
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

initializeElements(shadowRoot) {
  const elements = {
    classWeeks: shadowRoot.querySelector('#classWeeks') || { value: '15' },
    readingPages: shadowRoot.querySelector('#weeklyPagesInput') || { value: '0' },
    pageDensity: shadowRoot.querySelector('#pageDensitySelect') || { value: '450 Words' },
    difficulty: shadowRoot.querySelector('#difficultySelect') || { value: 'No New Concepts' },
    purpose: shadowRoot.querySelector('#purposeSelect') || { value: 'Survey' },
    pagesPerHour: shadowRoot.querySelector('#pagesPerHourInput') || { value: '10' },
    semesterPages: shadowRoot.querySelector('#semesterPagesInput') || { value: '0' },
    pageDensityWriting: shadowRoot.querySelector('#pageDensityWritingSelect') || { value: '250 Words' },
    genre: shadowRoot.querySelector('#genreSelect') || { value: 'Reflection/Narrative' },
    drafting: shadowRoot.querySelector('#draftingSelect') || { value: 'No Drafting' },
    hoursPerPage: shadowRoot.querySelector('#hoursPerPageInput') || { value: '0.5' },
    weeklyVideos: shadowRoot.querySelector('#weeklyVideosInput') || { value: '0' },
    discussionPosts: shadowRoot.querySelector('#discussionPostsInput') || { value: '0' },
    discussionFormat: shadowRoot.querySelector('#discussionFormatSelect') || { value: 'Text' },
    avgLength: shadowRoot.querySelector('#avgLengthInput') || { value: '250' },
    avgLengthMinutes: shadowRoot.querySelector('#avgLengthMinutesInput') || { value: '3' },
    discussionHoursPerWeek: shadowRoot.querySelector('#hoursPerWeekInput') || { value: '1' },
    exams: shadowRoot.querySelector('#examsInput') || { value: '0' },
    studyHours: shadowRoot.querySelector('#studyHoursInput') || { value: '5' },
    takeHomeExams: shadowRoot.querySelector('#takeHomeExamsCheckbox') || { checked: false },
    examTimeLimit: shadowRoot.querySelector('#examTimeLimitInput') || { value: '60' },
    numberPerSemester: shadowRoot.querySelector('#numberPerSemesterInput') || { value: '0' },
    hoursPerAssignment: shadowRoot.querySelector('#hoursPerAssignmentInput') || { value: '0' },
    independent: shadowRoot.querySelector('#independentCheckbox') || { checked: false },
    meetingsPerWeek: shadowRoot.querySelector('#meetingsPerWeek') || { value: '0' },
    meetingLength: shadowRoot.querySelector('#meetingLength') || { value: '0' },
    readingRateCheckbox: shadowRoot.querySelector('#readingRateCheckbox') || { checked: false },
    writingRateCheckbox: shadowRoot.querySelector('#writingRateCheckbox') || { checked: false },
    discussionRateCheckbox: shadowRoot.querySelector('#discussionRateCheckbox') || { checked: false },
    readingRateContainer: shadowRoot.querySelector('#readingRateContainer') || {},
    writingRateContainer: shadowRoot.querySelector('#writingRateContainer') || {},
    discussionRateContainer: shadowRoot.querySelector('#discussionRateContainer') || {},
    takeHomeExamsContainer: shadowRoot.querySelector('#takeHomeExamsContainer') || {},
    textInputContainer: shadowRoot.querySelector('#textInputContainer') || {},
    audioInputContainer: shadowRoot.querySelector('#audioInputContainer') || {},
    sliderValue: shadowRoot.querySelector('#sliderValue') || { textContent: '0' },
    total: shadowRoot.querySelector('#total') || { textContent: '0.00 hours/week' },
    independentDisplay: shadowRoot.querySelector('#independent') || { textContent: '0.00 hours/week' },
    contact: shadowRoot.querySelector('#contact') || { textContent: '0.00 hours/week' },
    readingRateDisplay: shadowRoot.querySelector('#readingRateDisplay') || { textContent: '67 pages per hour' },
    writingRateDisplay: shadowRoot.querySelector('#writingRateDisplay') || { textContent: '0.75 hours per page' },
    hoursPerWeekDiscussionDisplay: shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay') || { textContent: '0.00 hours/week' },
  };
  return elements;
}
  
 initializeEventListeners(inputValues, shadowRoot) {
  // Attach event listeners to all input elements in inputValues
  Object.values(inputValues).forEach((input) => {
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      const eventType = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        const updatedInputValues = initializeElements(shadowRoot); // Reinitialize input values
        const workload = calculateWorkload(updatedInputValues);
        updateWorkloadEstimates(workload, shadowRoot);
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
    if (!checkbox || !container) return; // Skip if either is not found
    checkbox.addEventListener('change', (e) => {
      container.classList.toggle('hidden', !e.target.checked);
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
  });

  // Attach event listener for slider
  shadowRoot.querySelector('#hoursPerAssignmentInput').addEventListener('input', (e) => {
    shadowRoot.querySelector('#sliderValue').textContent = e.target.value;
  });
}

/// This function will update the workload estimates and rates in the UI
updateWorkloadEstimates(estimates, shadowRoot) {
    shadowRoot.querySelector('#total').textContent = `Total: ${estimates.total.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#independent').textContent = `Independent: ${estimates.independent.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#contact').textContent = `Contact: ${estimates.contact.toFixed(2)} hours/week`;
    shadowRoot.querySelector('#readingRateDisplay').textContent = `${estimates.readingRate.toFixed(0)} pages per hour`;
    shadowRoot.querySelector('#writingRateDisplay').textContent = `${estimates.writingRate.toFixed(2)} hours per page`;
    shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay').textContent = `${estimates.hoursPerWeekDiscussion.toFixed(2)} hours/week`;
  }
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator)
