import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-details',
  standalone: false,
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.css'
})
export class DeviceDetailsComponent {
 @Input() visible: boolean = false;
  @Input() deviceData: any;
  @Input() mvnoId: number = 12; // Default MVNO ID
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() clearSelection = new EventEmitter<void>();

  deviceDetails: any = null;
  isLoading: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService) {}

  ngOnChanges() {
    if (this.visible && this.deviceData && this.deviceData.publicId) {
      this.loadDeviceDetails();
    }
  }

  loadDeviceDetails() {
    if (!this.deviceData?.publicId) return;

    this.isLoading = true;
    this.error = '';
    let payload = {
      publicId :  this.deviceData.publicId,
      mvnoId: this.apiService.getMvnoId()
    }
     this.apiService.viewElementData(payload)
      .subscribe({
        next: (response: any) => {
          this.deviceDetails = response;
          this.isLoading = false;
        },
        error: (error:any) => {
          this.error = 'Failed to load device details';
          this.isLoading = false;
          console.error('Error loading device details:', error);
        }
      });
  }

  onClearSelection() {
    this.deviceDetails = null;
    this.deviceData = null;
    this.clearSelection.emit();
    this.closeDialog();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getDeviceStatus(): string {
    if (!this.deviceData) return '';
    
    switch (this.deviceData.statusId) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Active';
      case 4: return 'Completed';
      case 5: return 'Rejected';
      default: return 'Unknown';
    }
  }

  // Add this method to device-details.component.ts
getStatusClass(): string {
  if (!this.deviceData) return '';
  
  switch (this.deviceData.statusId) {
    case 1: return 'pending';    // Pending
    case 2: return 'active';     // Approved
    case 3: return 'active';     // Active
    case 4: return 'completed';  // Completed
    case 5: return 'rejected';   // Rejected
    default: return '';
  }
}
}
