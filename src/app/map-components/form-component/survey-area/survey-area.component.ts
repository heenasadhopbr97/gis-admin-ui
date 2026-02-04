import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-survey-area',
  standalone: false,
  templateUrl: './survey-area.component.html',
  styleUrl: './survey-area.component.css'
})
export class SurveyAreaComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  form: FormGroup;
  isLoading = false;
  surveyError: string | null = null;
  surveyStatus: any[] = [];
  @Input() isEditMode: boolean = false;
  @Input() publicIdToEdit: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      surveyStatusId: [null],
      geom: [null],
      surveyStartDate: [null],
      surveyEndDate: [null],
      isActive: [null,Validators.required],
      userId: this.apiService.getUserId(),
      mvnoId:  this.apiService.getMvnoId()
    });
  }

  ngOnInit() {
    this.loadSurveyStatus();
  }

  loadSurveyStatus() {
    this.isLoading = true;
    this.surveyError = null;

    this.apiService.getsurveyStatus().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.surveyStatus = response.data;
          if (this.surveyStatus.length > 0) {
            this.form.patchValue({
              surveyStatusId: this.surveyStatus[0].id
            });
          }
        }
      },
      error: (error) => {
        this.surveyError = 'Failed to load survey status';
        this.toastr.error('Failed to load survey status', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateCoordinates(coords: number[][][]) {
    this.form.patchValue({
      geom: {
        type: 'Polygon',
        coordinates: coords
      }
    });
    this.form.get('geom')?.markAsTouched();
  }

  onSubmit() {
  this.form.markAllAsTouched();

  if (this.form.invalid) {
    this.toastr.error('Please fill all required fields', 'Validation Error');
    return;
  }

  this.isLoading = true;
  const formData = this.form.value;

  const apiCall = this.isEditMode && this.publicIdToEdit
    ? this.apiService.updateSurveyArea(this.publicIdToEdit, formData)
    : this.apiService.createSurveyArea(formData);

  apiCall.subscribe({
    next: (response: any) => {
      this.toastr.success(
        response.message || (this.isEditMode ? 'Survey area updated successfully' : 'Survey area created successfully'),
        'Success'
      );
      this.form.reset();
      this.loadSurveyAreas();
      this.formSubmit.emit(response.data);
      this.closeForm.emit();
    },
    error: (error: any) => {
      this.toastr.error(
        error.error?.message || error.message || 'Operation failed',
        'Error'
      );
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

loadSurveyAreas(): void {
    const userId = this.apiService.getUserId();
  const mvnoId = this.apiService.getMvnoId();
   this.apiService.getsurveyArea(userId,mvnoId).subscribe({
    next: (response: any) => {
      },
      error: (error:any) => {
        console.error('Error loading survey data:', error);
      }
  });
  }


  ngOnDestroy(): void {
    this.form.reset();
    this.closeForm.emit();
    // if (this.map) {
    //   this.map.setTarget(undefined);
    // }
    // if (this.mapLibre) {
    //   this.mapLibre.remove();
    // }
  }
  
}