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
import { calculateWorkload } from './calc.ts';
import { loadUserStylesheet } from './style.ts';
import uiHtml from './ui.html?raw';
import uiCss from './ui.css?raw';

class WorkloadEstimator extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    // Load user stylesheet or fallback to default
    loadUserStylesheet(shadow, uiCss);

    // Inject the inlined HTML
    const container = document.createElement('div');
    container.innerHTML = uiHtml;
    shadow.appendChild(container);

    // Now initialize all interactive logic
    this.initializeEventListeners(this.initializeElements());
  }

  connectedCallback() {
    const inputValues = this.initializeElements();
    this.initializeEventListeners(inputValues);

    // Update the UI with the initial workload estimates
    this.updateWorkloadEstimates(calculateWorkload(this.getInputValues()));
  }

  initializeElements() {
    const elements = {
      classWeeks: this.shadowRoot!.querySelector('#classWeeks') || { value: '15' },
      readingPages: this.shadowRoot!.querySelector('#weeklyPagesInput') || { value: '0' },
      pageDensity: this.shadowRoot!.querySelector('#pageDensitySelect') || { value: '450 Words' },
      difficulty: this.shadowRoot!.querySelector('#difficultySelect') || {
        value: 'No New Concepts',
      },
      purpose: this.shadowRoot!.querySelector('#purposeSelect') || { value: 'Survey' },
      pagesPerHour: this.shadowRoot!.querySelector('#pagesPerHourInput') || { value: '10' },
      semesterPages: this.shadowRoot!.querySelector('#semesterPagesInput') || { value: '0' },
      pageDensityWriting: this.shadowRoot!.querySelector('#pageDensityWritingSelect') || {
        value: '250 Words',
      },
      genre: this.shadowRoot!.querySelector('#genreSelect') || { value: 'Reflection/Narrative' },
      drafting: this.shadowRoot!.querySelector('#draftingSelect') || { value: 'No Drafting' },
      hoursPerPage: this.shadowRoot!.querySelector('#hoursPerPageInput') || { value: '0.5' },
      weeklyVideos: this.shadowRoot!.querySelector('#weeklyVideosInput') || { value: '0' },
      discussionPosts: this.shadowRoot!.querySelector('#discussionPostsInput') || { value: '0' },
      discussionFormat: this.shadowRoot!.querySelector('#discussionFormatSelect') || {
        value: 'Text',
      },
      avgLength: this.shadowRoot!.querySelector('#avgLengthInput') || { value: '250' },
      avgLengthMinutes: this.shadowRoot!.querySelector('#avgLengthMinutesInput') || { value: '3' },
      discussionHoursPerWeek: this.shadowRoot!.querySelector('#hoursPerWeekInput') || {
        value: '1',
      },
      exams: this.shadowRoot!.querySelector('#examsInput') || { value: '0' },
      studyHours: this.shadowRoot!.querySelector('#studyHoursInput') || { value: '5' },
      takeHomeExams: this.shadowRoot!.querySelector('#takeHomeExamsCheckbox') || { checked: false },
      examTimeLimit: this.shadowRoot!.querySelector('#examTimeLimitInput') || { value: '60' },
      numberPerSemester: this.shadowRoot!.querySelector('#numberPerSemesterInput') || {
        value: '0',
      },
      hoursPerAssignment: this.shadowRoot!.querySelector('#hoursPerAssignmentInput') || {
        value: '0',
      },
      independent: this.shadowRoot!.querySelector('#independentCheckbox') || { checked: false },
      meetingsPerWeek: this.shadowRoot!.querySelector('#meetingsPerWeek') || { value: '0' },
      meetingLength: this.shadowRoot!.querySelector('#meetingLength') || { value: '0' },
      readingRateCheckbox: this.shadowRoot!.querySelector('#readingRateCheckbox') || {
        checked: false,
      },
      writingRateCheckbox: this.shadowRoot!.querySelector('#writingRateCheckbox') || {
        checked: false,
      },
      discussionRateCheckbox: this.shadowRoot!.querySelector('#discussionRateCheckbox') || {
        checked: false,
      },
      sliderValue: this.shadowRoot!.querySelector('#sliderValue') || { textContent: '0' },
    };
    return elements;
  }

  getInputValues() {
    const inputValues = {
      classWeeks: Number(
        (this.shadowRoot!.querySelector('#classWeeks') as HTMLInputElement)?.value || 15
      ),
      readingPages: Number(
        (this.shadowRoot!.querySelector('#weeklyPagesInput') as HTMLInputElement)?.value || 0
      ),
      pageDensity:
        (this.shadowRoot!.querySelector('#pageDensitySelect') as HTMLSelectElement).value ||
        '450 Words',
      difficulty:
        (this.shadowRoot!.querySelector('#difficultySelect') as HTMLSelectElement).value ||
        'No New Concepts',
      purpose:
        (this.shadowRoot!.querySelector('#purposeSelect') as HTMLSelectElement).value || 'Survey',
      pagesPerHour: Number(
        (this.shadowRoot!.querySelector('#pagesPerHourInput') as HTMLInputElement)?.value || 10
      ),
      semesterPages: Number(
        (this.shadowRoot!.querySelector('#semesterPagesInput') as HTMLInputElement)?.value || 0
      ),
      pageDensityWriting:
        (this.shadowRoot!.querySelector('#pageDensityWritingSelect') as HTMLSelectElement).value ||
        '250 Words',
      genre:
        (this.shadowRoot!.querySelector('#genreSelect') as HTMLSelectElement).value ||
        'Reflection/Narrative',
      drafting:
        (this.shadowRoot!.querySelector('#draftingSelect') as HTMLSelectElement).value ||
        'No Drafting',
      hoursPerPage: Number(
        (this.shadowRoot!.querySelector('#hoursPerPageInput') as HTMLInputElement)?.value || 0.5
      ),
      weeklyVideos: Number(
        (this.shadowRoot!.querySelector('#weeklyVideosInput') as HTMLInputElement)?.value || 0
      ),
      discussionPosts: Number(
        (this.shadowRoot!.querySelector('#discussionPostsInput') as HTMLInputElement)?.value || 0
      ),
      discussionFormat:
        (this.shadowRoot!.querySelector('#discussionFormatSelect') as HTMLSelectElement).value ||
        'Text',
      avgLength: Number(
        (this.shadowRoot!.querySelector('#avgLengthInput') as HTMLInputElement)?.value || 250
      ),
      avgLengthMinutes: Number(
        (this.shadowRoot!.querySelector('#avgLengthMinutesInput') as HTMLInputElement)?.value || 3
      ),
      discussionHoursPerWeek: Number(
        (this.shadowRoot!.querySelector('#hoursPerWeekInput') as HTMLInputElement)?.value || 1
      ),
      exams: Number(
        (this.shadowRoot!.querySelector('#examsInput') as HTMLInputElement)?.value || 0
      ),
      studyHours: Number(
        (this.shadowRoot!.querySelector('#studyHoursInput') as HTMLInputElement)?.value || 5
      ),
      takeHomeExams:
        (this.shadowRoot!.querySelector('#takeHomeExamsCheckbox') as HTMLInputElement).checked ||
        false,
      examTimeLimit: Number(
        (this.shadowRoot!.querySelector('#examTimeLimitInput') as HTMLInputElement)?.value || 60
      ),
      numberPerSemester: Number(
        (this.shadowRoot!.querySelector('#numberPerSemesterInput') as HTMLInputElement)?.value || 0
      ),
      hoursPerAssignment: Number(
        (this.shadowRoot!.querySelector('#hoursPerAssignmentInput') as HTMLInputElement)?.value || 0
      ),
      independent:
        (this.shadowRoot!.querySelector('#independentCheckbox') as HTMLInputElement).checked ||
        false,
      meetingsPerWeek: Number(
        (this.shadowRoot!.querySelector('#meetingsPerWeek') as HTMLInputElement)?.value || 0
      ),
      meetingLength: Number(
        (this.shadowRoot!.querySelector('#meetingLength') as HTMLInputElement)?.value || 0
      ),
      readingRateCheckbox:
        (this.shadowRoot!.querySelector('#readingRateCheckbox') as HTMLInputElement).checked ||
        false,
      writingRateCheckbox:
        (this.shadowRoot!.querySelector('#writingRateCheckbox') as HTMLInputElement).checked ||
        false,
      discussionRateCheckbox:
        (this.shadowRoot!.querySelector('#discussionRateCheckbox') as HTMLInputElement).checked ||
        false,
    };
    return inputValues;
  }

  initializeEventListeners(inputValues: Record<string, any>): void {
    // Attach event listeners to all input elements in inputValues
    Object.values(inputValues).forEach((input: any) => {
      if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
        const eventType = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
        input.addEventListener(eventType, () => {
          this.updateWorkloadEstimates(calculateWorkload(this.getInputValues()));
        });
      }
    });

    // Attach change event listeners for checkboxes
    const checkboxes = [
      {
        checkbox: this.shadowRoot!.querySelector('#readingRateCheckbox') as HTMLInputElement,
        container: this.shadowRoot!.querySelector('#readingRateContainer') as HTMLElement,
      },
      {
        checkbox: this.shadowRoot!.querySelector('#writingRateCheckbox') as HTMLInputElement,
        container: this.shadowRoot!.querySelector('#writingRateContainer') as HTMLElement,
      },
      {
        checkbox: this.shadowRoot!.querySelector('#discussionRateCheckbox') as HTMLInputElement,
        container: this.shadowRoot!.querySelector('#discussionRateContainer') as HTMLElement,
      },
      {
        checkbox: this.shadowRoot!.querySelector('#takeHomeExamsCheckbox') as HTMLInputElement,
        container: this.shadowRoot!.querySelector('#takeHomeExamsContainer') as HTMLElement,
      },
    ];

    checkboxes.forEach(({ checkbox, container }) => {
      if (!checkbox || !container) return;
      checkbox.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        container.classList.toggle('hidden', !target.checked);
      });
    });

    // Attach event listener for discussion format selection
    const discussionFormatSelect = this.shadowRoot!.querySelector(
      '#discussionFormatSelect'
    ) as HTMLSelectElement;
    const textInputContainer = this.shadowRoot!.querySelector('#textInputContainer') as HTMLElement;
    const audioInputContainer = this.shadowRoot!.querySelector(
      '#audioInputContainer'
    ) as HTMLElement;
    if (discussionFormatSelect && textInputContainer && audioInputContainer) {
      discussionFormatSelect.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        if (target.value === 'Text') {
          textInputContainer.classList.remove('hidden');
          audioInputContainer.classList.add('hidden');
        } else {
          textInputContainer.classList.add('hidden');
          audioInputContainer.classList.remove('hidden');
        }
      });
    }

    // Attach event listener for slider
    const hoursPerAssignmentInput = this.shadowRoot!.querySelector(
      '#hoursPerAssignmentInput'
    ) as HTMLInputElement;
    const sliderValue = this.shadowRoot!.querySelector('#sliderValue') as HTMLElement;
    if (hoursPerAssignmentInput && sliderValue) {
      hoursPerAssignmentInput.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        sliderValue.textContent = target.value;
      });
    }
  }

  /// This function will update the workload estimates and rates in the UI
  updateWorkloadEstimates(estimates: any): void {
    const w = estimates.workload;
    const total = this.shadowRoot!.querySelector('#total') as HTMLElement;
    const independent = this.shadowRoot!.querySelector('#independent') as HTMLElement;
    const contact = this.shadowRoot!.querySelector('#contact') as HTMLElement;
    const readingRateDisplay = this.shadowRoot!.querySelector('#readingRateDisplay') as HTMLElement;
    const writingRateDisplay = this.shadowRoot!.querySelector('#writingRateDisplay') as HTMLElement;
    const hoursPerWeekDiscussionDisplay = this.shadowRoot!.querySelector(
      '#hoursPerWeekDiscussionDisplay'
    ) as HTMLElement;

    if (total) total.textContent = `Total: ${w.total.toFixed(2)} hours/week`;
    if (independent)
      independent.textContent = `Independent: ${w.independentTime.toFixed(2)} hours/week`;
    if (contact) contact.textContent = `Contact: ${w.contactTime.toFixed(2)} hours/week`;
    if (readingRateDisplay)
      readingRateDisplay.textContent = `${w.readingRate.toFixed(0)} pages per hour`;
    if (writingRateDisplay)
      writingRateDisplay.textContent = `${w.writingRate.toFixed(2)} hours per page`;
    if (hoursPerWeekDiscussionDisplay)
      hoursPerWeekDiscussionDisplay.textContent = `${w.discussionTime.toFixed(2)} hours/week`;
  }
}

// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator);
