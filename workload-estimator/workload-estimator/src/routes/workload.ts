import express, { Request, Response } from "express";
import { pagesPerHour, hoursPerWriting } from "../data/workloadData";

const router = express.Router();

interface WorkloadRequestBody {
  setReadingRate: boolean;
  overridePagesPerHour: number;
  difficulty: string;
  readingPurpose: string;
  readingDensity: string;
  setWritingRate: boolean;
  overrideHoursPerWriting: number;
  writtenDensity: string;
  draftRevise: string;
  writingPurpose: string;
  weeklyPages: number;
  semesterPages: number;
  classWeeks: number;
  exams: number;
  examHours: number;
  otherAssign: number;
  otherHours: number;
  syncSessions: number;
  syncLength: number;
  postFormat: number;
  postLengthText: number;
  postLengthAV: number;
  postsPerWeek: number;
  setDiscussion: boolean;
  overrideDiscussion: number;
  takeHome: boolean;
  examLength: number;
  weeklyVideos: number;
  otherEngage: boolean;
}

router.post("/calculate", (req: Request<{}, {}, WorkloadRequestBody>, res: Response) => {
  try {
    const {
      setReadingRate,
      overridePagesPerHour,
      difficulty,
      readingPurpose,
      readingDensity,
      setWritingRate,
      overrideHoursPerWriting,
      writtenDensity,
      draftRevise,
      writingPurpose,
      weeklyPages,
      semesterPages,
      classWeeks,
      exams,
      examHours,
      otherAssign,
      otherHours,
      syncSessions,
      syncLength,
      postFormat,
      postLengthText,
      postLengthAV,
      postsPerWeek,
      setDiscussion,
      overrideDiscussion,
      takeHome,
      examLength,
      weeklyVideos,
      otherEngage,
    } = req.body;

    // Reading rate
    const pagesPerHourSel = setReadingRate
      ? overridePagesPerHour
      : pagesPerHour[difficulty][readingPurpose][readingDensity];

    // Writing rate
    const hoursPerWritingSel = setWritingRate
      ? overrideHoursPerWriting
      : hoursPerWriting[writtenDensity][draftRevise][writingPurpose];

    // Discussion post hours
    let postHoursSel = 0;
    if (!setDiscussion) {
      if (postFormat === 1) {
        postHoursSel = (postLengthText * postsPerWeek) / 250;
      } else if (postFormat === 2) {
        postHoursSel = (postLengthAV * postsPerWeek) / 3;
      }
    } else {
      postHoursSel = overrideDiscussion;
    }

    // Exam time
    const takeHomeSel = takeHome ? examLength : 0;

    // Other assignments
    const otherSel = otherEngage ? 0 : otherAssign * otherHours;

    // Total workload
    const totalWorkload =
      weeklyPages / pagesPerHourSel +
      (hoursPerWritingSel * semesterPages) / classWeeks +
      (exams * examHours) / classWeeks +
      otherSel / classWeeks +
      postHoursSel +
      weeklyVideos +
      (takeHomeSel / 60) * exams / classWeeks +
      syncSessions * syncLength;

    res.json({ totalWorkload: totalWorkload.toFixed(2) });
  } catch (error) {
    console.error("Error calculating workload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;