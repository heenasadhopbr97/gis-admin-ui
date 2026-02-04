import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-olt',
  templateUrl: './olt.component.html',
  styleUrl: './olt.component.css',
  standalone: false
})
export class OltComponent {

  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() oltCreated = new EventEmitter<number>();
  @Input() featureData: any;
  form: FormGroup;
  isLoading = false;
  isEditMode = false;
  surveyError: string | null = null;
  surveyStageName: string | null = null;

  @Input() surveyAreaGeometry: any;
  surveyAreas: any[] = [];

    //accessory api parameter
  accessoryCategoryList: string[] = [];
  accessoryValueMap: { [key: string]: string[] } = {};
  Validators = Validators;
  accessoryError: string | null = null;
  specificationParametersDTOList: any[] = []
  accessoriesOptions: { id: number, name: string }[] = [];

  accessoryForm: FormGroup;
  singleAccessoryValues: string[] = [];

    constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      opticalLevel: ['Primary', Validators.required],
      upLinkProtection: ['Yes'],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      powerBackup: ['Yes'],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      inventoryList: this.fb.array([])
    });
    // separate single accessory entry
  this.accessoryForm = this.fb.group({
    paramName: [''],
    paramValue: [''],
    quantity: ['']
  });
  }

  ngOnInit() { 
    if(this.featureData) {
      this.isEditMode = true;
    this.patchFormWithData(this.featureData);
    } 
    this.loadAccessoieslist();
    this.loadSurveyAreas(); 

    // if (this.inventoryList.length === 0) {
    //   this.addAccessoryDetail(); // Show first row by default
    // }
  }

  shouldShowAccessoryFields(): boolean {
    return this.surveyStageName === 'Design';
  }

  createAccessoryGroup(): FormGroup {
    return this.fb.group({
      accessoryId: [''],
      quantity: [''],
    });
  }

createAccessoryDetailGroup(): FormGroup {
  return this.fb.group({
    paramName: [''],
    paramValue: [''],
    quantity: ['']
  });
}

getAccessoryValuesForType(): string[] {
  const selectedType = this.form.get('Type')?.value;
  return selectedType ? this.accessoryValueMap[selectedType] || [] : [];
}


get inventoryList(): FormArray {
  return this.form.get('inventoryList') as FormArray;
}

onAccessoryFieldChanged(): void {
  const selectedField = this.accessoryForm.get('paramName')?.value;
  this.singleAccessoryValues = selectedField ? this.accessoryValueMap[selectedField] || [] : [];
  this.accessoryForm.get('paramValue')?.reset();
}

// --- already in your code, just refine it ---
addAccessoryToList(): void {
  const selectedType = this.form.get('Type')?.value;
  const paramValue = this.accessoryForm.get('paramValue')?.value;
  const quantity = this.accessoryForm.get('quantity')?.value;

  if (!selectedType || !paramValue || !quantity) {
    this.toastr.warning('Please select accessory and enter quantity', 'Validation');
    return;
  }

  this.inventoryList.push(
    this.fb.group({
      paramName: [selectedType],  // store the selected OLT type (HUAWEI OLT etc.)
      paramValue: [paramValue],
      quantity: [quantity]
    })
  );

  this.accessoryForm.reset();
}



  addAccessoryDetail(): void {
  this.inventoryList.push(this.createAccessoryDetailGroup());
}

removeAccessoryDetail(index: number): void {
  this.inventoryList.removeAt(index);
}

  shouldShowField(field: any): boolean {
  const parent = this.specificationParametersDTOList.find(f =>
    f.isMultiValueParam &&
    f.paramMultiValues?.includes(field.paramName) &&
    !f.isAccessories
  );

  if (!parent) return true;

  const parentValue = this.form.get(parent.paramName)?.value;
  return parentValue === field.paramName;
}


  handleAddAccessory(): void {
  const lastGroup = this.inventoryList.at(this.inventoryList.length - 1);

  const accessoryId = lastGroup.get('accessoryId')?.value;
  const quantity = lastGroup.get('quantity')?.value;

  // Don't allow if both are empty
  if (!accessoryId && !quantity) {
    this.toastr.warning('Please fill the last accessory before adding another.', 'Incomplete Row');
    return;
  }

  this.addAccessoryDetail();
}

  canAddAccessory(): boolean {
    const lastGroup = this.inventoryList.at(this.inventoryList.length - 1);
    if (!lastGroup) return true;
    const accessoryId = lastGroup.get('accessoryId')?.value;
    const quantity = lastGroup.get('quantity')?.value;
    return !!(accessoryId && quantity);
  }

loadAccessoieslist() {
  const name = 'olt';
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
      const accessories = allFields.filter((f:any) => f.isAccessories);
      this.accessoryCategoryList = accessories.map((acc:any) => acc.paramName);

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
  const formData = { ...this.form.value };

  // Append survey status
  const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
  if (selectedSurvey) {
    formData.status = selectedSurvey.surveyStatusName;
  } else {
    this.toastr.error('Survey area status not Exist.');
    console.warn('Survey area not matched. Defaulting status to Planned');
  }

  const inventoryList: any[] = [];

  // 1. Add non-accessory specification parameters (even if empty)
  this.specificationParametersDTOList.forEach((field) => {
    if (!field.isAccessories && this.form.contains(field.paramName)) {
      const value = this.form.get(field.paramName)?.value ?? ''; // allow empty string
      inventoryList.push({
        paramId: field.id,
        paramName: field.paramName,
        paramValue: value,
        isAccessory: false,
        isMandatory: field.isMandatory,
        isConfiguration: field.isConfiguration || false,
        quantity: null,
        parentParamId: null
      });

      // Remove from root payload to avoid backend error
      delete formData[field.paramName];
    }
  });

  // 2. Add accessories from FormArray
  this.inventoryList.controls.forEach((group) => {
    const selectedType = this.form.get('Type')?.value;
    const accessoryParamName = selectedType;
    const paramValue = group.get('paramValue')?.value;
    const quantity = group.get('quantity')?.value;

    const matchingField = this.specificationParametersDTOList.find(
      f => f.paramName === accessoryParamName && f.isAccessories
    );

    
      const parentField = this.specificationParametersDTOList.find(
        f => f.paramName === 'Type'
      );

    if (matchingField && paramValue && quantity) {
      inventoryList.push({
        paramId: matchingField.id,
        paramName: matchingField.paramName,
        paramValue: paramValue,
        isAccessory: true,
        isMandatory: false,
        isConfiguration: matchingField.isConfiguration || false,
        quantity: quantity,
        parentParamId: parentField?.id || null
      });
    }
  });

  formData.inventoryList = inventoryList;

  // --- CHOOSE API BASED ON MODE ---
  const apiCall = this.isEditMode && this.featureData?.publicId
    ? this.apiService.updateOlt(this.featureData.publicId, formData)
    : this.apiService.createOlt(formData);

  apiCall.subscribe({
    next: (response: any) => {
      this.toastr.success(response?.message || `OLT ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Success');
      this.form.reset();
      this.oltCreated.emit(response?.data?.id || response?.id || null);
      this.closeForm.emit();
    },
    error: (error: any) => {
      console.error(error, `Error ${this.isEditMode ? 'updating' : 'creating'} OLT`);
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
        opticalLevel: data.opticalLevel,
        upLinkProtection: data.upLinkProtection,
        powerBackup: data.powerBackup,
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
        paramName: [item.paramName || ''],
        paramValue: [item.paramValue || ''],
        quantity: [item.quantity || '']
      }));
    });
  }
}


}
