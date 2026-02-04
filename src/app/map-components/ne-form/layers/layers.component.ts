import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Feature from 'ol/Feature';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
import { MapService } from '../../map.service';

export interface LayerConfig {
  name: string;
  displayName?: string;
  visible: boolean;
  img?: string;
  layer?: any;
}

export interface SurveyArea {
  id: number;
  name: string;
}

export interface LayerToggleEvent {
  name: string;
  visible: boolean;
}

export interface SurveyAreaToggleEvent {
  area: SurveyArea;
  visible: boolean;
}

@Component({
  selector: 'app-layers',
  standalone: false,
  templateUrl: './layers.component.html',
  styleUrl: './layers.component.css'
})
export class LayersComponent {
  @Input() isShowLayers: boolean = false;
  @Input() layers: any[] = [];
  @Input() surveyAreas: any[] = [];
  @Input() selectedSurveyAreas: { [id: number]: boolean } = {};
  @Input() isLoading: boolean = false;
  @Input() layerFeatures: { [key: string]: any[] } = {};
  @Input() selectedFeatures: { [key: string]: Set<string> } = {};
  @Input() layerNames: { [layer: string]: string } = {};
  @Input() countiesList: any = [];
  @Input() districtsList: any = [];
  @Input() isSurveyLayerVisible: boolean = false;

  @Output() layerToggle = new EventEmitter<{ name: string, visible: boolean }>();
  @Output() surveyAreaToggle = new EventEmitter<{ area: any, visible: boolean }>();
  @Output() featureToggle = new EventEmitter<{ layer: string, featureId: string, visible: boolean }>();
  @Output() allFeaturesToggle = new EventEmitter<{ layer: string, visible: boolean }>();
  @Output() countryBorderLoaded = new EventEmitter<any[]>();
  public featureVisibility: { [layer: string]: { [featureId: string]: boolean } } = {};
  public countyVisibility: { [adm1Name: string]: boolean } = {};
  public districtVisibility: { [adm2Name: string]: boolean } = {};

  @Output() countryBorderToggle = new EventEmitter<{ visible: boolean, name: string }>();
  @Output() mouseLeave = new EventEmitter<void>();
  @Output() countyToggle = new EventEmitter<{ county: any, visible: boolean }>();
  @Output() districtToggle = new EventEmitter<{ district: any, visible: boolean }>();
  @Output() areaMappingDataChange = new EventEmitter<any>();


  // public isSurveyLayerVisible: boolean = true;

  surveyList: any[] = [];
  userOptions: any[] = [];
  selectedSurveys: any[] = [];
  filteredSurveys: any[] = [];
  first: number = 0;
  rowsPerPage: number = 10;
  totalRecords: number = 0;
  surveyStatusOptions: { id: number, name: string }[] = [];

  countyborderError: string | null = null;
  countryBorder: any[] = [];
  // Add these new properties
  surveySearchTerm: string = '';
  filteredSurveyAreas: any[] = [];
  hasSurveyViewPermission: boolean = false;

  showAreaMapping: boolean = false;
  areaMappingData: any = null;
  stateVisibility: { [stateName: string]: boolean } = {};

  countryVisibility: { [countryName: string]: boolean } = {};
  districtsVisibility: { [districtName: string]: boolean } = {};


  constructor(private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService, private mapService: MapService,) {
  }

  ngOnInit() {
    this.loadCounties();
    this.loadDistricts();
    this.filteredSurveyAreas = [...this.surveyAreas];
    this.checkSurveyViewPermission();
  }


  checkSurveyViewPermission() {
    this.mapService.getMethod('/acl/getAclEntry').subscribe((res: any) => {
      const aclEntries = res?.dataList || [];

      // Check if the required permission code exists
      this.hasSurveyViewPermission = aclEntries.some(
        (entry: any) => entry.code === 'survey_management_survey_view'
      );
    });
  }

  loadCounties() {
    this.isLoading = true;
    this.apiService.getCounties().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => this.countiesList = data,
      error: (err) => {
        console.error(err);
        this.toastr.error(err.message || 'Failed to load counties');
        if (err.status === 500) {
          this.toastr.info('Server error - please try again later');
        }
      }
    });
  }


  loadDistricts() {
    this.apiService.getDistricts().subscribe(data => {
      this.districtsList = data; // Assuming data is in format: [{ adm2Name: "District 1", ... }]
    });
  }


  ngOnChanges() {
    if (this.layerFeatures) {
      Object.keys(this.layerFeatures).forEach(layer => {
        if (!this.featureVisibility[layer]) {
          this.featureVisibility[layer] = {};
        }
        this.layerFeatures[layer].forEach(feature => {
          if (this.featureVisibility[layer][feature.publicId] === undefined) {
            // Default to visible if not set
            this.featureVisibility[layer][feature.publicId] = true;
          }
        });
      });
    }
    if (this.surveyAreas) {
      this.filterSurveyAreas();
    }
  }

  filterSurveyAreas() {
    if (!this.surveySearchTerm) {
      this.filteredSurveyAreas = [...this.surveyAreas];
    } else {
      const searchTerm = this.surveySearchTerm.toLowerCase();
      this.filteredSurveyAreas = this.surveyAreas.filter(area =>
        area.name.toLowerCase().includes(searchTerm)
      );
    }
  }

toggleCounty(event: Event, county: any) {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.countyVisibility[county.adm1Name] = isChecked;
  this.countyToggle.emit({ county, visible: isChecked });
}

toggleDistrict(event: Event, district: any) {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.districtVisibility[district.adm2Name] = isChecked;
  this.districtToggle.emit({ district, visible: isChecked });
}


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Only hide if Layers panel is open and click is outside the panel and button
    if (
      this.isShowLayers &&
      !target.closest('.layers-panel') &&
      !target.closest('.layer-controls button')
    ) {
      this.isShowLayers = false;
    }
  }

  toggleLayer(event: Event, layer: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.layerToggle.emit({ name: layer.name, visible: isChecked });

    // Emit toggle event for all layers
    if (['countryBorder', 'counties', 'districts'].includes(layer.name)) {
      this.countryBorderToggle.emit({ visible: isChecked, name: layer.name });
    }

    if (layer.name === 'surveyArea') {
      this.isSurveyLayerVisible = isChecked;
    }  
  }

  isAnyBaseLayerVisible(): boolean {
    return this.layers.some(layer => layer.visible);
  }

  isAnySurveyAreaSelected(): boolean {
    return Object.values(this.selectedSurveyAreas).some(selected => selected);
  }


  toggleSurveyArea(event: Event, area: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.surveyAreaToggle.emit({ area, visible: isChecked });
  }

  // Add these new methods
  toggleFeature(event: Event, layer: string, featureId: string) {
    const isVisible = (event.target as HTMLInputElement).checked;
    this.featureVisibility[layer][featureId] = isVisible;
    this.featureToggle.emit({
      layer,
      featureId,
      visible: isVisible
    });
  }

  toggleAllFeatures(event: Event, layer: string) {
    const isVisible = (event.target as HTMLInputElement).checked;
    this.layerFeatures[layer].forEach(feature => {
      this.featureVisibility[layer][feature.publicId] = isVisible;
    });
    this.allFeaturesToggle.emit({
      layer,
      visible: isVisible
    });
  }

  public isFeatureVisible(feature: Feature): boolean {
    const layer = feature.get('layerName');
    const featureId = feature.getId() as string;
    return this.featureVisibility[layer]?.[featureId] !== false;
  }

  isAllFeaturesSelected(layer: string): boolean {
    return this.layerFeatures[layer]?.every(f =>
      this.featureVisibility[layer]?.[f.publicId] !== false
    );
  }

  getLayerFeatureKeys(): string[] {
    return Object.keys(this.layerFeatures);
  }

  loadData(): void {
    const userId = this.apiService.getUserId();
    const mvnoId = this.apiService.getMvnoId();
    this.isLoading = true;

    // Step 1: Load survey areas first
    this.apiService.getsurveyArea(userId, mvnoId).subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.surveyList = res.data.map((item: any) => ({
            surveyId: item.id,
            publicId: item.publicId,
            surveyName: item.name,
            userId: this.apiService.getUserId(),
            statusId: item.statusId,
            surveyStatusName: item.surveyStatusName || '—',
            surveyStage: item.lookupSurveyStage?.name || '—'
          }));

          this.totalRecords = this.surveyList.length;

          // Step 2: Extract unique statusIds from surveyList
          const usedStatusIds = [...new Set(this.surveyList.map(s => s.statusId))];

          // Step 3: Fetch all status options and filter them based on usedStatusIds
          this.apiService.getsurveyStatus().subscribe({
            next: (res: any) => {
              if (res.success && Array.isArray(res.data)) {
                this.surveyStatusOptions = res.data.filter((status: any) =>
                  usedStatusIds.includes(status.id)
                );
              }
            },
            error: () => this.toastr.error('Failed to load survey status list')
          });
        } else {
          this.surveyList = [];
          this.totalRecords = 0;
          this.toastr.warning('No survey data found');
        }

        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load surveys');
        this.isLoading = false;
      }
    });

    // Load assignable users
    this.apiService.getassignuserName().subscribe({
      next: (res: any) => {
        this.userOptions = res.data.map((user: any) => ({
          id: user.staffid,
          name: user.username
        }));
      },
      error: () => this.toastr.error('Failed to load users')
    });
  }

  deleteSurvey(survey: any) {
    if (!survey || !survey.surveyAreaId) {
      this.toastr.warning('Invalid survey to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this survey?')) {
      this.isLoading = true;

      this.apiService.deleteSurvey(survey.surveyAreaId).subscribe({
        next: () => {
          this.toastr.success('Survey deleted successfully', 'Success');
          this.isLoading = false;
          // Remove deleted survey from list if needed
          this.surveyList = this.surveyList.filter(s => s.surveyAreaId !== survey.surveyAreaId);
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to delete survey');
          this.isLoading = false;
        }
      });
    }
  }

onAreaMappingToggle() {
  if (this.showAreaMapping) {
    const userId = Number(this.apiService.getUserId());
    const mvnoId = Number(this.apiService.getMvnoId());
    this.apiService.getAllAreasForUser(userId, mvnoId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.areaMappingData = res.data;
          // Initialize all visibilities as not visible
          this.stateVisibility = {};
          this.countryVisibility = {};
          this.districtsVisibility = {};
          if (res.data?.state) {
            res.data.state.forEach((state: any) => {
              this.stateVisibility[state.stateName] = false;
            });
          }
          if (res.data?.country) {
            res.data.country.forEach((country: any) => {
              this.countryVisibility[country.countryName] = false;
            });
          }
          if (res.data?.district) {
            res.data.district.forEach((district: any) => {
              this.districtsVisibility[district.district] = false;
            });
          }
          this.areaMappingDataChange.emit(null); // Clear all on main toggle
        } else {
          this.areaMappingData = null;
          this.stateVisibility = {};
          this.countryVisibility = {};
          this.districtsVisibility = {};
          this.areaMappingDataChange.emit(null);
          this.toastr.error('Failed to fetch area mapping data');
        }
      },
      error: () => {
        this.areaMappingData = null;
        this.stateVisibility = {};
        this.countryVisibility = {};
        this.districtsVisibility = {};
        this.areaMappingDataChange.emit(null);
        this.toastr.error('Failed to fetch area mapping data');
      }
    });
  } else {
    this.areaMappingData = null;
    this.stateVisibility = {};
    this.countryVisibility = {};
    this.districtsVisibility = {};
    this.areaMappingDataChange.emit(null);
  }
}

onAreaMappingCountryToggle() {
  // Get all checked countries
  const checkedCountries = this.areaMappingData.country
    ? this.areaMappingData.country.filter((country: any) => this.countryVisibility[country.countryName])
    : [];
  this.areaMappingDataChange.emit({ country: checkedCountries });
}

onAreaMappingStateToggle() {
  const checkedStates = this.areaMappingData.state
    ? this.areaMappingData.state.filter((state: any) => this.stateVisibility[state.stateName])
    : [];
  this.areaMappingDataChange.emit({ state: checkedStates });
}

onAreaMappingDistrictToggle() {
  const checkedDistricts = this.areaMappingData.district
    ? this.areaMappingData.district.filter((district: any) => this.districtsVisibility[district.district])
    : [];
  this.areaMappingDataChange.emit({ district: checkedDistricts });
}

}
