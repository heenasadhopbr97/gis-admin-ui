import { Component, EventEmitter, Output } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';

@Component({
  selector: 'app-map-background-switcher',
  templateUrl: './map-background-switcher.component.html',
  styleUrls: ['./map-background-switcher.component.css'],
  standalone: false
})
export class MapBackgroundSwitcherComponent {
  @Output() backgroundChanged = new EventEmitter();
  selectedBackground = 'openstreetmap';
   private basemapLayer!: TileLayer<OSM | XYZ>;
  basemapVisible = true;
  
    backgroundOptions = [
    { value: 'openstreetmap', label: 'ESRI World Street Map' },
    { value: 'googlemap', label: 'Google' },
    { value: 'google-satellite', label: 'Satellite' },
    { value: 'esri-topo', label: 'ESRI World Topo Map' },
    { value: 'esri-gray', label: 'ESRI Light Gray Canvas' },
    { value: 'cartodb-positron', label: 'CartoDB Positron (CAD Style)' },
    { value: 'esri-natgeo', label: 'ESRI National Geographic' }
  ];

  
  // ngAfterViewInit() {
  //     this.layer.setVisible(true);
  // }

  onBackgroundChange() {
    // this.backgroundChanged.emit({key: [this.selectedBackground, this.backgroundOptions]});
    this.backgroundChanged.emit({
        selectedBackground: this.selectedBackground,
        backgroundOptions: this.backgroundOptions
      });
  }

    toggleBasemap(): void {
    this.basemapVisible = !this.basemapVisible;
    this.basemapLayer.setVisible(this.basemapVisible);
  }

}