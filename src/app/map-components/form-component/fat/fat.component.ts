
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from 'maplibre-gl';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-fat',
  templateUrl: './fat.component.html',
  styleUrl: './fat.component.css',
  standalone: false
})
export class FatComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() fatCreated = new EventEmitter<number>();
  @Output() coordinatesChange = new EventEmitter<[number, number]>();
  @Input() featureData: any;
  form: FormGroup;
  isLoading = false;
  @Input() isEditMode: boolean = false;
  surveyError: string | null = null;
  surveyStageName: string | null = null;

  @Input() surveyAreaGeometry: any;
  @Input() showHeader: boolean = true;
  surveyAreas: any[] = [];

  //accessory api parameter
  accessoryError: string | null = null;
  specificationParametersDTOList: any[] = []
  accessoriesOptions: { id: number, name: string }[] = [];

  accessoryCategoryList: string[] = [];
  accessoryValueMap: { [key: string]: string[] } = {};
  Validators = Validators;
  selectedAccessoryValues: string[] = [];
  selectedAccessoryCategoryId: number | null = null;
  selectedAccessoryCategoryName: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', Validators.required],
      address: [''],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      // parentNeType: ['Handhold', Validators.required],
      userId: this.apiService.getUserId(),
      // parentNeId: [1,],
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      powerLevels: [null],
      remarks: [''],
      inventoryList: this.fb.array([]),
      photo1: [''],
      photo2: [''],
    });
    // this.form.addControl('inventoryList', this.fb.array([]))
  }

  emitCoordinates() {
    const coords: [number, number] = [
      this.form.get('longitude')?.value,
      this.form.get('latitude')?.value
    ];
    if (coords[0] && coords[1]) {
      this.coordinatesChange.emit(coords);
    }
  }

  ngOnInit() {
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
      this.emitCoordinates();
    }

    // this.loadAccessoieslist();
    this.loadSurveyAreas();

    // Add default accessoryDetail row if empty
    // if (this.inventoryList.length === 0) {
    //   this.addAccessoryDetail();
    // }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['featureData'] && this.featureData && this.isEditMode) {
      this.patchFormWithData(this.featureData);
    }
  }

  // new group for single accessory row
accessoryForm = this.fb.group({
  paramName: ['', Validators.required],
  paramValue: ['', Validators.required],
  quantity: ['', Validators.required]
});

singleAccessoryValues: string[] = [];

onSingleAccessoryFieldChanged(): void {
  const selected = this.accessoryForm.get('paramName')?.value;
  this.accessoryForm.get('paramValue')?.setValue('');
  this.singleAccessoryValues = selected ? (this.accessoryValueMap[selected] || []) : [];
}

addAccessoryToList(): void {
  if (this.accessoryForm.invalid) return;  // won't run if empty

  this.inventoryList.push(
    this.fb.group({
      paramName: [this.accessoryForm.get('paramName')?.value],
      paramValue: [this.accessoryForm.get('paramValue')?.value],
      quantity: [this.accessoryForm.get('quantity')?.value]
    })
  );

  this.accessoryForm.reset();
  this.singleAccessoryValues = [];
}




  shouldShowAccessoryFields(): boolean {
    return this.surveyStageName === 'Design';
  }


  get inventoryList(): FormArray {
    return this.form.get('inventoryList') as FormArray;
  }


  removeAccessoryDetail(index: number): void {
    this.inventoryList.removeAt(index);
  }


  shouldShowField(field: any): boolean {
    // Find potential parent (a field whose paramMultiValues include this field.paramName)
    const parent = this.specificationParametersDTOList.find(f =>
      f.isMultiValueParam &&
      f.paramMultiValues?.includes(field.paramName) &&
      !f.isAccessories
    );

    if (!parent) {
      return true; // No parent — always show
    }

    const parentValue = this.form.get(parent.paramName)?.value;
    return parentValue === field.paramName;
  }

  onAccessoryCategoryChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.selectedAccessoryCategoryId = selectedId;

    const selectedOption = this.accessoriesOptions.find(opt => opt.id === selectedId);
    if (!selectedOption) {
      this.selectedAccessoryValues = [];
      this.selectedAccessoryCategoryName = null;
      return;
    }

    const categoryName = selectedOption.name;
    this.selectedAccessoryCategoryName = categoryName;
    this.selectedAccessoryValues = this.accessoryValueMap[categoryName] || [];
  }



  loadAccessoieslist() {
    const name = 'fat';
    this.apiService.getProductCategoryByName(name).subscribe({
      next: (res: any) => {
        const allFields = res?.data?.specificationParametersDTOList || [];
        this.specificationParametersDTOList = allFields;

        for (const field of allFields) {
          if (field.isAccessories) continue; // skip accessories here
          const control = this.fb.control(
            field.defaultValue || '',
            field.isMandatory ? Validators.required : []
          );
          this.form.addControl(field.paramName, control);

          if (field.paramName === 'Type' && field.isMultiValueParam && field.paramMultiValues?.[1]) {
            this.form.patchValue({ ['Type']: field.paramMultiValues[1] });
          }
        }

        // Only accessory field names
        const accessories = allFields.filter((f: any) => f.isAccessories);
        this.accessoryCategoryList = accessories.map((acc: any) => acc.paramName);

        this.accessoryValueMap = {};
        for (const acc of accessories) {
          this.accessoryValueMap[acc.paramName] = acc.paramMultiValues || [];
        }
      },
      error: () => {
        this.accessoryError = 'Failed to load specification data';
        // this.toastr.error('Failed to load specifications', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


setSurveyAreaId(surveyAreaId: number): void {
  this.form.patchValue({ surveyAreaId });

  //  Lookup survey stage name right away
  const matchedSurvey = this.surveyAreas.find(s => s.id === surveyAreaId);
  if (matchedSurvey) {
    this.surveyStageName = matchedSurvey.surveyStageName;

        //  Load accessories only for Design stage
    if (this.surveyStageName === 'Design') {
      this.loadAccessoieslist();
    } else {
      this.specificationParametersDTOList = [];   // clear fields
      this.accessoryCategoryList = [];            // clear accessories
      this.accessoryValueMap = {};
    }
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

              //  Only load accessories if stage is Design
            if (this.surveyStageName === 'Design') {
              this.loadAccessoieslist();
            }
          }
        }
        }
      },
      error: (err) => {
        console.error('Failed to load survey areas', err);
      }
    });
  }


  // Update coordinates method
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
  const rawForm = this.form.getRawValue();
  const formData: any = { ...rawForm };

  const inventoryList: any[] = [];

    // Handle non-accessory fields (including dependent like 'Type' and its children)
  for (const field of this.specificationParametersDTOList) {
    if (field.isAccessories) continue;

    const control = this.form.get(field.paramName);
    if (!control) continue;

    const paramValue = control.value;
    if (paramValue) {
      // 💡 Find parent paramId
      let parentParamId = null;
      const parent = this.specificationParametersDTOList.find(p =>
        p.isMultiValueParam &&
        p.paramMultiValues?.includes(field.paramName) &&
        !p.isAccessories
      );
      if (parent) {
        parentParamId = parent.id;
      }

      inventoryList.push({
        parentParamId,
        paramId: field.id,
        paramName: field.paramName,
        paramValue: paramValue?.trim?.(),
        isMandatory: field.isMandatory,
        isAccessory: false,
        isMainAccessory: field.isMainAccessories || false,
        quantity: field.isMainAccessories ? 1 : null
      });
    }
  }


  // Handle accessories
  for (const control of this.inventoryList.controls) {
    const fg = control as FormGroup;
    const paramName = fg.get('paramName')?.value;
    const paramValue = fg.get('paramValue')?.value;
    const quantity = fg.get('quantity')?.value;

    if (!paramName || !paramValue || !quantity) continue;

    const accField = this.specificationParametersDTOList.find(
      f => f.isAccessories && f.paramName === paramName
    );

    if (accField) {
      const typeField = this.specificationParametersDTOList.find(f => f.paramName === 'Type');
      const parentParamId = typeField ? typeField.id : null;

      inventoryList.push({
        paramId: accField.id,
        paramName: accField.paramName,
        paramValue,
        parentParamId,
        isAccessory: true,
        isMandatory: accField.isMandatory,
        isMainAccessory: accField.isMainAccessories || false,
        quantity
      });
    }

  }

    // Strip dynamic form controls before sending
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

  // Remove image file names (they're handled as binary)
  delete formData.photo1;
  delete formData.photo2;

  // Prepare image files
  const photo1Input = document.getElementById('photo1') as HTMLInputElement;
  const photo2Input = document.getElementById('photo2') as HTMLInputElement;
  const images: File[] = [];
  if (photo1Input?.files?.length) images.push(photo1Input.files[0]);
  if (photo2Input?.files?.length) images.push(photo2Input.files[0]);

  // Prepare FormData for new API
  const multipartFormData = new FormData();
  multipartFormData.append('fatDto', JSON.stringify(formData));
  images.forEach((img) => multipartFormData.append('images', img));

  // Use new API for create
  let apiCall$;
  if (this.isEditMode && this.featureData?.publicId) {
    // If you have an updateWithImage API for FAT, use it here
    // apiCall$ = this.apiService.updateFatWithImg(this.featureData.publicId, multipartFormData);
    apiCall$ = this.apiService.updateFat(this.featureData.publicId, formData); // fallback to old
  } else {
    apiCall$ = this.apiService.createFatWithImg(multipartFormData);
  }

  apiCall$.subscribe({
    next: (response: any) => {
      const action = this.isEditMode ? 'updated' : 'created';
      this.toastr.success(response?.message || `FAT ${action} successfully`, 'Success');
      this.form.reset();
      this.fatCreated.emit(response?.data?.id);
      this.closeForm.emit();
    },
    error: (error: any) => {
      console.error(error, `Error ${this.isEditMode ? 'updating' : 'creating'} FAT`);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  patchFormWithData(data: any): void {
    this.form.patchValue({
      name: data.name,
      capacity: data.capacity,
      status: data.status,
      address: data.address,
      parentNeType: data.parentNeType,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      remarks: data.remarks || '',
      powerLevels: data.powerLevels || null,
      parentNeId: data.parentNeId || 1,
      surveyAreaId: data.surveyAreaId || null,
      userId: data.userId || 1,
      mvnoId: data.mvnoId || 1
    });

    // Patch inventoryList FormArray
    const inventoryArray = this.form.get('inventoryList') as FormArray;
    inventoryArray.clear(); // Remove existing

    if (Array.isArray(data.inventoryList)) {
      data.inventoryList.forEach((item: any) => {
        inventoryArray.push(this.fb.group({
          paramName: [item.paramName || ''],
          paramValue: [item.paramValue || ''],
          quantity: [item.quantity || '']
        }));
      });
    }
  }

}
