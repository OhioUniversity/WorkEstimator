"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWorkload = calculateWorkload;
/// Calculates the total weekly workload based on user inputs.
/// - Computes independent and contact hours for activities like reading, writing, discussions, exams, and class meetings.
/// - Updates the workload estimates and rates dynamically in the UI.
var pagesPerHourData = {
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
var hoursPerWriting = {
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
function calculateWorkload(inputValues) {
    var _a, _b, _c, _d;
    var classWeeks = inputValues.classWeeks, readingPages = inputValues.readingPages, pageDensity = inputValues.pageDensity, difficulty = inputValues.difficulty, purpose = inputValues.purpose, pagesPerHour = inputValues.pagesPerHour, semesterPages = inputValues.semesterPages, pageDensityWriting = inputValues.pageDensityWriting, genre = inputValues.genre, drafting = inputValues.drafting, hoursPerPage = inputValues.hoursPerPage, weeklyVideos = inputValues.weeklyVideos, discussionPosts = inputValues.discussionPosts, discussionFormat = inputValues.discussionFormat, avgLength = inputValues.avgLength, avgLengthMinutes = inputValues.avgLengthMinutes, discussionHoursPerWeek = inputValues.discussionHoursPerWeek, exams = inputValues.exams, studyHours = inputValues.studyHours, takeHomeExams = inputValues.takeHomeExams, examTimeLimit = inputValues.examTimeLimit, numberPerSemester = inputValues.numberPerSemester, hoursPerAssignment = inputValues.hoursPerAssignment, meetingsPerWeek = inputValues.meetingsPerWeek, meetingLength = inputValues.meetingLength, readingRateCheckbox = inputValues.readingRateCheckbox, writingRateCheckbox = inputValues.writingRateCheckbox, discussionRateCheckbox = inputValues.discussionRateCheckbox, independent = inputValues.independent;
    // Parse values with defaults
    var classWeeksValue = parseInt((classWeeks === null || classWeeks === void 0 ? void 0 : classWeeks.value) || '15');
    var readingPagesValue = parseInt((readingPages === null || readingPages === void 0 ? void 0 : readingPages.value) || '0');
    var semesterPagesValue = parseFloat((semesterPages === null || semesterPages === void 0 ? void 0 : semesterPages.value) || '0');
    var weeklyVideosValue = parseFloat((weeklyVideos === null || weeklyVideos === void 0 ? void 0 : weeklyVideos.value) || '0');
    var discussionPostsPerWeek = parseFloat((discussionPosts === null || discussionPosts === void 0 ? void 0 : discussionPosts.value) || '0');
    var avgLengthValue = parseFloat((avgLength === null || avgLength === void 0 ? void 0 : avgLength.value) || '250');
    var avgLengthMinutesValue = parseFloat((avgLengthMinutes === null || avgLengthMinutes === void 0 ? void 0 : avgLengthMinutes.value) || '0');
    var discussionHoursPerWeekValue = parseFloat((discussionHoursPerWeek === null || discussionHoursPerWeek === void 0 ? void 0 : discussionHoursPerWeek.value) || '0');
    var examsValue = parseFloat((exams === null || exams === void 0 ? void 0 : exams.value) || '0');
    var studyHoursValue = parseFloat((studyHours === null || studyHours === void 0 ? void 0 : studyHours.value) || '0');
    var examTimeLimitValue = parseFloat((examTimeLimit === null || examTimeLimit === void 0 ? void 0 : examTimeLimit.value) || '0');
    var numberPerSemesterValue = parseFloat((numberPerSemester === null || numberPerSemester === void 0 ? void 0 : numberPerSemester.value) || '0');
    var hoursPerAssignmentValue = parseFloat((hoursPerAssignment === null || hoursPerAssignment === void 0 ? void 0 : hoursPerAssignment.value) || '0');
    var meetingsPerWeekValue = parseFloat((meetingsPerWeek === null || meetingsPerWeek === void 0 ? void 0 : meetingsPerWeek.value) || '0');
    var meetingLengthValue = parseFloat((meetingLength === null || meetingLength === void 0 ? void 0 : meetingLength.value) || '0');
    // Reading workload calculation
    var readingRate;
    if (!readingRateCheckbox.checked) {
        var difficultyValue = ((difficulty === null || difficulty === void 0 ? void 0 : difficulty.value) || 'No New Concepts');
        var purposeValue = ((purpose === null || purpose === void 0 ? void 0 : purpose.value) || 'Survey');
        var pageDensityValue = ((pageDensity === null || pageDensity === void 0 ? void 0 : pageDensity.value) || '450 Words');
        readingRate = ((_b = (_a = pagesPerHourData[difficultyValue]) === null || _a === void 0 ? void 0 : _a[purposeValue]) === null || _b === void 0 ? void 0 : _b[pageDensityValue]) || 0;
    }
    else {
        readingRate = parseFloat((pagesPerHour === null || pagesPerHour === void 0 ? void 0 : pagesPerHour.value) || '0');
    }
    var readingTime = readingPagesValue / (readingRate || 1); // Avoid division by zero
    // Writing workload calculation
    var writingRate;
    if (!writingRateCheckbox.checked) {
        var pageDensityWritingValue = ((pageDensityWriting === null || pageDensityWriting === void 0 ? void 0 : pageDensityWriting.value) || '250 Words');
        var draftingValue = ((drafting === null || drafting === void 0 ? void 0 : drafting.value) || 'No Drafting');
        var genreValue = ((genre === null || genre === void 0 ? void 0 : genre.value) || 'Reflection/Narrative');
        writingRate = ((_d = (_c = hoursPerWriting[pageDensityWritingValue]) === null || _c === void 0 ? void 0 : _c[draftingValue]) === null || _d === void 0 ? void 0 : _d[genreValue]) || 0; // Default to 0 if not found
    }
    else {
        writingRate = parseFloat((hoursPerPage === null || hoursPerPage === void 0 ? void 0 : hoursPerPage.value) || '0');
    }
    var writingTime = (semesterPagesValue * (writingRate || 0)) / classWeeksValue;
    // Videos workload calculation
    var videoTime = weeklyVideosValue;
    // Discussion workload calculation
    var discussionRate;
    var discussionTime;
    if (!discussionRateCheckbox.checked) {
        if ((discussionFormat === null || discussionFormat === void 0 ? void 0 : discussionFormat.value) === 'Text') {
            discussionRate = avgLengthValue * 0.004; // Words to hours
        }
        else if ((discussionFormat === null || discussionFormat === void 0 ? void 0 : discussionFormat.value) === 'Audio/Video') {
            discussionRate = avgLengthMinutesValue / 3; // Minutes to hours
        }
        discussionTime = discussionPostsPerWeek * (discussionRate || 0);
    }
    else {
        discussionTime = discussionHoursPerWeekValue;
    }
    // Exams workload calculation
    var examTime = 0;
    if (takeHomeExams === null || takeHomeExams === void 0 ? void 0 : takeHomeExams.checked) {
        examTime = examTimeLimitValue / 60; // Convert minutes to hours
    }
    var examsTime = (examsValue * (studyHoursValue + examTime)) / classWeeksValue;
    // Other assignments workload calculation
    var otherTime = (hoursPerAssignmentValue * numberPerSemesterValue) / classWeeksValue;
    // Class meetings workload calculation
    var classMeetingTime = meetingsPerWeekValue * meetingLengthValue;
    // Independent and Contact workload calculation
    var independentTime = readingTime + writingTime + videoTime + examsTime;
    var contactTime = discussionTime + classMeetingTime;
    if (independent === null || independent === void 0 ? void 0 : independent.checked) {
        independentTime += otherTime;
    }
    else {
        contactTime += otherTime;
    }
    // Total workload calculation
    var total = independentTime + contactTime;
    var workload = {
        total: total,
        independentTime: independentTime,
        contactTime: contactTime,
        readingRate: readingRate,
        writingRate: writingRate,
        discussionTime: discussionTime
    };
    // Return the calculated values
    return { workload: workload };
}
