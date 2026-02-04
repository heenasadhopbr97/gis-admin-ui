import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-fdt',
  templateUrl: './fdt.component.html',
  styleUrl: './fdt.component.css',
  standalone: false
})
export class FdtComponent {

  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() fdtCreated = new EventEmitter<void>();
  @Input() featureData: any;
  @Input() surveyAreaGeometry: any;

  form: FormGroup;
  accessoryForm: FormGroup;
  inventoryList: FormArray = this.fb.array([]);
  specificationParametersDTOList: any[] = [];
  accessoryCategoryList: string[] = [];
  singleAccessoryValues: string[] = [];

  isLoading = false;
  isEditMode = false;
  surveyError: string | null = null;

  surveyStageName: string | null = null;
  
  surveyAreas: any[] = [];
  Validators = Validators;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      parentNeType: [''],
      userId: this.apiService.getUserId(),
      parentNeId: [1,],
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
    });

    this.accessoryForm = this.fb.group({
      paramName: ['', Validators.required],
      paramValue: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
    } 
    this.loadAccessoieslist();
    this.loadSurveyAreas();
  }

  loadAccessoieslist() {
    const name = 'fdt';
    this.apiService.getProductCategoryByName(name).subscribe({
      next: (res: any) => {
        this.specificationParametersDTOList = res?.data?.specificationParametersDTOList || [];

        // add form controls for non-accessories
        this.specificationParametersDTOList
          .filter(f => !f.isAccessories)
          .forEach(field => {
            this.form.addControl(
              field.paramName,
              this.fb.control(field.defaultValue || '', field.isMandatory ? Validators.required : [])
            );

              if (
      field.paramName === 'Type' &&
      field.isMultiValueParam &&
      field.paramMultiValues?.[0] && // Use first value as default
      !this.isEditMode
    ) {
      this.form.patchValue({ ['Type']: field.paramMultiValues[0] });
    }
            
          });

          

        // accessory category dropdown
        this.accessoryCategoryList = this.specificationParametersDTOList
          .filter(f => f.isAccessories)
          .map(f => f.paramName);
      },
      error: () => {
        this.toastr.error('Failed to load FDT specs', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  shouldShowField(field: any): boolean {
  // Find the parent (e.g. "Type" contains "AERIAL"/"UNDERGROUND")
  const parent = this.specificationParametersDTOList.find(f =>
    f.isMultiValueParam &&
    f.paramMultiValues?.includes(field.paramName) &&
    !f.isAccessories
  );

  if (!parent) {
    return true; // no parent, always show (like "Type")
  }

  const parentValue = this.form.get(parent.paramName)?.value;
  return parentValue === field.paramName;
}


  // accessories handlers
  onSingleAccessoryFieldChanged() {
    const selectedCategory = this.accessoryForm.get('paramName')?.value;
    const field = this.specificationParametersDTOList.find(f => f.paramName === selectedCategory);
    this.singleAccessoryValues = field?.paramMultiValues || [];
    this.accessoryForm.patchValue({ paramValue: '' });
  }

  shouldShowAccessoryFields(): boolean {
    return this.surveyStageName === 'Design';
  }

  addAccessoryToList() {
    if (this.accessoryForm.invalid) return;
    this.inventoryList.push(this.fb.group(this.accessoryForm.value));
    this.accessoryForm.reset({ quantity: 1 });
  }

  removeAccessoryDetail(index: number) {
    this.inventoryList.removeAt(index);
  }

setSurveyAreaId(surveyAreaId: number): void {
  this.form.patchValue({ surveyAreaId });

  //  Lookup survey stage name right away
  const matchedSurvey = this.surveyAreas.find(s => s.id === surveyAreaId);
  if (matchedSurvey) {
    this.surveyStageName = matchedSurvey.surveyStageName;
  }
}

  loadSurveyAreas(): void {
    const userId = this.apiService.getUserId();
    const mvnoId = this.apiService.getMvnoId();

    this.apiService.getsurveyArea(userId, mvnoId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.surveyAreas = res.data;

        //  Always set surveyStageName for current surveyAreaId
        if (this.form.value.surveyAreaId) {
          const matchedSurvey = this.surveyAreas.find(s => s.id === this.form.value.surveyAreaId);
          if (matchedSurvey) {
            this.surveyStageName = matchedSurvey.surveyStageName;
          }
        }

        }
      },
    error: (err) => {
      console.error('Failed to load survey areas', err);
      }
    });
  }

  updateCoordinates(coords: [number, number]): void {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1]
    });
  }

  onCancel(): void {
    this.form.reset();
    this.closeForm.emit();
  }
onSubmit() {
  this.form.markAllAsTouched();
  if (this.form.invalid) {
    this.toastr.error('Please fill all required fields', 'Validation Error');
    return;
  }

  this.isLoading = true;

  // Clone all raw form values first
  const rawForm = this.form.getRawValue();
  const formData: any = { ...rawForm };

  const inventoryList: any[] = [];

  // Non-accessories

  for (const field of this.specificationParametersDTOList) {
    if (field.isAccessories) continue;

    const control = this.form.get(field.paramName);
    if (!control) continue;

    const value = control.value;
    if (value) {
      const parent = this.specificationParametersDTOList.find(p =>
        p.isMultiValueParam &&
        p.paramMultiValues?.includes(field.paramName) &&
        !p.isAccessories
      );

      inventoryList.push({
        parentParamId: parent ? parent.id : null,
        paramId: field.id,
        paramName: field.paramName,
        paramValue: value,
        isAccessory: false,
        isMandatory: field.isMandatory,
        isConfiguration: field.isConfiguration || false,
        quantity: null // ❌ not required for non-accessories
      });
    }
  }

  // Accessories
  this.inventoryList.controls.forEach((ctrl: any) => {
    const category = ctrl.get('paramName')?.value;
    const value = ctrl.get('paramValue')?.value;
    const qty = +(ctrl.get('quantity')?.value);
    if (!category || !value || !qty) return;

    const accField = this.specificationParametersDTOList.find(
      f => f.isAccessories && f.paramName === category
    );

    if (accField) {
      inventoryList.push({
        parentParamId: null,
        paramId: accField.id,
        paramName: accField.paramName,
        paramValue: value,
        isAccessory: true,
        isMandatory: accField.isMandatory,
        isConfiguration: accField.isConfiguration,
        quantity: qty
      });
    }
  });

  // remove spec fields from formData
  for (const field of this.specificationParametersDTOList) {
    if (formData.hasOwnProperty(field.paramName)) {
      delete formData[field.paramName];
    }
  }

  formData.inventoryList = inventoryList;

    const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
        if (selectedSurvey) {
          formData.status = selectedSurvey.surveyStatusName; //  Send status string
        } else {
          this.toastr.error('Survey area status not Exist.');
          console.warn('Survey area not matched. Defaulting status to Planned');
    }

  // API call
  const apiCall = this.isEditMode && this.featureData?.publicId
    ? this.apiService.updateFdt(this.featureData.publicId, formData)
    : this.apiService.createFdt(formData);

  apiCall.subscribe({
    next: (res: any) => {
      this.toastr.success(res?.message || 'FDT saved successfully', 'Success');
      this.form.reset();
      this.inventoryList.clear();
      this.fdtCreated.emit(res?.data?.id);
      this.closeForm.emit();
    },
    error: (err: any) => {
      console.error(err);
      this.toastr.error('Failed to save FDT', 'Error');
    },
    complete: () => (this.isLoading = false)
  });
}


  patchFormWithData(data: any): void {
    this.form.patchValue({
      name: data.name,
      status: data.status,
      parentNeType: data.parentNeType,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      remarks: data.remarks || '',
      parentNeId: data.parentNeId || 1,
      surveyAreaId: data.surveyAreaId || null,
      userId: data.userId || 1,
      mvnoId: data.mvnoId || 1
    });

    // patch accessories if editing
    if (data.inventoryList?.length) {
      data.inventoryList.forEach((acc: any) => {
        this.inventoryList.push(
          this.fb.group({
            paramName: acc.paramName,
            paramValue: acc.paramValue,
            quantity: acc.quantity
          })
        );
      });
    }
  }
}
