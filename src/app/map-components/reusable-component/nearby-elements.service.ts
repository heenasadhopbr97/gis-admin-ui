// nearby-elements.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NearbyElementsService {
  private nearbyElementsSubject = new BehaviorSubject<any>(null);
  nearbyElements$ = this.nearbyElementsSubject.asObservable();

  setNearbyElements(elements: any) {
    this.nearbyElementsSubject.next(elements);
  }

  getNearbyElements() {
    return this.nearbyElementsSubject.value;
  }

  clearNearbyElements() {
    this.nearbyElementsSubject.next(null);
  }
}