import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-layer-dialog',
  standalone: false,
  templateUrl: './layer-dialog.component.html',
  styleUrl: './layer-dialog.component.css'
})
export class LayerDialogComponent implements OnChanges {

  @Output() layerSelected = new EventEmitter<string>();
  @Input() surveyStage: string = '';

  visible: boolean = false;
  selectedLayer: string = '';
  filteredLayerOptions: any[] = [];

  layerOptions = [
    { name: 'FAT', value: 'fat', img: 'assets/icons/fat.svg' },
    { name: 'SDU', value: 'SDU', img: 'assets/icons/sdu.svg' },
    { name: 'MDU', value: 'MDU', img: 'assets/icons/mdu.svg' },
    { name: 'CDU', value: 'CDU', img: 'assets/icons/cdu.svg' },
    { name: '8m poles', value: '8m poles', img: 'assets/icons/8m.svg' },
    { name: '10m poles', value: '10m poles', img: 'assets/icons/10m.svg' },
    { name: '12m poles', value: '12m poles', img: 'assets/icons/12m.svg' },
    { name: 'FDT', value: 'fdt', img: 'assets/icons/fdt.svg' },
    { name: 'OLT', value: 'olt', img: 'assets/icons/olt.svg' },
    { name: 'Joint Closure', value: 'jointclosure', img: 'assets/icons/joint_closure.svg' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['surveyStage']) {
      this.filterLayersByStage();
    }
  }
  
  filterLayersByStage() {
    if (this.surveyStage === 'Design') {
      // For Design stage: only show OLT, FDT, and Joint Closure
      this.filteredLayerOptions = this.layerOptions.filter(layer =>
        ['fat', 'SDU', 'MDU', 'CDU', '8m poles', '10m poles', '12m poles','olt', 'fdt', 'jointclosure'].includes(layer.value)
      );
    } else if (this.surveyStage == 'Survey') {
      // For Survey stage: only show FAT, SDU, MDU, CDU, and poles
      this.filteredLayerOptions = this.layerOptions.filter(layer =>
        ['fat', 'SDU', 'MDU', 'CDU', '8m poles', '10m poles', '12m poles'].includes(layer.value)
      );
    } else {
      // For other stages, show all options
      this.filteredLayerOptions = [...this.layerOptions];
    }
  }

  show(stage: string) {
    this.visible = true;
    this.surveyStage = stage;
    this.filterLayersByStage();
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.selectedLayer = '';
  }

  confirmSelection() {
    if (this.selectedLayer) {
      this.layerSelected.emit(this.selectedLayer);
      this.hide();
    }
  }

}
