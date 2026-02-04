import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  sidebarShowIcon = false
  constructor() {}

  sidebar() {
    if (this.sidebarShowIcon == true) {
      this.sidebarShowIcon = false
    
    } else {
      this.sidebarShowIcon = true
    }
    console.log('Sidebar icon clicked',this.sidebarShowIcon)
  }
}
