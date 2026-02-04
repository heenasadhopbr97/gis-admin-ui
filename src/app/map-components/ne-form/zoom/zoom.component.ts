import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-zoom',
  standalone: false,
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.css'
})
export class ZoomComponent {
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() centerMap = new EventEmitter<{ lat: number, lng: number }>();
  
  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.centerMap.emit({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location', error);
    }
  }
  

}