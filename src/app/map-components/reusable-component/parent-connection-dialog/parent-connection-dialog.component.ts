import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

interface NetworkElement {
  id: number;
  name?: string;
  layerCode?: string;
  layercode?: string;
  layername?: string;
  status?: string;
}
interface FeatureData {
  id: number;
  surveyAreaId: number;
  mvnoId: number;
  name?: string;
  geometry?: any;
}


@Component({
  selector: 'app-parent-connection-dialog',
  templateUrl: './parent-connection-dialog.component.html',
  styleUrls: ['./parent-connection-dialog.component.css'],
  standalone: false
})
export class ParentConnectionDialogComponent implements OnInit, OnChanges {
  @Input() featureData: any;
  @Input() selectedSurveyAreaId: number | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() connectivity = new EventEmitter<any>();
  @Output() elementSelected = new EventEmitter<{ type: 'from' | 'to', element: any }>();
  fromLayerName: string = '';
  toLayerName: string = '';

  // @Input() featureData: FeatureData | null = null;
  oltId: number | null = null;
  splitterId: number | null = null;

  nearbyElements: NetworkElement[] = [];
  selectedElementId: number | null = null;
  selectedElementToId: number | null = null;

  showParentConnectionDialog: boolean = false;
  showConnectionBuilder: boolean = false;
  connectionBuilderLayerId: number | null = null;
  connectionBuilderLayerCode: string | null = null;

  connectionTypes: any[] = [
    { label: 'Splice', value: 'Splice' },
    { label: 'Through', value: 'Through' }
  ];
  selectedConnectionType: string = ''; // Default value

  // Device details properties
  // selectedDeviceData: any = null;
  selectedDeviceData: NetworkElement | FeatureData | any | null = null;


  constructor(private http: HttpClient, private apiService: ApiService) { }

  ngOnInit() {
    this.loadNearbyElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['featureData'] || changes['visible']) {
      if (this.visible && this.featureData && this.featureData.id && this.featureData.surveyAreaId) {
        this.selectedDeviceData = this.featureData; // Set the feature data as selected device
        this.selectedElementId = this.featureData.id; // Set the element ID
        this.fromLayerName = this.featureData.layerName;
        console.log(this.fromLayerName);
        
        this.loadNearbyElements();
      }
    }
    
  }

  @Input() set visible(value: boolean) {
    this.showParentConnectionDialog = value;
  }

  get visible(): boolean {
    return this.showParentConnectionDialog;
  }
  layerCode : any = '';
loadNearbyElements() {
  if (!this.featureData?.id || !this.fromLayerName) {
    console.warn('Missing required data');
    return;
  }

  const layerConfig: any = {
    olt: 'olt',
    fdt: 'fdt'
  };

  const layerCode = layerConfig[this.fromLayerName];
  if (!layerCode) {
    console.warn(`Unsupported layer: ${this.fromLayerName}`);
    return;
  }

  const payload = {
    layerId: this.featureData.id,
    layerCode,
    surveyAreaId: this.featureData.surveyAreaId,
    mvnoId: this.apiService.getMvnoId()
  };
  console.log(payload);
  

  this.layerCode = layerCode;
  console.log('Loading nearby elements for:', { layerCode, featureId: this.featureData.id });

  this.apiService.getNearbyAllNes(payload).subscribe({
    next: (res: any) => {
      this.nearbyElements = res?.data || [];
      const clickedElement = this.nearbyElements.find(e => 
        e.id === this.featureData.id || e.name === this.featureData.name
      );
      
      if (clickedElement) {
        this.selectedElementId = clickedElement.id;
        this.selectedDeviceData = clickedElement;
        this.elementSelected.emit({ type: 'from', element: clickedElement });
      }
    },
    error: (error) => {
      console.error('Error loading nearby elements:', error);
      this.nearbyElements = [];
    }
  });
}

  openConnectionBuilder() {
    if (!this.selectedElementId) {
      console.error('No source element selected');
      return;
    }
    const selectedElement = this.nearbyElements.find(e => e.id);
   
    this.connectionBuilderLayerId = selectedElement.id;
    this.connectionBuilderLayerCode = selectedElement.layerCode || selectedElement.layername;
    
    this.showConnectionBuilder = true;
    this.closeDialog();

  }

  closeDialog() {
    this.showParentConnectionDialog = false;
    this.visibleChange.emit(false);
  }

  getNetworkDetails() {

  }
  onElementSelected(type: 'to', id: number) {
    const element = this.nearbyElements.find(e => e.id === id);
    console.log(element);
    

    if (element) {
      if (type === 'to') {
        this.selectedElementToId = id;
        this.elementSelected.emit({ type, element });
         this.toLayerName = element.layername || element.layercode || '';
         console.log( this.toLayerName);
        
      }
    }
  }

  onConnectClick() {
    if (!this.selectedElementId || !this.selectedElementToId) {
      console.error('Both source and destination must be selected');
      return;
    }

    const fromElement = this.nearbyElements.find(e => e.id === this.selectedElementId);
    const toElement = this.nearbyElements.find(e => e.id === this.selectedElementToId);
    

    const payload = {
      fromId: this.selectedElementId,
      toId: this.selectedElementToId,
      fromLayer: fromElement?.layername || fromElement?.layercode,
      toLayer: toElement?.layername || toElement?.layercode,
      surveyAreaId: this.selectedSurveyAreaId
    };

    this.connectivity.emit(payload);
    this.closeDialog();
  }
  onOltCreated(oltId: number) {
    this.oltId = oltId;
  }
  connectionType(event:any) {
    this.selectedConnectionType = event;
  }

  onSplitterCreated(event: any) {
    this.splitterId = event?.data?.id || event?.id || null;
  }

  getStatusClass(status: string): string {
    if (!status) return '';

    const statusMap: { [key: string]: string } = {
      'in progress': 'in-progress',
      'completed': 'completed',
      'active': 'active',
      'pending': 'pending',
      'approved': 'completed',
      'rejected': 'rejected'
    };

    return statusMap[status.toLowerCase()] || '';
  }


  // Add clear selection method
  onClearDeviceSelection() {
    this.selectedDeviceData = null;
    this.selectedElementId = null;
    this.selectedElementToId = null;
    this.closeDialog();

  }
  canOpenConnectionBuilder(): boolean {
    return !!this.selectedElementId;
  }
}