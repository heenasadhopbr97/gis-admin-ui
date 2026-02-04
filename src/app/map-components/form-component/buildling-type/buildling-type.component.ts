import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-buildling-type',
  standalone: false,
  templateUrl: './buildling-type.component.html',
  styleUrl: './buildling-type.component.css'
})
export class BuildlingTypeComponent {

  @Input() buildingType!: 'SDU' | 'MDU' | 'CDU';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() buildingCreated = new EventEmitter<void>();
  @Input() featureData: any;
  surveyAreas: any[] = [];
  form: FormGroup;
  isLoading = false;
  isEditMode = false;

    //accessory api parameter
//   accessoryError: string | null = null;
//   specificationParametersDTOList: any[] = []
//   accessoriesOptions: { id: number, name: string }[] = [];

// accessoryCategoryList: string[] = [];
// accessoryValueMap: { [key: string]: string[] } = {};
// Validators = Validators;
// selectedAccessoryValues: string[] = [];
// selectedAccessoryCategoryId: number | null = null;
// selectedAccessoryCategoryName: string | null = null;

    constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      homePasses: ['', Validators.required],
      floors: ['', Validators.required],
      towers: ['1', Validators.required],
      tenancy: ['Owned'],
      category: ['Residential'],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      streetName: [''] ,
      riser: [''],
      oltName: [''], 
      fatNo: [''],
      fdtNo: [''] ,
      opticalLevel: [''],
      remarks: [''],
      photo1: [''],
      photo2: [''],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      // inventoryList: this.fb.array([]),
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

  getBuildingIconPath(): string {
  switch (this.buildingType) {
    case 'SDU':
      return 'assets/icons/sdu.svg';
    case 'MDU':
      return 'assets/icons/mdu.svg';
    case 'CDU':
      return 'assets/icons/cdu.svg';
    default:
      return 'assets/icons/default.svg'; // fallback icon
  }
}

getBuildingTitle(): string {
  switch (this.buildingType) {
    case 'SDU':
      return 'Single Dwelling Unit';
    case 'MDU':
      return 'Multi Dwelling Unit';
    case 'CDU':
      return 'Commercial Dwelling Unit';
    default:
      return 'Building Details';
  }
}


// createAccessoryDetailGroup(): FormGroup {
//   return this.fb.group({
//     paramName: [''],
//     paramValue: ['']
//   });
// }

// get inventoryList(): FormArray {
//   return this.form.get('inventoryList') as FormArray;
// }

// addAccessoryDetail(): void {
//   this.inventoryList.push(this.createAccessoryDetailGroup());
// }

// removeAccessoryDetail(index: number): void {
//   this.inventoryList.removeAt(index);
// }

// onCategoryChanged(event: Event, index: number): void {
//   const selectedId = +(event.target as HTMLSelectElement).value;
//   const selectedOption = this.accessoriesOptions.find(opt => opt.id === selectedId);

//   const group = this.inventoryList.at(index);
//   if (selectedOption) {
//     group.patchValue({
//       accessoryCategoryId: selectedId,
//       accessoryCategoryName: selectedOption.name,
//       accessoryValue: '',
//     });
//   } else {
//     group.patchValue({
//       accessoryCategoryId: '',
//       accessoryCategoryName: '',
//       accessoryValue: '',
//     });
//   }
// }
// getAccessoryValuesFor(index: number): string[] {
//   const group = this.inventoryList.at(index);
//   const name = group.get('accessoryCategoryName')?.value;
//   return name ? this.accessoryValueMap[name] || [] : [];
// }

// shouldShowField(field: any): boolean {
//   // Find potential parent (a field whose paramMultiValues include this field.paramName)
//   const parent = this.specificationParametersDTOList.find(f =>
//     f.isMultiValueParam &&
//     f.paramMultiValues?.includes(field.paramName) &&
//     !f.isAccessories
//   );

//   if (!parent) {
//     return true; // No parent — always show
//   }

//   const parentValue = this.form.get(parent.paramName)?.value;
//   return parentValue === field.paramName;
// }

// onAccessoryCategoryChange(event: Event): void {
//   const selectedId = +(event.target as HTMLSelectElement).value;
//   this.selectedAccessoryCategoryId = selectedId;

//   const selectedOption = this.accessoriesOptions.find(opt => opt.id === selectedId);
//   if (!selectedOption) {
//     this.selectedAccessoryValues = [];
//     this.selectedAccessoryCategoryName = null;
//     return;
//   }

//   const categoryName = selectedOption.name;
//   this.selectedAccessoryCategoryName = categoryName;
//   this.selectedAccessoryValues = this.accessoryValueMap[categoryName] || [];
// }



// loadAccessoieslist() {
//   const name = this.buildingType;
//   this.apiService.getProductCategoryByName(name).subscribe({
//     next: (res: any) => {
//       const allFields = res?.data?.specificationParametersDTOList || [];
//       this.specificationParametersDTOList = allFields;

//       for (const field of allFields) {
//         if (field.isAccessories) continue; // skip accessories here
//         const control = this.fb.control(
//           field.defaultValue || '',
//           field.isMandatory ? Validators.required : []
//         );
//         this.form.addControl(field.paramName, control);

//         if (field.paramName === 'Type' && field.isMultiValueParam && field.paramMultiValues?.[1]) {
//           this.form.patchValue({ ['Type']: field.paramMultiValues[1] });
//         }
//       }

//       // Only accessory field names
//       const accessories = allFields.filter((f:any) => f.isAccessories);
//       this.accessoryCategoryList = accessories.map((acc:any) => acc.paramName);
//     },
//     error: () => {
//       this.accessoryError = 'Failed to load specification data';
//       this.toastr.error('Failed to load specifications', 'Error');
//     },
//     complete: () => {
//       this.isLoading = false;
//     }
//   });
// }


  setSurveyAreaId(surveyAreaId: number): void {
    this.form.patchValue({
      surveyAreaId: surveyAreaId
    });
    // Optional: Load additional survey area data if needed
  }

  loadSurveyAreas(): void {
  const userId = this.apiService.getUserId();
  const mvnoId = this.apiService.getMvnoId();

  this.apiService.getsurveyArea(userId, mvnoId).subscribe({
    next: (res: any) => {
      if (res.success && res.data) {
        this.surveyAreas = res.data;
      }
    },
    error: (err) => {
      console.error('Failed to load survey areas', err);
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
  const formValue = { ...this.form.value };

    const selectedSurvey = this.surveyAreas.find(s => s.id === formValue.surveyAreaId);
if (selectedSurvey) {
  formValue.status = selectedSurvey.surveyStatusName; //  Send status string
} else {
  this.toastr.error('Survey area status not Exist.');
  console.warn('Survey area not matched. Defaulting status to Planned');
}

  // const inventoryList: any[] = [];

  // // Push non-accessory fields like 'Type' into inventoryList
  // for (const field of this.specificationParametersDTOList) {
  //   if (field.isAccessories) continue;

  //   const value = this.form.get(field.paramName)?.value;
  //   if (!value) continue;

  //   inventoryList.push({
  //     paramId: field.id,
  //     paramName: field.paramName,
  //     paramValue: value?.trim?.() || value,
  //     parentParamId: null,
  //     isAccessory: false,
  //     isMandatory: field.isMandatory,
  //     quantity: null
  //   });

  //   delete formValue[field.paramName];
  // }

  // // Push accessory fields
  // for (const item of this.inventoryList.value) {
  //   if (!item.paramName || !item.paramValue) continue;

  //   const accField = this.specificationParametersDTOList.find(f => f.paramName === item.paramName && f.isAccessories);
  //   const parentField = this.specificationParametersDTOList.find(f => f.paramName === 'Type' && !f.isAccessories);

  //   inventoryList.push({
  //     paramId: accField?.id ?? null,
  //     paramName: item.paramName,
  //     paramValue: item.paramValue,
  //     // parentParamId: parentField?.id ?? null,
  //     parentParamId:  null,
  //     isAccessory: true,
  //     isMandatory: accField?.isMandatory ?? false,
  //     quantity: null
  //   });
  // }

  // formValue.inventoryList = inventoryList;

  // Remove image file names (they're handled as binary)
  delete formValue.photo1;
  delete formValue.photo2;

  // Prepare image files
  const photo1Input = document.getElementById('photo1') as HTMLInputElement;
  const photo2Input = document.getElementById('photo2') as HTMLInputElement;

  const images: File[] = [];
  if (photo1Input?.files?.length) images.push(photo1Input.files[0]);
  if (photo2Input?.files?.length) images.push(photo2Input.files[0]);

  // Lowercase DTO key
  const dtoKey = this.buildingType?.toLowerCase() + 'Dto';

  // Prepare FormData
  const multipartFormData = new FormData();
  multipartFormData.append(dtoKey, JSON.stringify(formValue));
  images.forEach((img) => multipartFormData.append('images', img));

  // Determine API call
  let apiCall$;

  if (this.isEditMode && this.featureData?.publicId) {
    // ✅ Update mode
    switch (this.buildingType) {
      case 'SDU':
        apiCall$ = this.apiService.updateSduWithImg(this.featureData.publicId, multipartFormData);
        break;
      case 'MDU':
        apiCall$ = this.apiService.updateMduWithImg(this.featureData.publicId, multipartFormData);
        break;
      case 'CDU':
        apiCall$ = this.apiService.updateCduWithImg(this.featureData.publicId, multipartFormData);
        break;
      default:
        this.toastr.error('Invalid building type', 'Error');
        this.isLoading = false;
        return;
    }
  } else {
    //  Create mode
    switch (this.buildingType) {
      case 'SDU':
        apiCall$ = this.apiService.createSduWithImg(multipartFormData);
        break;
      case 'MDU':
        apiCall$ = this.apiService.createMduWithImg(multipartFormData);
        break;
      case 'CDU':
        apiCall$ = this.apiService.createCduWithImg(multipartFormData);
        break;
      default:
        this.toastr.error('Invalid building type', 'Error');
        this.isLoading = false;
        return;
    }
  }
  

  // API Subscribe
  apiCall$.subscribe({
    next: (response: any) => {
      const action = this.isEditMode ? 'updated' : 'created';
      this.toastr.success(response?.message || `Building ${action} successfully`, 'Success');
      this.form.reset();
      this.buildingCreated.emit();
      this.formSubmit.emit(response.data);
      this.closeForm.emit();
    },
    error: (error: any) => {
      console.error(error);
      this.toastr.error(
        error.error?.message || error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} building`,
        'Error'
      );
    },
    complete: () => {
      this.isLoading = false;
    }
  });
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

    patchFormWithData(data:any): void {
    this.form.patchValue({
      name: data.name,
      address: data.address,
      homePasses: data.homePasses,
      floors: data.floors,
      towers: data.towers,
      tenancy: data.tenancy,
      category: data.category,
      status: data.status,
      streetName: data.streetName,
      riser: data.riser,
      oltName: data.oltName,
      fatNo: data.fatNo,
      fdtNo: data.fdtNo,
      opticalLevel: data.opticalLevel,
      remarks: data.remarks,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      photo1: data.photo1 || '',
      photo2: data.photo2 || '',
      surveyAreaId: data.surveyAreaId || null,
      userId: data.userId || 1,
      mvnoId: data.mvnoId || 1
    });

      // Patch inventoryList FormArray
  // const inventoryArray = this.form.get('inventoryList') as FormArray;
  // inventoryArray.clear(); // Remove existing

  // if (Array.isArray(data.inventoryList)) {
  //   data.inventoryList.forEach((item:any) => {
  //     inventoryArray.push(this.fb.group({
  //       paramName: [item.paramName || ''],
  //       paramValue: [item.paramValue || '']
  //     }));
  //   });
  // }
  
  }


  }
