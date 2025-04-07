import { Component } from '@angular/core';
import { WorkloadService } from '../services/workload.service';

interface InputData {
  weeklyPages: number;
  classWeeks: number;
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
  semesterPages: number;
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'workload-estimator';
  workloadResult: string = '';
  inputData: InputData = {
    weeklyPages: 50,
    classWeeks: 15,
    setReadingRate: false,
    overridePagesPerHour: 0,
    difficulty: 'Some New Concepts',
    readingPurpose: 'Understand',
    readingDensity: '600 Words',
    setWritingRate: false,
    overrideHoursPerWriting: 0,
    writtenDensity: '500 Words',
    draftRevise: 'Minimal Drafting',
    writingPurpose: 'Argument',
    semesterPages: 10,
    exams: 2,
    examHours: 3,
    otherAssign: 1,
    otherHours: 2,
    syncSessions: 1,
    syncLength: 1.5,
    postFormat: 1,
    postLengthText: 500,
    postLengthAV: 0,
    postsPerWeek: 1,
    setDiscussion: false,
    overrideDiscussion: 0,
    takeHome: false,
    examLength: 0,
    weeklyVideos: 2,
    otherEngage: false,
  };

  constructor(private workloadService: WorkloadService) {}

  calculateWorkload() {
    this.workloadService.calculateWorkload(this.inputData).subscribe(
      (response: { totalWorkload: number }) => {
      this.workloadResult = `Total Workload: ${response.totalWorkload} hrs/week`;
      },
      (error: any) => {
      console.error('Error calculating workload:', error);
      }
    );
  }
}
