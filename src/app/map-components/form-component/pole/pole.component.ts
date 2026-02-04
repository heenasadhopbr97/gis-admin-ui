import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validate } from 'maplibre-gl';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-pole',
  templateUrl: './pole.component.html',
  styleUrls: ['./pole.component.css'],
  standalone: false
})
export class PoleComponent {

  @Input() poleSizeType!: '8m poles' | '10m poles' | '12m poles';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() poleCreated = new EventEmitter<void>();
  @Input() featureData: any;
  @Input() publicIdToEdit: string = '';
  surveyAreas: any[] = [];
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  
  surveyStageName: string | null = null;
  surveyError: string | null = null;

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

  

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      heightM: [''],
      // material: ['Wood', Validators.required],
      // poleType: ['Straight', Validators.required],
      // ownership: ['Private', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      // adss:[''],
      // upb: [''],
      // jHook:[''],
      // anchor:[''],
      // cable:[''],
      // slack:[''],
      // jb:[''],
      // fat: [''],
      // guyGrip: [''],
      remarks: [''],
      inventoryList: this.fb.array([]),
      photo1: [''],
      photo2: [''],
      photo3: [''],
    });
    // this.form.addControl('inventoryList', this.fb.array([]));
    
  }

  ngOnInit() {
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
    }
    
    // this.loadAccessoieslist(); 
    this.loadSurveyAreas();

      // Add default accessoryDetail row if empty
    // if (this.inventoryList.length === 0) {
    //   this.addAccessoryDetail();
    // }
  }

  shouldShowAccessoryFields(): boolean {
    return this.surveyStageName === 'Design';
  }


  getPoleIconPath(): string {
  switch (this.poleSizeType) {
    case '8m poles':
      return 'assets/icons/8m.svg';
    case '10m poles':
      return 'assets/icons/10m.svg';
    case '12m poles':
      return 'assets/icons/12m.svg';
    default:
      return 'assets/pole.svg'; // fallback
  }
}

getPoleTitle(): string {
  switch (this.poleSizeType) {
    case '8m poles':
      return '8m Poles';
    case '10m poles':
      return '10m Poles';
    case '12m poles':
      return '12m Poles';
    default:
      return 'Pole Details';
  }
}

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
  if (this.accessoryForm.invalid) return;

  this.inventoryList.push(
    this.fb.group({
      paramName: [this.accessoryForm.get('paramName')?.value],
      paramValue: [this.accessoryForm.get('paramValue')?.value],
      quantity: [this.accessoryForm.get('quantity')?.value],
    })
  );

  this.accessoryForm.reset();
  this.singleAccessoryValues = [];
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



loadAccessoieslist() {
  // const name = this.poleSizeType;
  const nameMap: Record<string, string> = {
  '8m poles': '8m-poles',
  '10m poles': '10m-poles',
  '12m poles': '12m-poles'
};
const name = nameMap[this.poleSizeType] || this.poleSizeType;
  this.apiService.getProductCategoryByName(name).subscribe({
    next: (res: any) => {
      const allFields = res?.data?.specificationParametersDTOList || [];
      this.specificationParametersDTOList = allFields;

      for (const field of allFields) {
        if (field.isAccessories) continue; // accessories handled separately
        const control = this.fb.control(
          field.defaultValue || '',
          field.isMandatory ? Validators.required : []
        );
        this.form.addControl(field.paramName, control);

        if (field.paramName === 'Type' && field.isMultiValueParam && field.paramMultiValues?.[1]) {
            // Patch default value = 2nd option (index 1)
            this.form.patchValue({ ['Type']: field.paramMultiValues[1] });
        }
      }

      // Store accessories separately
      const accessories = allFields.filter((f: any) => f.isAccessories && f.paramMultiValues?.length);
      for (const acc of accessories) {
        this.accessoryValueMap[acc.paramName] = acc.paramMultiValues;
        this.accessoryCategoryList.push(acc.paramName);
      }

      // Prepare category dropdown options with id
      // this.accessoriesOptions = this.accessoryCategoryList.map((name, index) => ({
      //   id: index + 1,
      //   name
      // }));
    },
    error: (err) => {
      this.accessoryError = 'Failed to load specification data';
      // this.toastr.error('Failed to load specifications', 'Error');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}


  

  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1]
    });
    this.form.get('longitude')?.markAsTouched();
    this.form.get('latitude')?.markAsTouched();
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

  onCancel(): void {
    this.form.reset();
    this.closeForm.emit();
  }

onSubmit() {
  this.form.markAllAsTouched();

  if (this.form.invalid) {
    this.toastr.error('Please fill all required fields correctly', 'Validation Error');
    return;
  }

  this.isLoading = true;
  const rawForm = this.form.getRawValue();

  const formData: any = { ...rawForm };

  const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
  if (selectedSurvey) {
    formData.status = selectedSurvey.surveyStatusName; //  Send status string
  } else {
    this.toastr.error('Survey area status not Exist.');
    console.warn('Survey area not matched. Defaulting status to Planned');
  }

  const inventoryList: any[] = [];

  // Add dynamic specification fields (non-accessories)
  for (const field of this.specificationParametersDTOList) {
    if (field.isAccessories) continue;

    const control = this.form.get(field.paramName);
    if (!control) continue;

    const parent = this.specificationParametersDTOList.find(p =>
      p.isMultiValueParam &&
      p.paramMultiValues?.includes(field.paramName) &&
      !p.isAccessories
    );

    const paramValue = control.value;

    if (paramValue) {
      const parentParamId = field.pcid ?? (parent ? parent.id : null);

      inventoryList.push({
        parentParamId,
        paramId: field.id,
        paramName: field.paramName,
        paramValue: paramValue?.trim?.(), // Avoid typos/spaces
        isMandatory: field.isMandatory,
        isAccessory: false,
        quantity: null
      });
    }
  }

  // Add accessories to inventoryList
  this.inventoryList.controls.forEach((group) => {
    const fg = group as FormGroup;
    const categoryName = fg.get('paramName')?.value;
    const paramValue = fg.get('paramValue')?.value;
    const quantity = +fg.get('quantity')?.value;

    if (!categoryName || !paramValue || !quantity) return;

    const accField = this.specificationParametersDTOList.find(f =>
      f.isAccessories && f.paramName === categoryName
    );

    if (accField) {
      const parentParamId: any = null;

      inventoryList.push({
        parentParamId,
        paramId: accField.id,
        paramName: accField.paramName,
        paramValue,
        isMandatory: accField.isMandatory,
        isAccessory: true,
        quantity
      });
    }

  });

    // Remove all dynamic form controls (like 'Type', 'OWN POLES', etc.)
  for (const field of this.specificationParametersDTOList) {
    if (formData.hasOwnProperty(field.paramName)) {
      delete formData[field.paramName];
    }
  }

  //  Replace inventoryList with the correctly structured one
  formData.inventoryList = inventoryList;

  // Normalize pole size
  formData.poleSizeType =
    this.poleSizeType === '8m poles' ? '8m' :
    this.poleSizeType === '10m poles' ? '10m' :
    this.poleSizeType === '12m poles' ? '12m' : '';

  // Remove image file names (they're handled as binary)
  delete formData.photo1;
  delete formData.photo2;
  delete formData.photo3;

  // Prepare image files
  const photo1Input = document.getElementById('photo1') as HTMLInputElement;
  const photo2Input = document.getElementById('photo2') as HTMLInputElement;
  const photo3Input = document.getElementById('photo3') as HTMLInputElement;

  const images: File[] = [];
  if (photo1Input?.files?.length) images.push(photo1Input.files[0]);
  if (photo2Input?.files?.length) images.push(photo2Input.files[0]);
  if (photo3Input?.files?.length) images.push(photo3Input.files[0]);

  // Prepare FormData for new API
  const multipartFormData = new FormData();
  multipartFormData.append('poleDto', JSON.stringify(formData));
  images.forEach((img) => multipartFormData.append('images', img));

  // Use new API for create
  let apiCall$;
    if (this.isEditMode && this.publicIdToEdit) {
      // Use JSON update API (no images)
      apiCall$ = this.apiService.updatePole(this.publicIdToEdit, formData);
    } else {
      apiCall$ = this.apiService.createPoleWithImg(multipartFormData);
    }

  apiCall$.subscribe({
    next: (response: any) => {
      const action = this.isEditMode ? 'updated' : 'created';
      this.toastr.success(response?.message || `Pole ${action} successfully`, 'Success');
      this.form.reset();
      this.poleCreated.emit();
      this.formSubmit.emit(response.data);
      this.closeForm.emit();
    },
    error: (error: any) => {
      console.error(error);
      this.toastr.error(
        error.error?.message ||
        error.message ||
        `Failed to ${this.isEditMode ? 'update' : 'create'} pole`,
        'Error'
      );
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}




  patchFormWithData(data: any): void {
    this.form.patchValue({
      name: data.name,
      heightM: data.heightM,
      status: data.status,
      // material: data.material,
      // poleType: data.poleType,
      // ownership: data.ownership,
      // adss: data.adss,
      // upb: data.upb,
      // jHook: data.jhook,
      // anchor: data.anchor,
      // cable: data.cable,
      // slack: data.slack,
      // jb: data.jb,
      // fat: data.fat,
      // guyGrip: data.guyGrip,
      remarks: data.remarks,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      surveyAreaId: data.surveyAreaId || null,
      userId: data.userId || 1,
      mvnoId: data.mvnoId || 1
    });
      // Patch inventoryList FormArray
  const inventoryArray = this.form.get('inventoryList') as FormArray;
  inventoryArray.clear(); // Remove existing

  if (Array.isArray(data.inventoryList)) {
    data.inventoryList.forEach((item:any) => {
      inventoryArray.push(this.fb.group({
        accessoryCategoryId: [item.accessoryCategoryId || ''],
        accessoryCategoryName: [item.accessoryCategoryName || item.paramName || ''],
        accessoryValue: [item.accessoryValue || item.paramValue || ''],
        quantity: [item.quantity || '']
      }));
    });
  }
  }
}