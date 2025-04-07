import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkloadService {
  private apiUrl = 'http://localhost:3000/api/workload'; // Backend API URL

  constructor(private http: HttpClient) {}

  calculateWorkload(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate`, data).pipe(
      catchError((error) => {
        console.error('Error in WorkloadService:', error);
        return throwError(() => new Error('Failed to calculate workload'));
      })
    );
  }
}
