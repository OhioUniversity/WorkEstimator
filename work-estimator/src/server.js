import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Resolve the directory name (__dirname is not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback route to serve "index.html" for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Data arrays for pages per hour and hours per writing
const pagesPerHour = {
  "No New Concepts": {
    Survey: { "450 Words": 67, "600 Words": 47, "750 Words": 33 },
    Learn: { "450 Words": 33, "600 Words": 24, "750 Words": 17 },
    Engage: { "450 Words": 17, "600 Words": 12, "750 Words": 9 },
  },
  "Some New Concepts": {
    Survey: { "450 Words": 50, "600 Words": 35, "750 Words": 25 },
    Learn: { "450 Words": 25, "600 Words": 18, "750 Words": 13 },
    Engage: { "450 Words": 13, "600 Words": 9, "750 Words": 7 },
  },
  "Many New Concepts": {
    Survey: { "450 Words": 40, "600 Words": 28, "750 Words": 20 },
    Learn: { "450 Words": 20, "600 Words": 14, "750 Words": 10 },
    Engage: { "450 Words": 10, "600 Words": 7, "750 Words": 5 },
  },
};

const hoursPerWriting = {
  "250 Words": {
    "No Drafting": { Reflection: 0.75, Argument: 1, Research: 1.25 },
    "Minimal Drafting": { Reflection: 1.5, Argument: 2, Research: 2.5 },
    "Extensive Drafting": { Reflection: 2, Argument: 3, Research: 4 },
  },
  "500 Words": {
    "No Drafting": { Reflection: 1.5, Argument: 2, Research: 2.5 },
    "Minimal Drafting": { Reflection: 3, Argument: 4, Research: 5 },
    "Extensive Drafting": { Reflection: 4, Argument: 6, Research: 8 },
  },
};

// Helper function to safely parse numbers
const parseNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value));

// Endpoint to calculate workload
app.post("/calculate", (req, res) => {
  try {
    const input = req.body;

    // Validate required fields
    if (!input.classWeeks || input.classWeeks <= 0) {
      return res.status(400).json({ error: "Invalid classWeeks value" });
    }
    if (!input.weeklyPages || input.weeklyPages < 0) {
      return res.status(400).json({ error: "Invalid weeklyPages value" });
    }

    // Reading rate
    const pagesPerHourSel = input.setReadingRate
      ? parseNumber(input.overridePagesPerHour)
      : pagesPerHour[input.difficulty][input.readingPurpose][input.readingDensity];

    // Writing rate
    const hoursPerWritingSel = input.setWritingRate
      ? parseNumber(input.overrideHoursPerWriting)
      : hoursPerWriting[input.writtenDensity][input.draftRevise][input.writingPurpose];

    // Discussion post hours
    let postHoursSel = 0;
    if (!input.setDiscussion) {
      if (input.postFormat === 1) {
        // Text estimate
        postHoursSel = (parseNumber(input.postLengthText) * parseNumber(input.postsPerWeek)) / 250;
      } else if (input.postFormat === 2) {
        // Audio/video estimate
        postHoursSel =
          0.18 * (parseNumber(input.postLengthAV) * parseNumber(input.postsPerWeek)) +
          (parseNumber(input.postLengthAV) * parseNumber(input.postsPerWeek)) / 6;
      }
    } else {
      postHoursSel = parseNumber(input.overrideDiscussion);
    }

    // Exam time
    const takeHomeSel = input.takeHome ? parseNumber(input.examLength) : 0;

    // Other assignments
    const otherSel = input.otherEngage
      ? 0
      : parseNumber(input.otherAssign) * parseNumber(input.otherHours);

    // Total workload calculation
    const totalWorkload =
      parseNumber(input.weeklyPages) / pagesPerHourSel +
      (hoursPerWritingSel * parseNumber(input.semesterPages)) / parseNumber(input.classWeeks) +
      (parseNumber(input.exams) * parseNumber(input.examHours)) / parseNumber(input.classWeeks) +
      otherSel / parseNumber(input.classWeeks) +
      postHoursSel +
      parseNumber(input.weeklyVideos) +
      (takeHomeSel / 60) * parseNumber(input.exams) / parseNumber(input.classWeeks) +
      parseNumber(input.syncSessions) * parseNumber(input.syncLength);

    // Independent workload calculation
    const independentWorkload =
      parseNumber(input.weeklyPages) / pagesPerHourSel +
      (hoursPerWritingSel * parseNumber(input.semesterPages)) / parseNumber(input.classWeeks) +
      (parseNumber(input.exams) * parseNumber(input.examHours)) / parseNumber(input.classWeeks) +
      parseNumber(input.weeklyVideos) +
      otherSel / parseNumber(input.classWeeks) +
      (takeHomeSel / 60) * parseNumber(input.exams) / parseNumber(input.classWeeks);

    // Engagement time calculation
    const engagementTime =
      postHoursSel +
      parseNumber(input.syncSessions) * parseNumber(input.syncLength) +
      otherSel / parseNumber(input.classWeeks);

    // Discussion post hours calculation
    const discussionPostHours =
      input.postFormat === 1
        ? (parseNumber(input.postLengthText) * parseNumber(input.postsPerWeek)) / 250
        : (parseNumber(input.postLengthAV) * parseNumber(input.postsPerWeek)) / 3;

    // Send response
    res.json({
      totalWorkload: `${totalWorkload.toFixed(2)} hrs/wk`,
      independentWorkload: `${independentWorkload.toFixed(2)} hrs/wk`,
      engagementTime: `${engagementTime.toFixed(2)} hrs/wk`,
      discussionPostHours: `${discussionPostHours.toFixed(2)} hrs/wk`,
      pagesPerHour: `${pagesPerHourSel} pages per hour`,
      hoursPerWriting: `${hoursPerWritingSel} hours per page`,
    });
  } catch (error) {
    console.error("Error calculating workload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});