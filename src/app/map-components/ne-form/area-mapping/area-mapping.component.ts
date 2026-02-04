import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-area-mapping',
  standalone: false,
  templateUrl: './area-mapping.component.html',
  styleUrl: './area-mapping.component.css'
})
export class AreaMappingComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() areaMappingDataChange = new EventEmitter<any>();

  areaMappingData: any = null;
  isLoading = false;
  stateVisibility: { [stateName: string]: boolean } = {};
  countryVisibility: { [countryName: string]: boolean } = {};
  districtsVisibility: { [districtName: string]: boolean } = {};

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    // this.loadAreaMappingData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.loadAreaMappingData();
    }
  }

loadAreaMappingData() {
  this.isLoading = true;
  const userId = Number(this.apiService.getUserId());
  const mvnoId = Number(this.apiService.getMvnoId());

  this.apiService.getAllAreasForUser(userId, mvnoId).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      if (res.success && res.data?.length) {
        // API now returns a countries array with nested states and districts
        this.areaMappingData = { countries: res.data };

        // Reset visibility maps
        this.stateVisibility = {};
        this.countryVisibility = {};
        this.districtsVisibility = {};

        // Build visibility maps based on nested structure
        res.data.forEach((country: any) => {
          this.countryVisibility[country.countryName] = false;

          if (country.states) {
            country.states.forEach((state: any) => {
              this.stateVisibility[state.stateName] = false;

              if (state.districts) {
                state.districts.forEach((district: any) => {
                  this.districtsVisibility[district.districtName] = false;
                });
              }
            });
          }
        });

        this.areaMappingDataChange.emit(null);
      } else {
        this.areaMappingData = null;
        this.stateVisibility = {};
        this.countryVisibility = {};
        this.districtsVisibility = {};
        this.areaMappingDataChange.emit(null);
        this.toastr.info('No area mapping data available.', 'Info');
      }
    },
    error: () => {
      this.isLoading = false;
      this.areaMappingData = null;
      this.stateVisibility = {};
      this.countryVisibility = {};
      this.districtsVisibility = {};
      this.areaMappingDataChange.emit(null);
      this.toastr.info('Unable to load area mapping data at the moment.', 'Info');
    }
  });
}


onAreaMappingCountryToggle(country: any) {
  // Get all checked countries
  const checkedCountries = this.areaMappingData.countries.filter(
    (c: any) => this.countryVisibility[c.countryName]
  );

  this.areaMappingDataChange.emit({
    country: checkedCountries,
    zoomGeom: this.countryVisibility[country.countryName] ? country.geom : null
  });
}

onAreaMappingStateToggle(state: any) {
  // Flatten states from all countries
  const allStates = this.areaMappingData.countries.flatMap((c: any) => c.states || []);
  const checkedStates = allStates.filter((s: any) => this.stateVisibility[s.stateName]);

  this.areaMappingDataChange.emit({
    state: checkedStates,
    zoomGeom: this.stateVisibility[state.stateName] ? state.geom : null
  });
}

onAreaMappingDistrictToggle(district: any) {
  // Flatten districts from all states of all countries
  const allDistricts = this.areaMappingData.countries.flatMap(
    (c: any) => (c.states || []).flatMap((s: any) => s.districts || [])
  );
  const checkedDistricts = allDistricts.filter(
    (d: any) => this.districtsVisibility[d.districtName]
  );

  this.areaMappingDataChange.emit({
    district: checkedDistricts,
    zoomGeom: this.districtsVisibility[district.districtName] ? district.geom : null
  });
}


close() {
  this.visible = false;
  this.visibleChange.emit(false);
  this.areaMappingDataChange.emit(null);

  // Reset all checkboxes
  this.stateVisibility = {};
  this.countryVisibility = {};
  this.districtsVisibility = {};
  // Optionally, reload data if you want a fresh start next open:
  // this.loadAreaMappingData();
}
}