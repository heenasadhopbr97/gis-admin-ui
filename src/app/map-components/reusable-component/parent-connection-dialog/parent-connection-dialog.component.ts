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
  @Input() selectedSurveyAreaId: number | null = null;
  @Input() sourceElement: any;
  @Input() destinationElement: any;
  @Input() nearbyElements: any[] = [];

  @Output() mapSelectionRequested = new EventEmitter<void>();
  @Output() destinationSelected = new EventEmitter<any>();
  @Output() highlightElement = new EventEmitter<number>();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() connectivity = new EventEmitter<any>();
  @Output() elementSelected = new EventEmitter<{ type: 'from' | 'to', element: any, geom?: any }>();
  fromLayerName: string = '';
  toLayerName: string = '';

  // @Input() featureData: FeatureData | null = null;
  oltId: number | null = null;
  splitterId: number | null = null;

  selectedElementId: number | null = null;
  selectedElementToId: number | null = null;

  showParentConnectionDialog: boolean = false;
  showConnectionBuilder: boolean = false;
  connectionBuilderLayerId: number | null = null;
  connectionBuilderLayerCode: string | null = null;

  sourceDeviceData: any = null;
  destinationDeviceData: any = null;

  connectionTypes: any[] = [
    { label: 'Splice', value: 'Splice' },
    { label: 'Through', value: 'Through' }
  ];
  selectedConnectionType: string = ''; // Default value

  // Device details properties
  selectedDeviceData: NetworkElement | FeatureData | any | null = null;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle source element changes
    if (changes['sourceElement'] && this.sourceElement) {
      this.sourceDeviceData = this.sourceElement;
      this.fromLayerName = this.sourceElement.layername || this.sourceElement.layerName || '';
      if (this.sourceElement) {
        this.selectedElementId = this.sourceElement.id;
        if (this.sourceElement.id) {
          this.highlightElement.emit(this.sourceElement.id);
        }
      }
    }
    if (changes['destinationElement'] && this.destinationElement) {
       this.destinationDeviceData = this.destinationElement;
      this.toLayerName = this.destinationElement.layername || this.destinationElement.layerName || '';
      this.selectedElementToId = this.sourceElement.id;
    if (this.destinationElement) {
      if (this.destinationElement.id) {
        this.highlightElement.emit(this.destinationElement.id);
      }
    }
  }
  }

  selectDestinationOnMap() {
    this.showParentConnectionDialog = false;
    this.visibleChange.emit(false);
    this.mapSelectionRequested.emit();
  }

  clearDestination() {
    this.destinationDeviceData = null;
    this.selectedElementToId = null;
    this.toLayerName = '';
    this.elementSelected.emit({ type: 'to', element: null });

    // Emit event to remove highlight from map
    this.highlightElement.emit(null);
  }

  @Input() set visible(value: boolean) {
    this.showParentConnectionDialog = value;
  }

  get visible(): boolean {
    return this.showParentConnectionDialog;
  }

  closeDialog() {
    this.showParentConnectionDialog = false;
    this.visibleChange.emit(false);
  }

  onElementSelected(type: 'to', id: number) {
    const element = this.nearbyElements.find(e => e.id === id);
    if (element) {
      if (type === 'to') {
        this.selectedElementToId = id;
        this.destinationDeviceData = element;
        this.elementSelected.emit({ type, element });
        this.toLayerName = element.layername || element.layercode || '';

        // Highlight the selected element on the map
        this.highlightElement.emit(id);

        // Reopen the dialog to show the selected destination
        this.showParentConnectionDialog = true;

      }
    }
  }

  onConnectClick() {

    this.showConnectionBuilder = true
    const fromElement = this.nearbyElements.find(e => e.id === this.selectedElementId);
    const toElement = this.nearbyElements.find(e => e.id === this.selectedElementToId);
    console.log(fromElement, toElement);
    console.log(this.sourceDeviceData, this.destinationDeviceData);

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
  connectionType(event: any) {
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


}