// connection-builder.component.ts
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { NearbyElementsService } from '../../nearby-elements.service';

@Component({
  selector: 'app-connection-builder',
  templateUrl: './connection-builder.component.html',
  styleUrls: ['./connection-builder.component.css'],
  standalone: false
})
export class ConnectionBuilderComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() layerId: number;
  @Input() layerCode: string;
  @Input() fromSelectedElement: any;
  @Input() toSelectedElement: any;
  @Input() surveyAreaId: number;
  @Input() connectionType: string;
  @Input() fromLayerName: string;
  @Input() toLayerName: string; 
     public nearbyElements: any = null;
  public selectedElement: any = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() connectionCreated = new EventEmitter<any>();

  // OLT Data - dynamic
  oltData = {
    id: '',
    ports: '',
    available: 0,
    connected: 0,
    selectedPorts: [] as number[],
    portGrid: [] as number[][],
    allPorts: [] as any[]
  };

  // Cable Data - dynamic
  cableData = {
    id: '',
    availableCores: 0,
    totalCores: 0,
    selectedCores: [] as any[],
    coreGrid: [] as any[][],
    allCores: [] as any[],
    selectedCableId: null as any
  };

  // JC Data - dynamic
  jcData = {
    id: '',
    ports: '',
    available: 0,
    connected: 0,
    selectedPorts: [] as number[],
    portGrid: [] as number[][],
    allPorts: [] as any[]
  };

  // Cable list from API
  availableCables: any[] = [];
  selectedCable: any = null;
  isLoadingCablesList: boolean = false;

  isLoading = false;
  isLoadingCables = false;
  isLoadingJC = false;
  errorMessage = '';
  activeTab: 'from' | 'cables' | 'to' = 'from';

  isCreatingConnection = false;
  successMessage = '';

  constructor(private apiService: ApiService, private toastr: ToastrService,private nearbyElementsService: NearbyElementsService) { }

  ngOnInit() {
    if (this.visible && this.layerId) {
      this.loadAllData();
    }
     this.nearbyElementsService.nearbyElements$.subscribe(elements => {
      this.nearbyElements = elements;
      console.log('Received nearby elements:', this.nearbyElements);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.visible && this.layerId) {
      this.loadAllData();
    }
      if (changes['fromLayerName']) {
      console.log(this.fromLayerName);
      
    }
      if (changes['nearbyElementsData'] && changes['nearbyElementsData'].currentValue) {
      this.nearbyElements = changes['nearbyElementsData'].currentValue;
    }
   
     
  }

  loadAllData() {
   this.loadFromDeviceData(); // Changed from loadOltData
  this.loadAvailableCables();
  this.loadToDeviceData();
  }

  getTabDisplayName(tabType: 'from' | 'to'): string {
  const layerName = tabType === 'from' ? this.fromLayerName : this.toLayerName;
  return layerName ? layerName.toUpperCase() : (tabType === 'from' ? 'FROM' : 'TO');
}

  loadAvailableCables() {
    this.isLoadingCablesList = true;
 let payload = {
    fromLayerId: this.fromSelectedElement,
    fromLayerCode: this.fromLayerName,
    toLayerId: this.toSelectedElement,
    toLayerCode: this.toLayerName,
    mvnoId: this.apiService.getMvnoId()
  };

    this.apiService.getNearBycableForConnectivity(payload).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.availableCables = response.data || [];

          // Auto-select the first cable if available
          if (this.availableCables.length > 0) {
            this.onCableSelected(this.availableCables[0].cableId);
          }
        } else {
          console.error('Failed to load available cables:', response.message);
        }
        this.isLoadingCablesList = false;
      },
      error: (error: any) => {
        console.error('Error loading available cables:', error);
        this.isLoadingCablesList = false;
      }
    });
  }

  onCableSelected(cableId: number) {
    this.cableData.selectedCableId = cableId;

    this.selectedCable = this.availableCables.find(c => c.cableId === cableId);

    this.loadCableCoresData();
  }

  loadFromDeviceData() {
  this.isLoading = true;
  this.errorMessage = '';

  const payload = {
    layerId: this.fromSelectedElement,
    layerCode: this.getLayerCode(this.fromLayerName)
  };
  console.log(payload);
  

  this.apiService.oltNetworkPort(payload).subscribe({
    next: (ports: any) => {
      this.processFromDeviceData(ports);
      this.isLoading = false;
    },
    error: (error: any) => {
      this.errorMessage = `Failed to load ${this.fromLayerName} ports data`;
      this.isLoading = false;
      console.error(`Error loading ${this.fromLayerName} ports:`, error);
    }
  });
}

loadToDeviceData() {
  this.isLoadingJC = true;

  const payload = {
    layerId: this.toSelectedElement,
    layerCode: this.getLayerCode(this.toLayerName)
  };
  console.log(payload);
  
   if (this.toLayerName?.toLowerCase() == 'fdt') {
    console.log(payload);

    // Use FDT API
    this.apiService.fdtNetworkPort(payload).subscribe({
      next: (ports: any) => {
        this.processToDeviceData(ports);
        this.isLoadingJC = false;
      },
      error: (error: any) => {
        console.error(`Error loading FDT ports:`, error);
        this.isLoadingJC = false;
      }
    });
  } else {
    console.log(payload);
    
    // Use Joint Closure API (default)
    this.apiService.toNetworkPort(payload).subscribe({
      next: (ports: any) => {
        this.processToDeviceData(ports);
        this.isLoadingJC = false;
      },
      error: (error: any) => {
        console.error(`Error loading JC ports:`, error);
        this.isLoadingJC = false;
      }
    });
  }
}

private getLayerCode(layerName: string): string {
  const layerCodeMap: { [key: string]: string } = {
    'olt': 'oltcard',
    'fdt': 'fdttray',
    'jointclosure': 'jointclosure',
    'fdt_tray': 'fdttray',
    'fdt_tray_port': 'fdttrayport',
    // Add more mappings as needed
  };
  return layerCodeMap[layerName?.toLowerCase()];
}

processFromDeviceData(ports: any[]) {
  this.oltData.allPorts = ports;
  const availablePorts = ports.filter(port => port.portStatus === 'Available');
  const occupiedPorts = ports.filter(port => port.portStatus === 'Occupied');

  this.oltData.available = availablePorts.length;
  this.oltData.connected = occupiedPorts.length;

  const portNumbers = ports.map(port => port.portNumber);
  const maxPort = Math.max(...portNumbers);

  this.oltData.ports = `1-${maxPort}`;
  this.oltData.id = `${this.fromLayerName.toUpperCase()}-${this.layerId}`;
  this.oltData.portGrid = this.createPortGrid(ports, 8);
}


  loadCableCoresData() {
    if (!this.cableData.selectedCableId) return;

    this.isLoadingCables = true;
    const payload = {
      cableId: this.cableData.selectedCableId,
      mvnoId: this.apiService.getMvnoId()
    };
    this.apiService.connectivityCableCores(payload).subscribe({
      next: (response: any) => {

        if (response.success) {
          this.processCableCoresData(response.data);
        } else {
          console.error('Failed to load cable cores:', response.message);
        }
        this.isLoadingCables = false;
      },
      error: (error: any) => {
        console.error('Error loading cable cores:', error);
        this.isLoadingCables = false;
      }
    });
  }

  processToDeviceData(ports: any[]) {
  this.jcData.allPorts = ports;
  const availablePorts = ports.filter(port => port.portStatus === 'Available');
  const occupiedPorts = ports.filter(port => port.portStatus === 'Occupied');

  this.jcData.available = availablePorts.length;
  this.jcData.connected = occupiedPorts.length;

  const portNumbers = ports.map(port => port.portNumber);
  const maxPort = Math.max(...portNumbers);

  this.jcData.ports = `1-${maxPort}`;
  this.jcData.id = `${this.toLayerName.toUpperCase()}-${this.layerId}`;
  this.jcData.portGrid = this.createPortGrid(ports, 8);
}

  loadJcData() {
    this.isLoadingJC = true;

    const payload = {
      layerId: this.toSelectedElement,
      layerCode: "jointclosure"
    };

    this.apiService.toNetworkPort(payload).subscribe({
      next: (ports: any) => {
        this.processJcData(ports);
        this.isLoadingJC = false;
      },
      error: (error: any) => {
        console.error('Error loading JC ports:', error);
        this.isLoadingJC = false;
      }
    });
  }

  processOltData(ports: any[]) {
    this.oltData.allPorts = ports;
    const availablePorts = ports.filter(port => port.portStatus === 'Available');
    const occupiedPorts = ports.filter(port => port.portStatus === 'Occupied');

    this.oltData.available = availablePorts.length;
    this.oltData.connected = occupiedPorts.length;

    const portNumbers = ports.map(port => port.portNumber);
    const maxPort = Math.max(...portNumbers);

    this.oltData.ports = `1-${maxPort}`;
    this.oltData.id = `OLT-${this.layerId}`;
    this.oltData.portGrid = this.createPortGrid(ports, 8);
  }

  processJcData(ports: any[]) {
    this.jcData.allPorts = ports;
    const availablePorts = ports.filter(port => port.portStatus === 'Available');
    const occupiedPorts = ports.filter(port => port.portStatus === 'Occupied');

    this.jcData.available = availablePorts.length;
    this.jcData.connected = occupiedPorts.length;

    const portNumbers = ports.map(port => port.portNumber);
    const maxPort = Math.max(...portNumbers);

    this.jcData.ports = `1-${maxPort}`;
    this.jcData.id = `JC-${this.layerId}`;
    this.jcData.portGrid = this.createPortGrid(ports, 8);
  }

  processCableCoresData(cores: any[]) {
   this.cableData.allCores = cores;
    const availableCores = cores.filter(core => core.coreStatus === 'Available');
    const occupiedCores = cores.filter(core => core.coreStatus !== 'Available');

    this.cableData.availableCores = availableCores.length;
    this.cableData.totalCores = cores.length;

    if (cores.length > 0 && this.selectedCable) {
      this.cableData.id = `${this.selectedCable.name}`;
    } else {
      this.cableData.id = 'Fiber Cable';
    }

    this.cableData.coreGrid = this.createCoreGrid(cores, 9);
    
    // Clear previous selections when loading new cable cores
    this.cableData.selectedCores = [];
  }

  createPortGrid(ports: any[], columns: number): number[][] {
    const grid: number[][] = [];
    const portNumbers = ports.map(port => port.portNumber);
    const maxPort = Math.max(...portNumbers);

    for (let i = 1; i <= maxPort; i++) {
      const rowIndex = Math.floor((i - 1) / columns);

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      grid[rowIndex].push(portNumbers.includes(i) ? i : 0);
    }

    return grid;
  }

  createCoreGrid(cores: any[], columns: number): any[][] {
    const grid: any[][] = [];
    const coreNumbers = cores.map(core => core.coreNumber);
    const maxCore = Math.max(...coreNumbers);

    for (let i = 1; i <= maxCore; i++) {
      const rowIndex = Math.floor((i - 1) / columns);

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      const core = cores.find(c => c.coreNumber === i);
      grid[rowIndex].push(core || { coreNumber: i, coreStatus: 'Empty' });
    }

    return grid;
  }

  getPortStatus(portNumber: number, type: 'from' | 'to'): string {
  if (portNumber === 0) return 'empty';
  const ports = type === 'from' ? this.oltData.allPorts : this.jcData.allPorts;
  const port = ports.find(p => p.portNumber === portNumber);
  return port ? port.portStatus : 'empty';
}

  getCoreStatus(coreNumber: number): string {
    const core = this.cableData.allCores.find(c => c.coreNumber === coreNumber);
    return core ? core.coreStatus : 'Empty';
  }

  togglePortSelection(portNumber: number, type: 'from' | 'to') {
  if (portNumber === 0) return;

  const selectedPorts = type === 'from' ? this.oltData.selectedPorts : this.jcData.selectedPorts;
  const index = selectedPorts.indexOf(portNumber);

  if (index > -1) {
    selectedPorts.splice(index, 1);
  } else {
    selectedPorts.push(portNumber);
  }
}

  toggleCoreSelection(core: any) {
       if (core.coreStatus !== 'Available') return;

    const index = this.cableData.selectedCores.findIndex(
      selectedCore => selectedCore.cableCoreId === core.cableCoreId
    );

    if (index > -1) {
      this.cableData.selectedCores.splice(index, 1);
    } else {
      // For single selection, clear previous selections first
      if (this.cableData.selectedCores.length > 0) {
        this.cableData.selectedCores = [];
      }
      this.cableData.selectedCores.push(core);
    }
    

  }

 selectAllAvailable(type: 'from' | 'to') {
  const ports = type === 'from' ? this.oltData.allPorts : this.jcData.allPorts;
  const selectedPorts = type === 'from' ? this.oltData.selectedPorts : this.jcData.selectedPorts;

  const availablePorts = ports
    .filter(port => port.portStatus === 'Available')
    .map(port => port.portNumber);

  selectedPorts.splice(0, selectedPorts.length, ...availablePorts);
}

  selectAllAvailableCores() {
     const availableCores = this.cableData.allCores
      .filter(core => core.coreStatus === 'Available');

    this.cableData.selectedCores = [...availableCores];
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getPortRangeText(ports: number[]): string {
    if (ports.length === 0) return 'No ports selected';
    ports.sort((a, b) => a - b);
    const ranges = [];
    let start = ports[0];
    let end = ports[0];

    for (let i = 1; i < ports.length; i++) {
      if (ports[i] === end + 1) {
        end = ports[i];
      } else {
        ranges.push(start === end ? start : `${start}-${end}`);
        start = ports[i];
        end = ports[i];
      }
    }

    ranges.push(start === end ? start : `${start}-${end}`);
    return `Ports ${ranges.join(', ')}`;
  }

   getCoreRangeText(): string {
    if (this.cableData.selectedCores.length === 0) return 'No cores selected';
    
    const coreNumbers = this.cableData.selectedCores.map(core => core.coreNumber);
    coreNumbers.sort((a, b) => a - b);
    
    const ranges = [];
    let start = coreNumbers[0];
    let end = coreNumbers[0];

    for (let i = 1; i < coreNumbers.length; i++) {
      if (coreNumbers[i] === end + 1) {
        end = coreNumbers[i];
      } else {
        ranges.push(start === end ? start : `${start}-${end}`);
        start = coreNumbers[i];
        end = coreNumbers[i];
      }
    }

    ranges.push(start === end ? start : `${start}-${end}`);
    return `Cores ${ranges.join(', ')}`;
  }


  createConnection() {
    // Validate all selections
    if (!this.validateSelections()) {
      this.errorMessage = 'Please select all required components: OLT port, Cable core, and JC port';
      return;
    }

    this.isCreatingConnection = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildConnectionPayload();
    
    this.apiService.createConnectivity(payload).subscribe({
      next: (response: any) => {
        this.isCreatingConnection = false;
        if (response.success) {
          this.successMessage = 'Connection created successfully!';
          this.connectionCreated.emit(response.data);
          // Optionally close the dialog after successful creation
          // setTimeout(() => this.closeDialog(), 2000);
          this.closeDialog();
          this.toastr.success(response.message, 'Success');

        } else {
          this.errorMessage = response.message || 'Failed to create connection';
        }
      },
      error: (error: any) => {
        this.isCreatingConnection = false;
        this.errorMessage = 'Error creating connection: ' + error.message;
        console.error('Error creating connection:', error);
      }
    });
  }

  buildConnectionPayload(): any {
  const selectedFromPort = this.oltData.allPorts.find(
    port => port.portNumber === this.oltData.selectedPorts[0]
  );

  const selectedToPort = this.jcData.allPorts.find(
    port => port.portNumber === this.jcData.selectedPorts[0]
  );

  const selectedCableCore = this.cableData.selectedCores.length > 0 
    ? this.cableData.selectedCores[0] 
    : null;

  return {
    cableId: this.cableData.selectedCableId,
    cableCoreId: selectedCableCore?.cableCoreId,
    fromLayerId: this.fromSelectedElement,
    fromLayerType: this.getLayerCode(this.fromLayerName),
    fromPortId: selectedFromPort?.id || 0,
    toLayerId: this.toSelectedElement,
    toLayerType: this.getLayerCode(this.toLayerName),
    toPortId: selectedToPort?.id || 0,
    closureId: null,
    closureType: null,
    connectionType: this.connectionType || "Through",
    description: `Connection from ${this.fromLayerName} port ${this.oltData.selectedPorts[0]} to ${this.toLayerName} port ${this.jcData.selectedPorts[0]} via cable core ${this.cableData.selectedCores[0]?.coreNumber}`,
    surveyAreaId: this.surveyAreaId,
    mvnoId: this.apiService.getMvnoId(),
    userId: this.apiService.getUserId(),
  };
}

  validateSelections(): boolean {
    return (
      this.oltData.selectedPorts.length > 0 &&
      this.cableData.selectedCores.length > 0 &&
      // this.jcData.selectedPorts.length > 0 &&
      this.cableData.selectedCableId !== null
    );
  }

  isCoreSelected(core: any): boolean {
  return this.cableData.selectedCores.some(
    selectedCore => selectedCore.cableCoreId === core.cableCoreId
  );
}

getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

   formatElementType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'ne_joint_closure': 'Joint Closure',
      'ne_olt': 'OLT',
      'ne_fat': 'FAT',
      'ne_fdt': 'FDT',
      'ne_splitter': 'Splitter',
      'ne_cable': 'Cable'
    };
    return typeMap[type] || type.replace('ne_', '').toUpperCase();
  }

  isElementSelected(element: any): boolean {
    return this.selectedElement && this.selectedElement.id === element.id && this.selectedElement.layername === element.layername;
  }

    onElementSelected(element: any): void {
    this.selectedElement = element;
    
    // You can automatically populate fields based on the selected element
    this.populateFieldsFromElement(element);
    
    // Or you can just log it for now
    console.log('Selected element:', element);
  }

   private populateFieldsFromElement(element: any): void {
    const elementType = element.layername;
    
    switch (elementType) {
      case 'ne_olt':
        // Populate OLT fields
        this.oltData.id = element.name;
        this.activeTab = 'from';
        break;
        
      case 'ne_joint_closure':
        // Populate Joint Closure fields
        this.jcData.id = element.name;
        this.activeTab = 'to';
        break;
        
      case 'ne_fat':
        // Populate FAT fields
        // You might need to adjust this based on your data structure
        break;
        
      default:
        console.log('Unknown element type:', elementType);
    }
  }

    // Or if passed as input:
  @Input() set nearbyElementsData(data: any) {
    this.nearbyElements = data;
}

 

}