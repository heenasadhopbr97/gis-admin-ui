import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrl: './connection-dialog.component.css',
  standalone: false
})
export class ConnectionDialogComponent {
  @Input() visible: boolean = false;
  @Input() active: number = 0;
  @Input() items: any[] = [];
  @Input() connectivityFeatureData: any;
  @Input() fatCoordinates: [number, number] | null = null;
  @Input() selectedSurveyAreaId: number | null = null;
  @Input() mvnoId: number | null = null;

  lastCreatedSplitterId: number | null = null;
  fatPublicId: string | null = null;
  fatId: number | null = null;
  surveyAreas: any[] = [];
  surveyStageName: string | null = null;
  isEditMode: boolean = false; 
  selectedNeType: string = 'SDU'; 
  selectedNeId: number | null = null;


  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() activeChange = new EventEmitter<number>();
  @Output() splitterCreated = new EventEmitter<any>();
  // @Output() fatCoordinatesChange = new EventEmitter<[number, number]>();
  @Output() openCableForm = new EventEmitter<void>();
  @Output() connectivity = new EventEmitter<{ splitterId: number, mvnoId: number, surveyAreaId: number, neType: string }>();

  availablePorts: any[] = [];
  nearbySdus: any[] = [];
  selectedPort: number | null = null;
  selectedSdu: number | null = null;
  originalPorts: any[] = [];
  originalSdus: any[] = [];

  neTypeOptions = [
    { label: 'SDU', value: 'SDU' },
    { label: 'CDU', value: 'CDU' },
    { label: 'MDU', value: 'MDU' }
  ];

  cableSpecList: any[] = [];

  constructor(public toastr: ToastrService,private apiService: ApiService) {

  }

  ngOnInit(): void {
    if (this.visible && this.connectivityFeatureData?.publicId) {
      this.fatPublicId = this.connectivityFeatureData.publicId;
      this.fetchFatById();
    }
    if (this.selectedSurveyAreaId) {
      this.loadSurveyAreas();
    }
    this.loadCableSpec();
  }

  ngOnChanges(): void {

    if (this.visible) {
      this.loadCableSpec();
    }
    // If the dialog becomes visible again dynamically
    if (this.visible && this.connectivityFeatureData?.publicId) {
      this.fatPublicId = this.connectivityFeatureData.publicId;
      this.fetchFatById();
    }
   if (this.selectedSurveyAreaId) {
    this.loadSurveyAreas();
  }

  if (this.visible && this.connectivityFeatureData?.publicId) {
    this.fatPublicId = this.connectivityFeatureData.publicId;
    this.fetchFatById();
    this.resetConnectionForm(); // ensure clean form with 1 dropdown row
  }
  }

loadSurveyAreas(): void {
   if (!this.selectedSurveyAreaId) {
    console.warn('No surveyAreaId — skipping survey area API call.');
    return;
  }

  const userId = this.apiService.getUserId();
  const mvnoId = this.apiService.getMvnoId();

  this.apiService.getsurveyArea(userId, mvnoId).subscribe({
    next: (res: any) => {
      if (res.success && res.data) {
        this.surveyAreas = res.data;

        const matchedSurvey = this.surveyAreas.find(s => s.id === this.selectedSurveyAreaId);
        if (matchedSurvey) {
          this.surveyStageName = matchedSurvey.surveyStatusName; // <-- Save dynamic status
        }
      }
    },
    error: (err) => {
      console.error('Failed to load survey areas', err);
    }
  });
}

  onNeTypeChanged() {
  // Reset connections whenever type changes
  this.resetConnectionForm();

  // Reload NEs based on selected type
  this.loadAvailablePortsAndSdus();
}

  onFatCreated(fatId: number) {
    this.fatId = fatId;
  }

fetchFatById() {
  if (!this.fatPublicId) return;

  this.apiService.getFeatureByPublicId(this.fatPublicId, 'fat').subscribe({
    next: (res: any) => {
      const coords = res?.data?.fat?.geom?.coordinates;
      if (coords) {
        this.fatCoordinates = [coords[0], coords[1]];
      }
      if (res?.data?.fat?.id) {
        this.fatId = res.data.fat.id; // <-- Set FAT id for parentNeId
      }
      // console.log('FAT coordinates fetched:', this.fatCoordinates);
    },
    error: () => {
      this.toastr.error('Failed to fetch FAT coordinates', 'Error');
    }
  });
}


  goBack() {
    if (this.active > 0) {
      this.activeChange.emit(this.active - 1);
    }
  }

  goNext() {
    if (this.active < this.items.length - 1) {
      this.activeChange.emit(this.active + 1);
    }
  }

onNeSelected(neId: number, rowIndex: number) {
  if (!neId) return;

  if (this.selectedNeType === 'CDU') {
    this.apiService.getCduHomePassesByCduId(neId).subscribe({
      next: (res: any) => {
        const all = res?.data || [];
        const available = all.filter((hp: any) => !hp.isConnected); // 👈 filter here

        this.connections.forEach(conn => {
          conn.homePasses = available;
          conn.homePassesId = null; // reset selection
        });
      }
    });
  } else if (this.selectedNeType === 'MDU') {
    this.apiService.getMduHomePassesByMduId(neId).subscribe({
      next: (res: any) => {
        const all = res?.data || [];
        const available = all.filter((hp: any) => !hp.isConnected); // 👈 filter here

        this.connections.forEach(conn => {
          conn.homePasses = available;
          conn.homePassesId = null;
        });
      }
    });
  }
}

getAvailableHomePassesForRow(rowIndex: number) {
  const usedHomePasses = this.connections
    .map(c => c.homePassesId)
    .filter(hp => hp !== null);

  const all = this.connections[rowIndex].homePasses || [];
  return all.filter(hp =>
    !usedHomePasses.includes(hp.id) || hp.id === this.connections[rowIndex].homePassesId
  );
}


onConnectivityClick() {
  const neType = this.selectedNeType;

  if (!this.lastCreatedSplitterId || !this.mvnoId || !this.selectedSurveyAreaId) {
    this.toastr.error('Missing required data for connectivity.', 'Error');
    return;
  }

  if (!this.cableSpecList.length) {
    this.toastr.error('Cable specification not loaded.', 'Error');
    return;
  }

  // Build connectivityList
  let connectivityList: any[] = [];

  if (neType === 'SDU') {
    if (this.connections.some(c => !c.portNumber || !c.sduId)) {
      this.toastr.error('Please select both port and SDU for all connections.', 'Error');
      return;
    }
    connectivityList = this.connections.map(c => ({
      portNumber: c.portNumber,
      sduId: c.sduId
    }));
  } else {
    if (this.connections.some(c => !c.portNumber || !c.homePassesId)) {
      this.toastr.error('Please select both port and Home Pass for all connections.', 'Error');
      return;
    }
    connectivityList = this.connections.map(c => ({
      portNumber: c.portNumber,
      homePassesId: c.homePassesId,
      // neId: this.selectedNeId
    }));
  }

  // Build inventoryList (same as your current logic)
  const inventoryList: any[] = [];

  // 1. Main Type (no quantity)
  const typeField = this.cableSpecList.find(f => f.paramName === 'Type');
  if (typeField) {
    inventoryList.push({
      paramId: typeField.id,
      paramName: typeField.paramName,
      paramValue: 'AERIAL CABLE',
      parentParamId: null,
      isAccessory: false,
      isMandatory: typeField.isMandatory,
      isConfiguration: typeField.isConfiguration
    });
  }

  // 2. Accessory: AERIAL CABLE (with quantity)
  const aerialCableField = this.cableSpecList.find(f => f.paramName === 'AERIAL CABLE');
  if (aerialCableField) {
    inventoryList.push({
      paramId: aerialCableField.id,
      paramName: aerialCableField.paramName,
      paramValue: '1 CORE ADSS',
      parentParamId: typeField ? typeField.id : null,
      isAccessory: true,
      isMandatory: aerialCableField.isMandatory,
      isConfiguration: aerialCableField.isConfiguration,
      quantity: 1
    });
  }


  const payload = {
    surveyAreaId: this.selectedSurveyAreaId,
    mvnoId: this.mvnoId,
    networkId: this.lastCreatedSplitterId,
    networkType: neType,
    status: this.surveyStageName,
    userId: Number(this.apiService.getUserId()),
    //  neId: this.selectedNeId, 
    connectivityList,
    inventoryList
  };

  //  Choose correct API
  const apiCall = neType === 'SDU'
    ? this.apiService.splitterWithSduConnection(payload)
    : this.apiService.splitterWithCduOrMduConnection(payload);

  apiCall.subscribe({
  next: (res: any) => {
    const remaining = res?.data?.['Remaining Elements'] ?? 0;

    if (neType === 'SDU') {


      this.toastr.success(res?.message || 'FAT connected to SDU successfully!', 'Success');

      if (remaining > 0) {
        this.toastr.info(
          `Connection completed successfully. However, ${remaining} SDUs are still waiting to be connected. Please create another splitter for the remaining connections.`,
          '',
          { timeOut: 10000 }
        );
      }
    } else {
      this.toastr.success(res?.message || `FAT connected to ${neType} successfully!`, 'Success');

      if (remaining > 0) {
        this.toastr.info(
          `Connection completed successfully. However, ${remaining} Home Passes are still waiting to be connected. Please create another splitter for the remaining connections.`,
          '',
          { timeOut: 10000 }
        );
      }
    }
      this.resetConnectionForm();
      this.visible = false;
      this.visibleChange.emit(false);
      this.connectivity.emit({
        splitterId: this.lastCreatedSplitterId!,
        mvnoId: this.mvnoId!,
        surveyAreaId: this.selectedSurveyAreaId!,
        neType
      });
    },
    error: () => {
      this.toastr.error('Failed to connect FAT to NE.');
    }
  });
}


loadAvailablePortsAndSdus() {
  if (!this.lastCreatedSplitterId || !this.selectedSurveyAreaId) return;

  // Load available ports
  this.apiService.getAvailableSplitterPorts(this.lastCreatedSplitterId).subscribe({
    next: (res: any) => {
      this.availablePorts = res?.data || [];
      this.originalPorts = [...this.availablePorts];
    }
  });

  // Load SDUs but filter by isConnected = false
  this.apiService.getNearbyNes(
    this.lastCreatedSplitterId,
    this.selectedSurveyAreaId,
    this.selectedNeType
  ).subscribe({
    next: (res: any) => {
      const allNes = res?.data || [];

      // For SDU: keep only unconnected
      if (this.selectedNeType === 'SDU') {
        this.nearbySdus = allNes.filter((s: any) => !s.isConnected);
      } else {
        // For CDU / MDU: just take them as they are
        this.nearbySdus = allNes;
      }

      this.originalSdus = [...this.nearbySdus];
    }
  });
}


  // onFatCoordinatesChange(coords: [number, number]) {
  //   this.fatCoordinatesChange.emit(coords);
  // }

onSplitterCreated(event: any) {
  const id = event?.data?.id || event?.id || null;
  console.log('Splitter created with ID:', id);
  this.lastCreatedSplitterId = id;
  this.splitterCreated.emit(event);
  this.loadAvailablePortsAndSdus();
}

connections: {
  portNumber: number | null,
  sduId?: number | null,
  neId?: number | null,
  homePasses?: any[],
  homePassesId?: number | null
}[] = [];


addConnectionRow() {
  const homePasses = this.connections[0]?.homePasses || [];

  if (this.selectedNeType === 'SDU') {
    this.connections.push({ portNumber: null, sduId: null });
  } else {
    this.connections.push({ portNumber: null, homePasses, homePassesId: null });
  }
}


removeConnectionRow(index: number) {
  this.connections.splice(index, 1);
}

canAddConnection(): boolean {
  const usedPorts = this.connections.map(c => c.portNumber);
  const usedSdus = this.connections.map(c => c.sduId);

  const availablePorts = this.availablePorts.filter(p => !usedPorts.includes(p.portNumber));
  const availableSdus = this.nearbySdus.filter(s => !usedSdus.includes(s.id));

  // Allow add only if both have at least one remaining
  return availablePorts.length > 0 && availableSdus.length > 0;
}


getAvailablePortsForRow(rowIndex: number) {
  const usedPorts = this.connections
    .map(c => c.portNumber)
    .filter(p => p !== null);
  return this.availablePorts.filter(p => !usedPorts.includes(p.portNumber) || p.portNumber === this.connections[rowIndex].portNumber);
}

getAvailableSdusForRow(rowIndex: number) {
  const usedSdus = this.connections
    .map(c => c.sduId)
    .filter(s => s !== null);
  return this.nearbySdus.filter(s => !usedSdus.includes(s.id) || s.id === this.connections[rowIndex].sduId);
}

resetConnectionForm() {
  this.selectedPort = null;
  this.selectedSdu = null;

  if (this.selectedNeType === 'SDU') {
    this.connections = [{ portNumber: null, sduId: null }];
  } else {
    this.connections = [{ portNumber: null, homePassesId: null }];
  }

  // Restore dropdown options
  this.availablePorts = [...this.originalPorts];
  this.nearbySdus = [...this.originalSdus];
}


loadCableSpec() {
  const name = 'cable';
  this.apiService.getProductCategoryByName(name).subscribe({
    next: (res: any) => {
      this.cableSpecList = res?.data?.specificationParametersDTOList || [];
      console.log('Cable specification loaded:', this.cableSpecList);
    },
    error: () => {
      this.toastr.error('Failed to load cable specification.', 'Error');
    }
  });
}



  openCableFormFromDialog() {
    this.openCableForm.emit();
  }

  closeDialog() {
    this.visibleChange.emit(false);
  }
}
