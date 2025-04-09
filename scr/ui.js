import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Button,
  Grid,
  Checkbox,
} from "@mui/material";
import axios from "axios";

const UI = () => {
  // State variables for user inputs
  const [classWeeks, setClassWeeks] = useState(15);
  const [weeklyPages, setWeeklyPages] = useState(0);
  const [readingDensity, setReadingDensity] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [readingPurpose, setReadingPurpose] = useState(1);
  const [setReadingRate, setSetReadingRate] = useState(false);
  const [overridePagesPerHour, setOverridePagesPerHour] = useState(10);
  const [semesterPages, setSemesterPages] = useState(0);
  const [writtenDensity, setWrittenDensity] = useState(1);
  const [writingPurpose, setWritingPurpose] = useState(1);
  const [draftRevise, setDraftRevise] = useState(1);
  const [setWritingRate, setSetWritingRate] = useState(false);
  const [overrideHoursPerWriting, setOverrideHoursPerWriting] = useState(0.5);
  const [weeklyVideos, setWeeklyVideos] = useState(0);
  const [postsPerWeek, setPostsPerWeek] = useState(0);
  const [postFormat, setPostFormat] = useState(1);
  const [postLengthText, setPostLengthText] = useState(250);
  const [postLengthAV, setPostLengthAV] = useState(3);
  const [setDiscussion, setSetDiscussion] = useState(false);
  const [overrideDiscussion, setOverrideDiscussion] = useState(1);
  const [exams, setExams] = useState(0);
  const [examHours, setExamHours] = useState(5);
  const [takeHome, setTakeHome] = useState(false);
  const [examLength, setExamLength] = useState(60);
  const [otherAssign, setOtherAssign] = useState(0);
  const [otherHours, setOtherHours] = useState(0);
  const [otherEngage, setOtherEngage] = useState(false);
  const [syncSessions, setSyncSessions] = useState(0);
  const [syncLength, setSyncLength] = useState(0);

  // State for results
  const [results, setResults] = useState(null);

  // Handle form submission
  const handleSubmit = async () => {
    const inputData = {
      classWeeks,
      weeklyPages,
      readingDensity,
      difficulty,
      readingPurpose,
      setReadingRate,
      overridePagesPerHour,
      semesterPages,
      writtenDensity,
      writingPurpose,
      draftRevise,
      setWritingRate,
      overrideHoursPerWriting,
      weeklyVideos,
      postsPerWeek,
      postFormat,
      postLengthText,
      postLengthAV,
      setDiscussion,
      overrideDiscussion,
      exams,
      examHours,
      takeHome,
      examLength,
      otherAssign,
      otherHours,
      otherEngage,
      syncSessions,
      syncLength,
    };

    try {
      const response = await axios.post("http://localhost:3000/calculate", inputData);
      setResults(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while calculating the workload. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 960, margin: "auto", padding: 2 }}>
      <Typography variant="h3" align="center">
        Enhanced Course Workload Estimator
      </Typography>
      <hr />

      <Grid container spacing={2}>
        {/* Column 1: Course Info and Reading Assignments */}
        <Grid item xs={12} md={3}>
          <Typography variant="h5" align="center">
            COURSE INFO
          </Typography>
          <Box>
            <TextField
              fullWidth
              label="Class Duration (Weeks)"
              type="number"
              value={classWeeks}
              onChange={(e) => setClassWeeks(Number(e.target.value))}
            />
          </Box>

          <Typography variant="h5" align="center" sx={{ marginTop: 2 }}>
            READING ASSIGNMENTS
          </Typography>
          <Box>
            <TextField
              fullWidth
              label="Pages Per Week"
              type="number"
              value={weeklyPages}
              onChange={(e) => setWeeklyPages(Number(e.target.value))}
            />
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Page Density</InputLabel>
              <Select
                value={readingDensity}
                onChange={(e) => setReadingDensity(Number(e.target.value))}
              >
                <MenuItem value={1}>450 Words</MenuItem>
                <MenuItem value={2}>600 Words</MenuItem>
                <MenuItem value={3}>750 Words</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={setReadingRate}
                  onChange={(e) => setSetReadingRate(e.target.checked)}
                  name="setReadingRate"
                />
              }
              label="Override Reading Rate"
            />
            {setReadingRate && (
              <TextField
                fullWidth
                label="Pages Per Hour"
                type="number"
                value={overridePagesPerHour}
                onChange={(e) => setOverridePagesPerHour(Number(e.target.value))}
                sx={{ marginTop: 2 }}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleSubmit}
      >
        Calculate Workload
      </Button>

      {results && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5">Results:</Typography>
          <Typography>Total Workload: {results.totalWorkload}</Typography>
          <Typography>Independent Workload: {results.independentWorkload}</Typography>
          <Typography>Engagement Time: {results.engagementTime}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UI;