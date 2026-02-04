import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-splitter',
  standalone: false,
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.css',
})
export class SplitterComponent implements OnInit, OnChanges  {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() splitterCreated = new EventEmitter<void>();
  @Input() featureData: any;
  @Input() initialCoordinates: [number, number] | null = null;
  @Input() parentNeId: number | null = null;

  form: FormGroup;
  isLoading = false;
  @Input() isEditMode: boolean = false;
  surveyError: string | null = null;
  surveyStageName: string | null = null;

  @Input() surveyAreaGeometry: any;
  @Input() showHeader: boolean = true;
  @Input() surveyAreaId: number | null = null;

  surveyAreas: any[] = [];

  splitterSpecifications: any[] = [];
  fats: any[] = [];
  fdcs: any[] = [];
  parentNeTypes: any[] = [];
  specificationParametersDTOList: any[] = [];

singleAccessoryValues: string[] = [];
accessoryCategoryList: string[] = [];
accessoryValueMap: { [key: string]: string[] } = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      // specificationId: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      // parentNeType: ['', Validators.required],
      userId: this.apiService.getUserId(),
      parentNeId: [null],
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      inventoryList: this.fb.array([])
    });
  }

  ngOnInit() {
    // Initial load
    if (this.initialCoordinates && !this.isEditMode) {
      this.setCoordinates(this.initialCoordinates);
    }

    if (this.parentNeId) {
      this.form.patchValue({ parentNeId: this.parentNeId });
    }

    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
    }

      if (this.surveyAreaId) {
    this.form.patchValue({ surveyAreaId: this.surveyAreaId });
  }

    this.loadSurveyAreas();

    this.loadSplitterSpecifications();
    this.loadParentLayer(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCoordinates'] && changes['initialCoordinates'].currentValue && !this.isEditMode) {
      this.setCoordinates(changes['initialCoordinates'].currentValue);
    }

    if (changes['parentNeId'] && changes['parentNeId'].currentValue) {
      this.form.patchValue({ parentNeId: changes['parentNeId'].currentValue });
    }

    if (changes['surveyAreaId'] && changes['surveyAreaId'].currentValue) {
      this.form.patchValue({ surveyAreaId: changes['surveyAreaId'].currentValue });
    }
  }

  accessoryForm = this.fb.group({
    paramName: ['', Validators.required],
    paramValue: ['', Validators.required],
    quantity: ['', Validators.required]
  });

  setCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1],
    });
  }
  

loadSplitterSpecifications() {

      this.apiService
      .getProductCategoryByName('splitter')
      .subscribe((res: any) => {
        const allFields = res?.data?.specificationParametersDTOList || [];
        this.specificationParametersDTOList = allFields;

        for (const field of allFields) {
          if (field.isAccessories) continue;

          // Create control
          const ctrl = this.fb.control(
            '',
            field.isMandatory ? Validators.required : []
          );
          this.form.addControl(field.paramName, ctrl);

          // Set default value for Type
        if (field.paramName === 'Type' && field.paramMultiValues?.length) {
            this.form.patchValue({ ['Type']: field.paramMultiValues[0] });
          }
        }

        const accessories = allFields.filter(
          (x: any) => x.isAccessories && x.paramMultiValues?.length
        );
        for (const acc of accessories) {
          this.accessoryCategoryList.push(acc.paramName);
          this.accessoryValueMap[acc.paramName] = acc.paramMultiValues;
        }
      });
}


  loadParentLayer() {
  const code = 'splitter';
  this.apiService.getParentLayerByCode(code).subscribe({
    next: (res: any) => {
      this.parentNeTypes = res;
    },
    error: (err) => {
      console.error('Error fetching parent layer:', err);
    }
  });
}


  onParentNeTypeChange(event: any) {
  // const selectedType = event.target.value;

  // if (selectedType === 'FAT') {
  //   this.apiService.getAllFats().subscribe((res: any) => {
  //     if (res.success) this.fats = res.data.filter((x: any) => x.name?.includes('FAT'));
  //   });
  //   this.form.get('parentFatId')?.setValidators(Validators.required);
  //   this.form.get('parentFdcId')?.clearValidators();
  // } else if (selectedType === 'FDC') {
  //   this.apiService.getAllFdcs().subscribe((res: any) => {
  //     if (res.success) this.fdcs = res.data;
  //   });
  //   this.form.get('parentFdcId')?.setValidators(Validators.required);
  //   this.form.get('parentFatId')?.clearValidators();
  // }

  //   // Reset values to avoid carrying over old selections
  // this.form.patchValue({ parentFatId: '', parentFdcId: '' });

  // // Update validations
  // this.form.get('parentFatId')?.updateValueAndValidity();
  // this.form.get('parentFdcId')?.updateValueAndValidity();
}


onSingleAccessoryFieldChanged(): void {
  const selected = this.accessoryForm.get('paramName')?.value;
  this.accessoryForm.get('paramValue')?.setValue('');
  this.singleAccessoryValues = selected ? (this.accessoryValueMap[selected] || []) : [];
}

addAccessoryToList(): void {
  if (this.accessoryForm.invalid) return;

  // Push into inventoryList (FormArray)
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

  shouldShowAccessoryFields(): boolean {
    return this.isEditMode && this.surveyStageName === 'Design';
  }

get inventoryList(): FormArray {
  return this.form.get('inventoryList') as FormArray;
}

  setSurveyAreaId(surveyAreaId: number): void {
    this.form.patchValue({
      surveyAreaId: surveyAreaId
    });

  }

    loadSurveyAreas(): void {
  const userId = this.apiService.getUserId();
  const mvnoId = this.apiService.getMvnoId();

  this.apiService.getsurveyArea(userId, mvnoId).subscribe({
    next: (res: any) => {
      if (res.success && res.data) {
        this.surveyAreas = res.data;

      // If in edit mode, find the current survey area stage
        if (this.isEditMode && this.form.value.surveyAreaId) {
          const matchedSurvey = this.surveyAreas.find(s => s.id === this.form.value.surveyAreaId);
          if (matchedSurvey) {
            this.surveyStageName = matchedSurvey.surveyStageName; //  Store for later use
          }
        }
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
      latitude: coords[1],
    });
  }

  onCancel(): void {
    this.form.reset();
    this.closeForm.emit();
  }

  onSubmit() {
    if (this.form.invalid) return;
  this.isLoading = true;
  const rawForm = this.form.getRawValue();
  const formData: any = { ...rawForm };

  const inventoryList: any[] = [];

  // Add specification (non accessories e.g. Type)
  this.specificationParametersDTOList.forEach(field => {
    if (!field.isAccessories) {
      const value = this.form.get(field.paramName)?.value;
      if (value) {
        inventoryList.push({
          parentParamId: null,
          paramId: field.id,
          paramName: field.paramName,
          paramValue: value,
          isMandatory: field.isMandatory,
          isAccessory: false,
          isConfiguration: field.isConfiguration ?? false,
          quantity: null
        });
      }
    }
  });

  // Add accessories from the manual table
// Add accessory directly from accessoryForm if filled
const paramName = this.accessoryForm.get('paramName')?.value;
const paramValue = this.accessoryForm.get('paramValue')?.value;
const qty = +this.accessoryForm.get('quantity')?.value;

if (paramName && paramValue && qty) {
  const matchedSpec = this.specificationParametersDTOList.find(sp => sp.isAccessories && sp.paramName === paramName);
  if (matchedSpec) {
    inventoryList.push({
      parentParamId: null,
      paramId: matchedSpec.id,
      paramName: matchedSpec.paramName,
      paramValue,
      isMandatory: matchedSpec.isMandatory,
      isAccessory: true,
      isConfiguration: matchedSpec.isConfiguration ?? false,
      quantity: qty
    });
  }
}

  // Remove dynamic spec fields like Type from top-level payload:
  this.specificationParametersDTOList.forEach(field => {
    if (field.paramName && formData.hasOwnProperty(field.paramName)) {
      delete formData[field.paramName];
    }
  });

  // Put back into payload
  formData.inventoryList = inventoryList;

    // Always set parentNeType to 'Fat'
  formData.parentNeType = 'Fat';
  
console.log(this.surveyAreas);

    const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
    console.log('Selected Survey Area:', selectedSurvey);
    if (selectedSurvey) {
      formData.status = selectedSurvey.surveyStatusName; //  Send status string
      console.log('Survey Area Status:', formData.status);
    } else {
      this.toastr.error('Survey area status not Exist.');
      console.warn('Survey area not matched. Defaulting status to Planned');
    }

  const apiCall = this.isEditMode && this.featureData?.publicId
    ? this.apiService.updateSplitter(this.featureData.publicId, formData)
    : this.apiService.createSplitter(formData);

  apiCall.subscribe({
    next: (response: any) => {
      const action = this.isEditMode ? 'updated' : 'created';
      this.toastr.success(response?.message || `Splitter ${action} successfully`, 'Success');
      this.form.reset();

      // PATCH REQUIRED FIELDS BACK AFTER RESET
      this.form.patchValue({
        userId: this.apiService.getUserId(),
        mvnoId: this.apiService.getMvnoId(),
        surveyAreaId: this.surveyAreaId,
        parentNeId: this.parentNeId
      });

      this.formSubmit.emit(response); // Or create a separate `splitterCreated.emit()`
      this.closeForm.emit();
    },
    error: (error: any) => {
      console.error(error, `Error ${this.isEditMode ? 'updating' : 'creating'} splitter`);
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
    status: data.status,
    specificationId: data.specificationId,
    parentNeType: data.parentNeType,
    parentNeId: data.parentNeId || 1,
    // parentFatId: data.parentFatId,
    // parentFdcId: data.parentFdcId,
    longitude: data.geom?.coordinates?.[0] || data.longitude,
    latitude: data.geom?.coordinates?.[1] || data.latitude,
    surveyAreaId: data.surveyAreaId || null,
    userId: data.userId || this.apiService.getUserId(),
    mvnoId: data.mvnoId || this.apiService.getMvnoId(),
  });
}

}
