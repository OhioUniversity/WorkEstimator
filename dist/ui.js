"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/// These are the different rates for reading and writing based on the type of assignment and the difficulty level
/// this data is based on the following sources:
/// https://cat.wfu.edu/resources/workload/estimationdetails/
var calc_js_1 = require("./calc.js");
var WorkloadEstimator = /** @class */ (function (_super) {
    __extends(WorkloadEstimator, _super);
    function WorkloadEstimator() {
        var _this = _super.call(this) || this;
        // Attach a shadow DOM for encapsulation
        var shadow = _this.attachShadow({ mode: 'open' });
        // Load external CSS
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'src/ui.css');
        shadow.appendChild(link);
        // Fetch and load the HTML content
        fetch('src/ui.html')
            .then(function (response) { return response.text(); })
            .then(function (html) {
            var container = document.createElement('div');
            container.innerHTML = html;
            shadow.appendChild(container);
            // Initialize elements and event listeners after the HTML is loaded
            var inputValues = _this.initializeElements();
            _this.initializeEventListeners(inputValues);
        })
            .catch(function (error) { return console.error('Error loading UI content:', error); });
        return _this;
    }
    WorkloadEstimator.prototype.connectedCallback = function () {
        var inputValues = this.initializeElements();
        this.initializeEventListeners(inputValues);
        var workload = (0, calc_js_1.calculateWorkload)(inputValues);
        // Update the UI with the initial workload estimates
        this.updateWorkloadEstimates(workload);
    };
    WorkloadEstimator.prototype.initializeElements = function () {
        var elements = {
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
    };
    WorkloadEstimator.prototype.initializeEventListeners = function (inputValues) {
        var _this = this;
        // Attach event listeners to all input elements in inputValues
        Object.values(inputValues).forEach(function (input) {
            if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
                var eventType = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
                input.addEventListener(eventType, function () {
                    var updatedInputValues = _this.initializeElements();
                    var workload = (0, calc_js_1.calculateWorkload)(updatedInputValues);
                    _this.updateWorkloadEstimates(workload);
                });
            }
        });
        // Attach change event listeners for checkboxes
        var checkboxes = [
            { checkbox: this.shadowRoot.querySelector('#readingRateCheckbox'), container: this.shadowRoot.querySelector('#readingRateContainer') },
            { checkbox: this.shadowRoot.querySelector('#writingRateCheckbox'), container: this.shadowRoot.querySelector('#writingRateContainer') },
            { checkbox: this.shadowRoot.querySelector('#discussionRateCheckbox'), container: this.shadowRoot.querySelector('#discussionRateContainer') },
            { checkbox: this.shadowRoot.querySelector('#takeHomeExamsCheckbox'), container: this.shadowRoot.querySelector('#takeHomeExamsContainer') },
        ];
        checkboxes.forEach(function (_a) {
            var checkbox = _a.checkbox, container = _a.container;
            if (!checkbox || !container)
                return;
            checkbox.addEventListener('change', function (e) {
                var target = e.target;
                container.classList.toggle('hidden', !target.checked);
            });
        });
        // Attach event listener for discussion format selection
        var discussionFormatSelect = this.shadowRoot.querySelector('#discussionFormatSelect');
        var textInputContainer = this.shadowRoot.querySelector('#textInputContainer');
        var audioInputContainer = this.shadowRoot.querySelector('#audioInputContainer');
        if (discussionFormatSelect && textInputContainer && audioInputContainer) {
            discussionFormatSelect.addEventListener('change', function (e) {
                var target = e.target;
                if (target.value === 'Text') {
                    textInputContainer.classList.remove('hidden');
                    audioInputContainer.classList.add('hidden');
                }
                else {
                    textInputContainer.classList.add('hidden');
                    audioInputContainer.classList.remove('hidden');
                }
            });
        }
        // Attach event listener for slider
        var hoursPerAssignmentInput = this.shadowRoot.querySelector('#hoursPerAssignmentInput');
        var sliderValue = this.shadowRoot.querySelector('#sliderValue');
        if (hoursPerAssignmentInput && sliderValue) {
            hoursPerAssignmentInput.addEventListener('input', function (e) {
                var target = e.target;
                sliderValue.textContent = target.value;
            });
        }
    };
    /// This function will update the workload estimates and rates in the UI
    WorkloadEstimator.prototype.updateWorkloadEstimates = function (estimates) {
        var w = estimates.workload;
        var total = this.shadowRoot.querySelector('#total');
        var independent = this.shadowRoot.querySelector('#independent');
        var contact = this.shadowRoot.querySelector('#contact');
        var readingRateDisplay = this.shadowRoot.querySelector('#readingRateDisplay');
        var writingRateDisplay = this.shadowRoot.querySelector('#writingRateDisplay');
        var hoursPerWeekDiscussionDisplay = this.shadowRoot.querySelector('#hoursPerWeekDiscussionDisplay');
        if (total)
            total.textContent = "Total: ".concat(w.total.toFixed(2), " hours/week");
        if (independent)
            independent.textContent = "Independent: ".concat(w.independentTime.toFixed(2), " hours/week");
        if (contact)
            contact.textContent = "Contact: ".concat(w.contactTime.toFixed(2), " hours/week");
        if (readingRateDisplay)
            readingRateDisplay.textContent = "".concat(w.readingRate.toFixed(0), " pages per hour");
        if (writingRateDisplay)
            writingRateDisplay.textContent = "".concat(w.writingRate.toFixed(2), " hours per page");
        if (hoursPerWeekDiscussionDisplay)
            hoursPerWeekDiscussionDisplay.textContent = "".concat(w.discussionTime.toFixed(2), " hours/week");
    };
    return WorkloadEstimator;
}(HTMLElement));
// Register the custom element
customElements.define('workload-estimator', WorkloadEstimator);
