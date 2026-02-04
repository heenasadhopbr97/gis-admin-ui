import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-joint',
  templateUrl: './joint.component.html',
  styleUrl: './joint.component.css',
  standalone: false
})
export class JointComponent {


  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() jointCreated = new EventEmitter<number>();
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

  singleAccessoryValues: string[] = [];
  accessoryCategoryList: string[] = [];
  accessoryValueMap: { [key: string]: string[] } = {};
  Validators = Validators;
  specificationParametersDTOList: any[] = [];


  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['',Validators.required],
      jointType: ['Splice',Validators.required],
      mountedIn: ['Cabinet', Validators.required],
      longitude: [null, Validators.required], 
      latitude: [null, Validators.required],
      parentNeType: ['Handhold', Validators.required],
      userId: this.apiService.getUserId(),
      parentNeId: [1, Validators.required],
      mvnoId: this.apiService.getMvnoId(),
      surveyAreaId: [null],
      inventoryList: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
    }

    this.loadAccessoieslist();
    this.loadSurveyAreas();

    // Add default accessoryDetail row if empty
    // if (this.inventoryList.length === 0) {
    //   this.addAccessoryDetail();
    // }

  }

  accessoryForm = this.fb.group({
    paramName: ['', Validators.required],
    paramValue: ['', Validators.required],
    quantity: ['', Validators.required]
  });

  onSingleAccessoryFieldChanged(): void {
  const selected = this.accessoryForm.get('paramName')?.value;
  this.accessoryForm.get('paramValue')?.setValue('');
  this.singleAccessoryValues = selected ? this.accessoryValueMap[selected] || [] : [];
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


    loadAccessoieslist() {
    this.apiService
      .getProductCategoryByName('joint-closures')
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
          if (
            field.paramName === 'Type' &&
            field.isMultiValueParam &&
            field.paramMultiValues?.length
          ) {
            // Pick first value
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

  onSubmit(){

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toastr.error('Please fill all required fields', 'Validation Error');
      return;
    }
    
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
  this.inventoryList.controls.forEach(ctrl => {
    const paramName = ctrl.get('paramName')?.value;
    const paramValue = ctrl.get('paramValue')?.value;
    const qty = +ctrl.get('quantity')?.value;

    if (!paramName || !paramValue || !qty) return;

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
  });

  // Remove dynamic spec fields like Type from top-level payload:
  this.specificationParametersDTOList.forEach(field => {
    if (field.paramName && formData.hasOwnProperty(field.paramName)) {
      delete formData[field.paramName];
    }
  });

  // Put back into payload
  formData.inventoryList = inventoryList;


    const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
    if (selectedSurvey) {
      formData.status = selectedSurvey.surveyStatusName; //  Send status string
    } else {
      this.toastr.error('Survey area status not Exist.');
      console.warn('Survey area not matched. Defaulting status to Planned');
    }

    //  CREATE or UPDATE
    const apiCall = this.isEditMode && this.featureData?.publicId
      ? this.apiService.updateJointClosure(this.featureData.publicId, formData)
      : this.apiService.createJointClosure(formData);

    // Now send
    apiCall.subscribe({
      next: (response: any) => {
        const action = this.isEditMode ? 'updated' : 'created';
        this.toastr.success(response?.message || `Joint Closure ${action} successfully`, 'Success');
        this.form.reset();
        this.jointCreated.emit(response?.data?.id);
        this.closeForm.emit();
      },
      error: (error: any) => {
        console.error(error, `Error ${this.isEditMode ? 'updating' : 'creating'} Joint Closure`);
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

  patchFormWithData(data: any) {
    this.form.patchValue({
      name: data.name,
      jointType: data.jointType,
      mountedIn: data.mountedIn,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      parentNeType: data.parentNeType,
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


