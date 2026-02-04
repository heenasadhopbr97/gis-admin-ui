import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

@Injectable({
  providedIn: 'root'
})
export class MapBackgroundService {

 private backgroundLayers: { [key: string]: TileLayer } = {};

  constructor() {
    this.initializeLayers();
  }

  private initializeLayers(): void {
    // OpenStreetMap Layer
    this.backgroundLayers['openstreetmap'] = new TileLayer({
      source: new OSM(),
      properties: { name: 'openstreetmap' }
    });

    // Google Maps Layer (using XYZ source)
    this.backgroundLayers['googlemap'] = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions: 'Google Maps'
      }),
      properties: { name: 'googlemap' }
    });
  }

  getBackgroundLayers(): { [key: string]: TileLayer } {
    return this.backgroundLayers;
  }

  getLayer(backgroundType: string): TileLayer | null {
    return this.backgroundLayers[backgroundType] || null;
  }
}
