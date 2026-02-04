import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../RadiusUtils/CommonConstant';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  userId  = localStorage.getItem('userId')

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.status === 400) {
        errorMessage = 'Bad Request: Please check your input data';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal Server Error';
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  constructor(private http: HttpClient) { }

  // surveyArea update
  updateSurveyArea(publicId: string, data: any) {
    return this.http.put(`${API_ENDPOINTS.BASE_API_URL}/${API_ENDPOINTS.SURVEY_AREA}/update/${publicId }`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // surveyArea update
  getSurveyAreaByPublicId(publicId: string) {
    return this.http.get(`${API_ENDPOINTS.BASE_API_URL}/${API_ENDPOINTS.SURVEY_AREA}/getById/${publicId }`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
