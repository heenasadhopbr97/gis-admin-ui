import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { status } from 'src/app/RadiusUtils/RadiusConstants';

@Component({
  selector: 'app-cable',
  standalone: false,
  templateUrl: './cable.component.html',
  styleUrl: './cable.component.css'
})
export class CableComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  form: FormGroup;
  coordinates: number[][] = [];
  @Input() isEditMode: boolean = false;
  @Input() featureData: any;
  @Input() initialCoordinates: number[][] = [];
  @Input() initialTrenchCoordinates: number[][] = []; // For trench coordinates
  @Input() initialDuctCoordinates: number[][] = []; // For duct coordinates
  surveyAreas: any[] = [];
  isLoading = false; // For loading state
  errorMessage: string | null = null; // For error messages
  successMessage: string | null = null; // For success messages
  cableSpecifications: any[] = [];
  cableType: any[] = [];
  isSpecificationsLoading = false;
  isTypeLoading = false
  specificationError: string | null = null;
  typeError: string | null = null;

  selectedLayer: string = '';
  @Input() showLayerDropdown: boolean = true;

  specificationParametersDTOList: any[] = []
  accessoryError: string | null = null;
  surveyStageName: string | null = null;


  splitterPorts: any[] = [];
  nearbySdus: any[] = [];

  // Trench related properties
  trenchForm: FormGroup;
  
  // Duct related properties
  ductForm: FormGroup;
  // Street related properties
  streetForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mountingType: ['Overhead', Validators.required],
      cableTypeId: ['', Validators.required],
      specificationId: ['', Validators.required],
      measuredLengthM: ['', Validators.required],
      installationDate: ['', Validators.required],
      // originNodeId: ['1',],
      // originNodeType: ['',],
      // destinationNodeId: ['1',],
      // destinationNodeType: ['',],
      // splitterId:[''],
      // splitterPortId: [''],
      // sduId: [''],
      // connectionType: [''],
      parentNeId:['1',Validators.required],
      parentNeType:['',],
      remarks: [''],
      // coordinates: this.fb.array([]),
      surveyAreaId: [null],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
      inventoryList: this.fb.array([]) 
    });

    this.trenchForm = this.fb.group({
      name: ['', Validators.required],
      owner: ['', Validators.required],
      contractor: ['', Validators.required],
      relatedAssets:['', Validators.required],
      remarks: [''],
      // coordinates: this.fb.array([]),
      status: ['Inactive', Validators.required],
      measuredLengthM: ['', Validators.required],
      depthM: ['', Validators.required],
      widthM: ['', Validators.required],
      surveyAreaId: [null],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId()
    });

    this.ductForm = this.fb.group({
      name: ['', Validators.required],
      material: ['', Validators.required],
      diameterMm: ['', Validators.required],
      measuredLengthM:['', Validators.required],
      status: ['Inactive', Validators.required],
      owner: ['', Validators.required],
      available_subducts: [0, [Validators.required, Validators.min(0)]],
      numSubducts: [0, [Validators.required, Validators.min(0)]],
      usedSubducts: [0, [Validators.required, Validators.min(0)]],
      networkType: ['Backbone', Validators.required],
      remarks: [''],
      installDate: ['', Validators.required],
      // coordinates: this.fb.array([]),
      surveyAreaId: [null],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId()

    });

    this.streetForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Residential'],
      code: [''],
      measuredLengthM:['', Validators.required],
      oneWay: [true],
      surface: ['Concrete'],
      status: [''],
      // coordinates: this.fb.array([]),
      surveyAreaId: [null],
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId()
    })
  }

  addCoordinate() {
    this.coordinates.push([0, 0]);
  }
  ngOnInit() {
    if (this.initialCoordinates.length > 0) {
      this.coordinates = this.initialCoordinates;
      this.calculateLength();
    }

    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
     
    }

    this.loadSurveyAreas();

    // Load cable specifications when component initializes
    this.loadCableSpecifications();
    this.loadCableType();

    this.loadAccessoieslist();

      // If splitterId is already set, load ports and SDUs
  const splitterId = this.form.get('splitterId')?.value;
  if (splitterId) {
    this.loadSplitterPortsAndSdus(splitterId);
  }

  // Listen for splitterId changes
  this.form.get('splitterId')?.valueChanges.subscribe(id => {
    if (id) {
      this.loadSplitterPortsAndSdus(id);
    }
  });

    
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['featureData'] && this.featureData) {
    this.patchFormWithData(this.featureData);
  }
}

// Accessory Form
accessoryForm = this.fb.group({
  paramName: ['', Validators.required],
  paramValue: ['', Validators.required],
  quantity: ['', Validators.required]
});

singleAccessoryValues: string[] = [];
accessoryCategoryList: string[] = [];
accessoryValueMap: { [key: string]: string[] } = {};

get inventoryList(): FormArray {
  return this.form.get('inventoryList') as FormArray;
}


  setSplitterId(splitterId: number) {
  this.form.patchValue({ splitterId });
  // Optionally, trigger loading of ports and SDUs for this splitter
  this.loadSplitterPortsAndSdus(splitterId);
}

  loadSplitterPortsAndSdus(splitterId: number) {

  this.apiService.getAvailableSplitterPorts(splitterId).subscribe({
    next: (res: any) => {
      this.splitterPorts = res.data || [];
    },
    error: () => {
      this.splitterPorts = [];
    }
  });

  const surveyAreaId = this.form.get('surveyAreaId')?.value;
  this.apiService.getNearbySdus(splitterId, surveyAreaId).subscribe({
    next: (res: any) => {
      this.nearbySdus = res.data || [];
    },
    error: () => {
      this.nearbySdus = [];
    }
  });
}

  loadCableSpecifications() {
    this.isSpecificationsLoading = true;
    this.specificationError = null;

    this.apiService.getAllCableSpecifications().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.cableSpecifications = response.data;
          // Set default value if needed
          if (this.cableSpecifications.length > 0) {
            this.form.patchValue({
              specificationId: this.cableSpecifications[0].id
            });
          }
        }
      },
      error: (error) => {
        this.specificationError = 'Failed to load cable specifications.';
        console.error('Error loading specifications:', error);
      },
      complete: () => {
        this.isSpecificationsLoading = false;
      }
    });
  }

  loadCableType(){
    this.isTypeLoading = true;
    this.typeError = null;

    this.apiService.getAllCableType().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.cableType = response.data;
          // Set default value if needed
          if (this.cableType.length > 0) {
            this.form.patchValue({
               cableTypeId: this.cableType[0].id
            });
          }
        }
      },
      error: (error) => {
        this.typeError = 'Failed to load cable type.';
        console.error('Error loading type:', error);
      },
      complete: () => {
        this.isTypeLoading = false;
      }
    });
  }

  loadAccessoieslist() {
    const name = 'cable';
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

removeAccessoryDetail(index: number): void {
  this.inventoryList.removeAt(index);
}


  removeCoordinate(index: number) {
    if (this.coordinates.length > 2) {
      this.coordinates.splice(index, 1);
    }
  }

  onCancel(): void {
    this.form.reset();
    this.closeForm.emit();
  }

  shouldShowAccessoryFields(): boolean {
    return this.isEditMode && this.surveyStageName === 'Design';
  }

onSubmit() {
  if (this.form.invalid) {
    this.errorMessage = 'Please fill all required fields correctly';
    return;
  }

  this.errorMessage = null;
  this.successMessage = null;
  this.isLoading = true;

  const lengthValue = parseFloat(this.form.value.measuredLengthM) || 0;

  const formData: any = {
    ...this.form.value,
    measuredLengthM: lengthValue,
    geom: {
      type: 'LineString',
      coordinates: this.coordinates
    }
  };

  // ✅ Build inventoryList
  const inventoryList: any[] = [];

  // From accessory FormArray
  this.inventoryList.controls.forEach((ctrl: any) => {
    const category = ctrl.get('paramName')?.value;
    const value = ctrl.get('paramValue')?.value;
    const qty = +(ctrl.get('quantity')?.value);

    if (!category || !value || !qty) return;

    const accField = this.specificationParametersDTOList.find(
      (f: any) => f.isAccessories && f.paramName === category
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

  // ✅ Handle top-level dynamic fields (like Type) that are actually accessories
  this.specificationParametersDTOList.forEach((field: any) => {
    const val = this.form.get(field.paramName)?.value;
    if (val && !field.isAccessories) {
      // Example: Type
      inventoryList.push({
        parentParamId: null,
        paramId: field.id,
        paramName: field.paramName,
        paramValue: val,
        isAccessory: false,
        isMandatory: field.isMandatory,
        isConfiguration: field.isConfiguration,
        quantity: 1
      });

      // Remove it from top-level payload so it doesn’t duplicate
      delete formData[field.paramName];
    }
  });

  formData.inventoryList = inventoryList;

  // ✅ Survey status
  const selectedSurvey = this.surveyAreas.find(s => s.id === formData.surveyAreaId);
  if (selectedSurvey) {
    formData.status = selectedSurvey.surveyStatusName;
  } else {
    this.toastr.error('Survey area status not Exist.');
    console.warn('Survey area not matched. Defaulting status to Planned');
  }

  // --- UPDATE or CREATE ---
  const apiCall = this.isEditMode && this.featureData?.publicId
    ? this.apiService.updateCable(this.featureData.publicId, formData)
    : this.apiService.createCable(formData);

  apiCall
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (response: any) => {
        const action = this.isEditMode ? 'updated' : 'created';
        this.successMessage = `Cable ${action} successfully!`;
        this.toastr.success(response.message, 'Success');
        this.formSubmit.emit(response?.data?.id);
        this.form.reset();
        this.inventoryList.clear();
        this.closeForm.emit();
      },
      error: (error) => {
        this.errorMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} cable. Please try again.`;
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} cable:`, error);
      }
    });
}


patchFormWithData(data: any): void {
  this.form.patchValue({
    name: data.name,
    cableTypeId: data.cableTypeId,
    specificationId: data.specificationId,
    mountingType: data.mountingType,
    measuredLengthM: data.measuredLengthM,
    installationDate: data.installationDate,
    parentNeId: data.parentNeId,
    parentNeType: data.parentNeType,
    remarks: data.remarks,
    surveyAreaId: data.surveyAreaId,
    userId: data.userId || this.apiService.getUserId(),
    mvnoId: data.mvnoId || this.apiService.getMvnoId()
  });

  // Patch coordinates if present
  if (data.geom?.coordinates) {
    this.coordinates = data.geom.coordinates;
  }

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

  setSurveyAreaId(surveyAreaId: number): void {
    this.form.patchValue({
      surveyAreaId: surveyAreaId
    });
    this.trenchForm.patchValue({
      surveyAreaId: surveyAreaId  
    });
    this.ductForm.patchValue({
      surveyAreaId: surveyAreaId
    });
    this.streetForm.patchValue({
      surveyAreaId: surveyAreaId
    });
    // Optional: Load additional survey area data if needed
    // this.loadSurveyAreaDetails(surveyAreaId);
  }

  // private loadSurveyAreaDetails(surveyAreaId: number): void {
  //   this.apiService.getsurveyAreaByUser(surveyAreaId).subscribe({
  //     next: (response: any) => {
  //       if (response.success) {
  //         // You can use the survey area data here if needed
  //         console.log('Survey area details:', response.data);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading survey area details:', error);
  //     }
  //   });
  // }

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


  updateLineCoordinates(coords: number[][]) {
    console.log('Received coordinates:', coords);
    this.form.patchValue({
      geom: {
        coordinates: coords,
        type: 'LineString'
      }
    });
    this.coordinates = coords.map(coord => [coord[0], coord[1]]); 
    this.calculateLength();
  }

  public calculateLength() {
    if (this.coordinates.length < 2) return;
    let length = 0;
    for (let i = 1; i < this.coordinates.length; i++) {
      const [lon1, lat1] = this.coordinates[i - 1];
      const [lon2, lat2] = this.coordinates[i];
      length += this.haversineDistance(lat1, lon1, lat2, lon2);
    }
    this.form.patchValue({
      measuredLengthM: Math.round(length * 1000)
    });
    this.trenchForm.patchValue({
      measuredLengthM: Math.round(length * 1000)
    });
    this.ductForm.patchValue({
      measuredLengthM: Math.round(length * 1000)
    });
    this.streetForm.patchValue({
      measuredLengthM: Math.round(length * 1000)
    });
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }


  onSubmitTrench(){

    if (this.trenchForm.invalid || this.coordinates.length < 2) {
      this.errorMessage = 'Form invalid or insufficient coordinates';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

  const lengthValue = parseFloat(this.trenchForm.value.measuredLengthM) || 0;

  const trenchData = {
    ...this.trenchForm.value,
    measuredLengthM: lengthValue,
    geom: {
      type: 'LineString',
      coordinates: this.coordinates
    }
  };

  this.isLoading = true;

    this.apiService.createTrench(trenchData).
    pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (response: any) => {
        this.successMessage = 'Trench created successfully!';
        this.toastr.success(response.message, 'Success');
        this.formSubmit.emit(trenchData); // Emit event if parent component needs to know
        this.trenchForm.reset();
        this.closeForm.emit();
      },error: (error) => {
        this.errorMessage = error.message || 'Failed to create trench. Please try again.';
        console.error('Error creating trench:', error);
      }
    })
  }

  onSubmitDuct(){
    if (this.ductForm.invalid || this.coordinates.length < 2) {
      this.errorMessage = 'Form invalid or insufficient coordinates';
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    const lengthValue = parseFloat(this.ductForm.value.measuredLengthM) || 0;

    const ductData = {
      ...this.ductForm.value,
      measuredLengthM: lengthValue,
      geom: {
        type: 'LineString',
        coordinates: this.coordinates
      }
    };

    this.isLoading = true;

    this.apiService.createDuct(ductData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Duct created successfully!';
          this.toastr.success(response.message, 'Success');
          this.formSubmit.emit(ductData); // Emit event if parent component needs to know
          this.ductForm.reset();
          this.closeForm.emit();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create duct. Please try again.';
          console.error('Error creating duct:', error);
        }
      });
  }

  onSubmitStreet(){
    if (this.streetForm.invalid || this.coordinates.length < 2) {
      this.errorMessage = 'Form invalid or insufficient coordinates';
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    const lengthValue = parseFloat(this.streetForm.value.measuredLengthM) || 0;

    const streetData = {
      ...this.streetForm.value,
      measuredLengthM: lengthValue,
      geom: {
        type: 'LineString',
        coordinates: this.coordinates
      }
    };

    this.isLoading = true;

    this.apiService.createStreet(streetData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Street created successfully!';
          this.toastr.success(response.message, 'Success');
          this.formSubmit.emit(streetData); // Emit event if parent component needs to know
          this.streetForm.reset();
          this.closeForm.emit();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to create street. Please try again.';
          console.error('Error creating street:', error);
        }
      });
  }

}
