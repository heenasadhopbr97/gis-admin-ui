import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
  standalone: false
})
export class BuildingComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() featureData: any;
  form: FormGroup;
  isLoading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      homePasses: ['', [Validators.pattern(/^[0-9]*$/)]],
      floors: ['', [Validators.pattern(/^[0-9]*$/)]],
      blocks: ['', [Validators.pattern(/^[0-9]*$/)]],
      buildingType: ['', Validators.required],
      tenancy: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      streetName: [''] ,
      fatNo: [''],
      fdtNo: [''] ,
      opticalLevel: [''],
      remarks: [''],
      photo1: [''],
      photo2: [''],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null]
    });
  }

  ngOnInit() {
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
    }
  }

  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1]
    });
    this.form.get('longitude')?.markAsTouched();
    this.form.get('latitude')?.markAsTouched();
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('Please fill all required fields', 'Validation Error');
      return;
    }

    // Additional validation for surveyAreaId
    if (!this.form.value.surveyAreaId) {
      this.toastr.error('Please select a survey area first', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const formData = this.form.value;
    const publicId = this.featureData?.publicId;

    // if (!publicId) {
    this.apiService.createBuilding(formData).subscribe({
      next: (response: any) => {
        this.toastr.success(response?.message || 'Building created successfully', 'Success');
        this.form.reset();
        this.formSubmit.emit(response.data);
        this.closeForm.emit();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(
          error.error?.message ||
          error.message ||
          'Failed to create building',
          'Error'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    // }
  }
  patchFormWithData(data: any): void {
    this.form.patchValue({
      name: data.name,
      address: data.address,
      homePasses: data.homePasses,
      floors: data.floors,
      blocks: data.blocks,
      buildingType: data.buildingType,
      tenancy: data.tenancy,
      category: data.category,
      status: data.status,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      userId: this.apiService.getUserId(),
      mvnoId: data.mvnoId || 1
    });
  }

  setSurveyAreaId(id: number): void {
    this.form.patchValue({
      surveyAreaId: id
    });
    this.form.get('surveyAreaId')?.markAsTouched();
  }
  clearSurveyArea(): void {
    this.form.patchValue({
      surveyAreaId: null
    });

    // Notify parent component to deselect the survey area
    if (this.featureData?.surveyAreaId) {
      // If editing, you might want to handle this differently
    }
  }

  numericOnly(event: KeyboardEvent): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  // Allow numbers (0-9) and backspace (8)
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 8) {
    event.preventDefault();
    return false;
  }
  return true;
}
}