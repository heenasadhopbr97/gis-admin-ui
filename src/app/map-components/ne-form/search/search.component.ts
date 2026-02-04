import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() placeholder: string = 'Search';
  @Input() searchService!: (query: string) => Observable<any[]>;
  
  @Output() searchResultSelected = new EventEmitter<any>();
  @Output() searchStarted = new EventEmitter<void>();

  searchQuery: string = '';
  searchResults: any[] = [];

 
  onSearchTyping(): void {
    this.searchStarted.emit();
  }

  onEnterSearch(): void {
    this.search();
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.searchService(this.searchQuery).subscribe({
      next: (results: any[]) => {
        this.searchResults = results.map(result => ({
          name: result.display_name,
          type: result.type,
          longitude: parseFloat(result.lon),
          latitude: parseFloat(result.lat),
          boundingbox: result.boundingbox
        }));
      },
      error: (error: any) => {
        console.error('Search error:', error);
        this.searchResults = [];
      }
    });
  }

  selectResult(result: any): void {
    this.searchResultSelected.emit(result);
    this.searchResults = [];
  }

}
