import { Component, EventEmitter, Input, Output } from '@angular/core';

interface ElementSelectionEvent {
  type: "from" | "to";
  element: any;
}
interface NearbyElement {
  id: number;
  name: string;
  layername: string;
  geom: {
    type: string;
    coordinates: number[];
  };
  mvnoId?: string; // Optional property
}

@Component({
  selector: 'app-nearby-elements-dialog',
  standalone: false,
  templateUrl: './nearby-elements-dialog.component.html',
  styleUrl: './nearby-elements-dialog.component.css'
})
export class NearbyElementsDialogComponent {

  @Input() visible: boolean = false;
  @Input() nearbyElements: NearbyElement[] = [];
  @Input() isLoading: boolean = false;
  @Input() selectionMode: 'source' | 'destination' = 'source'; 
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() elementSelected = new EventEmitter<ElementSelectionEvent>();
  @Output() close = new EventEmitter<void>();

  // Group elements by type for better display
  get groupedElements(): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};
  
  (this.nearbyElements as any[]).forEach(element => {
    const type = element.layername || 'unknown';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(element);
  });
  
  return grouped;
  }

  // Get display name for element types
  getTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'splitter': 'Splitter',
      'jointclosure': 'Joint Closure',
      'olt': 'OLT',
      'fat': 'FAT',
      'fdt': 'FDT',
      'unknown': 'Unknown'
    };
    
    return typeMap[type] || type;
  }

  onElementSelect(element: NearbyElement): void {
       const type = this.selectionMode === 'source' ? 'from' : 'to';
    this.elementSelected.emit({ 
      type: type,
      element: element
    });
  }

  onClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.close.emit();
  }

   getElementIcon(layerName: string): string {
    const iconMap: { [key: string]: string } = {
      'splitter': 'assets/icons/splitter.svg',
      'jointclosure': 'assets/icons/joint_closure.svg',
      'olt': 'assets/icons/olt.svg',
      'fat': 'assets/icons/fat.svg',
      'fdt': 'assets/icons/fdt.svg',
      'unknown': 'assets/icons/default.svg'
    };
    
    return iconMap[layerName] || iconMap['unknown'];
  }

   getCoordinates(element: NearbyElement): string {
    if (element.geom && element.geom.coordinates) {
      return `${element.geom.coordinates[0].toFixed(6)}, ${element.geom.coordinates[1].toFixed(6)}`;
    }
    return 'No coordinates';
  }

  Object = Object;

}