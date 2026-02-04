import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
// import Map from 'ol/Map';
import View from 'ol/View';
import TileWMS from 'ol/source/TileWMS';
import { toLonLat, transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { CommonModule } from '@angular/common';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import {
  Style,
  Stroke,
  Fill,
  Circle as CircleStyle,
  RegularShape,
  Text,
} from 'ol/style';
import { Map as MapLibreMap } from 'maplibre-gl';
import { GeoJSON } from 'ol/format';
import Icon from 'ol/style/Icon';
import Polygon from 'ol/geom/Polygon';
import { createBox } from 'ol/interaction/Draw';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerPointComponent } from './../form-component/customer-point/customer-point.component';
import { FdpComponent } from './../form-component/fdp/fdp.component';
import { FatComponent } from './../form-component/fat/fat.component';
import { FdtComponent } from '../form-component/fdt/fdt.component';
import { OltComponent } from '../form-component/olt/olt.component';
import {
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
} from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { CableComponent } from '../form-component/cable/cable.component';
import LineString from 'ol/geom/LineString';
import { BuildingComponent } from '../form-component/building/building.component';
import { FdcComponent } from '../form-component/fdc/fdc.component';
import { SplitterComponent } from '../form-component/splitter/splitter.component';
import { PopComponent } from '../form-component/pop/pop.component';
import { GeocodingService } from './../../service/geocoding.service';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { JointComponent } from '../form-component/joint/joint.component';
import { PoleComponent } from '../form-component/pole/pole.component';
import { ManHoleComponent } from '../form-component/man-hole/man-hole.component';
import { HandHoleComponent } from '../form-component/hand-hole/hand-hole.component';
import { SurveyAreaComponent } from '../form-component/survey-area/survey-area.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import * as maplibregl from 'maplibre-gl';
import { MapView } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { Layer, Map } from 'mapbox-gl';
import { Map as OlMap } from 'ol'; // OpenLayers Map
import { LayerDialogComponent } from '../ne-form/layer-dialog/layer-dialog.component';
import { BuildlingTypeComponent } from '../form-component/buildling-type/buildling-type.component';
import { Geometry } from 'ol/geom';
import { getCenter, getHeight, getWidth, intersects } from 'ol/extent';
import { SurveyArea } from '../ne-form/layers/layers.component';
import { MapBackgroundSwitcherComponent } from '../reusable-component/map-background-switcher/map-background-switcher.component';
import { MultiPolygon } from 'ol/geom';

import { MapBrowserEvent } from 'ol';
import { toStringHDMS } from 'ol/coordinate';
import { MapService } from '../map.service';
import { Modify } from 'ol/interaction';
import jsPDF from 'jspdf';
// import { Modify } from 'ol/interaction';

interface LayerConfig {
  name: string;
  visible: boolean;
  layer: TileLayer;
  opacity?: number;
  displayName?: string;
  img?: string;
  properties?: {};
}

export interface CountryBorderData {
  id: number;
  adm0Name: string;
  adm0Code: string;
  geom: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

@Component({
  selector: 'app-ol-map',
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: false,
  templateUrl: './ol-map.component.html',
  styleUrl: './ol-map.component.css',
})
export class OlMapComponent implements OnInit, OnDestroy, AfterViewInit {
  // private map!: Map | any;
  public layersConfig: Record<string, LayerConfig> = {};
  private vectorSource!: VectorSource;
  vectorLayer!: VectorLayer<VectorSource>;
  drawInteraction: Draw | null = null;
  modifyInteraction: Modify | null = null;
  mapLibre!: MapLibreMap;
  isShowLayers: boolean = false;
  isShowElements: boolean = false;
  geoJSONFormat = new GeoJSON();
  public selectedLayer: string = '';
  addNetworkElement: boolean = false;
  @ViewChild('formContainer', { read: ViewContainerRef, static: false })
  formContainer!: ViewContainerRef;
  @ViewChild(LayerDialogComponent) layerDialog!: LayerDialogComponent;
  @ViewChild(MapBackgroundSwitcherComponent)
  mapBackgroundSwitcher!: MapBackgroundSwitcherComponent;
  currentFormComponent: ComponentRef<any> | null = null;

  @ViewChild('surveyStageComp') surveyStageComp!: any;

  showForm: boolean = false;
  currentLineCoordinates: number[][] = [];
  public showCableOption: boolean = false;
  public showRectangleOption: boolean = false;
  backgroundLayers: { [key: string]: TileLayer } = {};
  currentBackgroundLayer: TileLayer | null = null;

  // Add to your component properties
  searchQuery: string = '';
  searchResults: any[] = [];
  searchService: any;

  public nearbyFeatures: any[] = [];
  public showNearbyDropdown: boolean = false;
  public clickedPoint: { lat: number; lon: number } | null = null;

  public locationFeature: Feature<Point> | null = null;
  public locationAccuracyFeature: Feature<Polygon> | null = null;
  public locationWatcherId: string | null = null;
  public trackingActive = false;

  public selectedFeatureDetails: any = null;
  public showFeatureDetails = false;
  userId: any = null;
  mvnoId: any = null;
  public locationMarker: Feature | null = null;
  currentSurveyAreaPolygon: any = null;
  currentSurveyArea: any = null;
  currentSurveyAreaFeature: Feature<Polygon> | null = null;
  private selectedSurveyAreaCache: { [id: number]: any } = {};

  //Survey area
  visible: boolean = false;
  isLoading = false;
  surveyList: any[] = [];
  userOptions: any[] = [];
  showSurveyDialog = false;
  selectedSurveys: any[] = [];
  buildings: any[] = [];
  selectedBuildings: any[] = [];
  isBuildingChecked = false;
  deckgl: Deck | any;
  olMap!: OlMap;
  mlMap!: MapLibreMap;
  public surveyAreas: any[] = [];
  public selectedSurveyAreas: { [id: number]: boolean } = {};
  public selectedSurveyAreaId: number | null = null;
  public selectedSurveyAreaName: string = '';
  public layerNames: { [layer: string]: string } = {};
  public countiesList: any[] = [];
  public districtsList: any[] = [];

  poles: any[] = [];
  fats: any[] = [];
  isPoleChecked = false;
  isFatChecked = false;
  hasSurveyAssignPermission: boolean = false;
  hasNetworkElementEditPermission: boolean = false;
  hasNetworkElementDeletePermission: boolean = false;
  hasSurveyViewPermission: boolean = false;

  drawingType: 'Point' | 'LineString' | 'Polygon' | null = null;
  currentDrawingMode: 'Point' | 'LineString' | 'Polygon' | null = null;
  selectedSurvey: any = null;

  public layerFeatures: { [key: string]: any[] } = {};
  public selectedFeatures: { [key: string]: Set<string> } = {};
  public allFeatures: { [layer: string]: { [id: string]: Feature } } = {};
  public isSurveyLayerVisible: boolean = false;

  countryBorderLayer!: VectorLayer<VectorSource>;
  countryBorderSource!: VectorSource;

  // new
  private basemapLayer!: TileLayer<OSM | XYZ>;
  basemapVisible = true;
  showLabels = true;

  // for stage change
  isSurveyShow: boolean = false;
  public useAlternativeDesign = false;
  showSurveyStage = true;

  //stepper pop up 
  showDialog: boolean = false;
  items: MenuItem[] = [];
  active: number = 0;
  public connectivityFeatureData: any = null;
  public fatCoordinates: [number, number] | null = null;
  public canAddCable = false;
  public lastCreatedSplitterId: number | null = null;

  showParentConnectionDialog: boolean = false;
  parentConnectionFeatureData: any = null;
  currentSurveyStage: string = '';

  //area mappinglayer
  private areaMappingLayer: VectorLayer<VectorSource> | null = null;
  showAreaMappingPanel = false;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public cdr: ChangeDetectorRef,
    public geocodingService: GeocodingService,
    public router: Router,
    public api: ApiService,
    public apiService: ApiService,
    public toastr: ToastrService,
    public messageService: MessageService,
    private mapService: MapService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.initializeMap();
    this.userId = localStorage.getItem('userId');
    this.mvnoId = this.api.getMvnoId();
    // console.log(this.userId);
    // this.olMap.on('click', (event: any) => {
    //   this.handleMapClick(event);
    // });
    this.checkSurveyAssignPermission();
    this.checkNetworkElementEditPermission();
    this.checkNetworkElementDeletePermission();
    this.checkSurveyViewPermission();

    this.items = [
      { label: 'FAT' },
      { label: 'SPLITTER' },
      // { label: 'CABLE' }
    ];
  }

  ngAfterViewInit(): void {
    // Ensure view is initialized before loading components
    this.cdr.detectChanges();
    // Add click handler after view is ready
    setTimeout(() => {
      if (this.olMap) {
        this.olMap.on('click', (event: any) => {
          this.handleMapClick(event);
        });
        this.olMap.on('pointermove', (event: any) => {
          this.handlePointerMove(event);
        });

        // Add this to improve performance
        this.olMap.on('pointerdrag', () => {
          const tooltip = document.getElementById('feature-tooltip');
          if (tooltip) tooltip.style.display = 'none';
        });
      }
    }, 500);
    // this.loadGeoJSON();
  }

  ngOnDestroy(): void {
    if (this.olMap) {
      this.olMap.setTarget(undefined);
      this.olMap.dispose();
    }
  }

  checkSurveyAssignPermission() {
    this.mapService.getMethod('/acl/getAclEntry').subscribe((res: any) => {
      const aclEntries = res?.dataList || [];

      // Check if the required permission code exists
      this.hasSurveyAssignPermission = aclEntries.some(
        (entry: any) => entry.code === 'survey_management_survey_assign'
      );
    });
  }

  checkNetworkElementEditPermission() {
    this.mapService.getMethod('/acl/getAclEntry').subscribe((res: any) => {
      const aclEntries = res?.dataList || [];

      // Check if the required permission code exists
      this.hasNetworkElementEditPermission = aclEntries.some(
        (entry: any) => entry.code === 'network_management_edit' ||
          entry.code === 'network_management_update'
      );
    });
  }

  checkNetworkElementDeletePermission() {
    this.mapService.getMethod('/acl/getAclEntry').subscribe((res: any) => {
      const aclEntries = res?.dataList || [];

      // Check if the required permission code exists
      this.hasNetworkElementDeletePermission = aclEntries.some(
        (entry: any) => entry.code === 'network_management_delete'
      );
    });
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

  private handlePointerMove(event: MapBrowserEvent<any>): void {
    if (!this.olMap) return;

    // Create tooltip if it doesn't exist
    let tooltip = document.getElementById('feature-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'feature-tooltip';
      tooltip.className = 'ol-tooltip';
      document.body.appendChild(tooltip);
    }

    try {
      const pixel = this.olMap.getEventPixel(event.originalEvent);
      const hit = this.olMap.hasFeatureAtPixel(pixel);

      // Change cursor style when hovering over a feature
      this.olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';

      if (hit) {
        const feature = this.olMap.forEachFeatureAtPixel(pixel, (feat: any) => {
          return feat;
        });

        if (feature) {
          const props = feature.getProperties();
          const layerName = (props['layerName'] || '').toLowerCase();
          const showNameOnlyLayers = [
            'fat',
            '8m',
            '10m',
            '12m',
            'sdu',
            'mdu',
            'cdu',
            'fdt',
            'olt',
            'cable',
            'splitter',
            'jointclosure'
          ];

          if (showNameOnlyLayers.includes(layerName)) {
            let tooltipHtml = `<strong>Name:</strong> ${props['name'] || props['cableId']  || 'No Name'} `;
            if (layerName === 'cable') {
              const cableType = props['lookupCableType']?.name || '';
              if (cableType) {
                tooltipHtml += `<br/><strong>Type:</strong> ${cableType}`;
              }
            }

            tooltip.innerHTML = tooltipHtml;
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '3px';
            tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.left = event.pixel[0] + 15 + 'px';
            tooltip.style.top = event.pixel[1] - 10 + 'px';
            tooltip.style.zIndex = '1000';
          } else {
            tooltip.style.display = 'none';
          }
        } else {
          tooltip.style.display = 'none';
        }
      } else {
        tooltip.style.display = 'none';
      }
    } catch (error) {
      console.error('Error in handlePointerMove:', error);
      if (tooltip) tooltip.style.display = 'none';
    }
  }

  private initializeMap(): void {
    this.cleanupMaps();
    this.createBackgroundLayers();

    // Initialize OpenLayers Map FIRST
    this.initializeOpenLayersMap();
    // Then initialize MapLibre Map
    this.initializeMapLibreMap();
  }
  selectedBackground: string = '';
  backgroundOptions: any[] = [];


  onSurveySelected(survey: any) {
    this.selectedSurvey = survey;
    this.selectedSurveyAreaId = survey?.id || survey?.publicId || null;
    this.selectedSurveyAreaName = survey?.name || '';

    // this.selectedSurveyAreas = {}; // Clear previous
    this.selectedSurveyAreas[survey.id] = true;

    // Set icon design mode
    this.useAlternativeDesign = survey.surveyStageName?.toLowerCase() === 'digitalization' || survey.surveyStageName?.toLowerCase() === 'design' || survey?.surveyStageName === 'BOM';
    this.currentSurveyStage = survey.surveyStageName;

    this.showSurveyStage = false;
    this.refreshMapFeatures();

    //  Directly call the appropriate API based on the stage
    if (this.useAlternativeDesign && this.selectedSurveyAreaId) {
      this.apiService.getSurveyDataForDigitalization(this.selectedSurveyAreaId).subscribe({
        next: (response: any) => {
          this.handleSurveyDataResponse(response);
        },
        error: (err) => {
          console.error('Digitalization API failed', err);
          this.toastr.error('Failed to load digitalization survey data');
        }
      });
    } else if (this.selectedSurveyAreaId) {
      this.apiService.getsurveyAreaByUser(this.selectedSurveyAreaId).subscribe({
        next: (response: any) => {
          this.handleSurveyDataResponse(response);
        },
        error: (err) => {
          console.error('Survey Area API failed', err);
          this.toastr.error('Failed to load survey area data');
        }
      });
    }
  }

  private handleSurveyDataResponse(response: any): void {
    if (!response.success || !response.data) {
      this.toastr.warning('No survey data available.');
      return;
    }

    if (response.data.survey_area?.length > 0) {
      this.currentSurveyAreaPolygon = response.data.survey_area[0].geom;
      if (this.currentFormComponent?.instance?.surveyAreaGeometry) {
        this.currentFormComponent.instance.surveyAreaGeometry = this.currentSurveyAreaPolygon;
      }
      this.zoomToSurveyArea(response.data.survey_area[0]);
    }

    this.layerFeatures = {};
    this.selectedFeatures = {};

    Object.entries(response.data).forEach(([layerType, features]) => {
      if (Array.isArray(features) && features.length > 0 && layerType !== 'survey_area') {
        this.layerFeatures[layerType] = features;
        this.selectedFeatures[layerType] = new Set();
      }
    });

    this.displayAllSurveyLayers(response.data);
  }

  private zoomToPoint(coordinates: number[], zoomLevel: number = 18) {
    if (!coordinates || coordinates.length < 2) return;
    this.olMap.getView().animate({
      center: coordinates,
      zoom: zoomLevel,
      duration: 500
    });
  }

  onStageChanged(stageData: { selectedStage: string, isSurveyShow: boolean }) {
    this.vectorLayer.getSource()?.clear();
    this.isSurveyShow = stageData.isSurveyShow;

    // Automatically set icon mode based on stage
    if (stageData.selectedStage && stageData.selectedStage.toLowerCase() === 'digitalization') {
      this.useAlternativeDesign = true;
    } else {
      this.useAlternativeDesign = false;
    }
    this.refreshMapFeatures();
  }

onMultiSurveySelected(selectedSurveys: any[]) {
  this.selectedSurveyAreas = {}; 
  selectedSurveys.forEach(survey => {
    this.selectedSurveyAreas[survey.id] = true;
  });

  this.vectorLayer.getSource()?.clear();

  // Fetch & render all selected surveys, but DO NOT zoom/focus here!
  selectedSurveys.forEach(survey => {
    if (
      survey.surveyStageName?.toLowerCase() === 'digitalization' ||
      survey.surveyStageName?.toLowerCase() === 'design' ||
      survey.surveyStageName?.toLowerCase() === 'bom'
    ) {
      this.apiService.getSurveyDataForDigitalization(survey.id).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.displayAllSurveyLayers(response.data);
          }
        }
      });
    } else {
      this.apiService.getsurveyAreaByUser(survey.id).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.displayAllSurveyLayers(response.data);
          }
        }
      });
    }
  });

  // DO NOT call zoomToSurveyArea or set selectedSurvey here!
}

  onBackgroundChanged(backMap: {
    selectedBackground: string;
    backgroundOptions: any[];
  }) {
    (this.selectedBackground = backMap.selectedBackground),
      (this.backgroundOptions = backMap.backgroundOptions);

    this.switchBackground(
      backMap.selectedBackground,
      backMap.backgroundOptions
    );
  }
  public switchBackground(
    selectedBackground: string,
    backgroundOptions: any[]
  ) {
    // Get current data layers before removing
    const currentDataLayers = this.olMap
      .getLayers()
      .getArray()
      .filter((layer) => {
        return layer.get('type') === 'data'; // Filter by our data layer marker
      });

    // Remove all layers except data layers
    this.olMap.getLayers().clear();

    // Add the new background layer at the bottom
    const backgroundLayer = this.backgroundLayers[selectedBackground];
    backgroundLayer.set('type', 'background'); // Mark as background layer
    this.olMap.addLayer(backgroundLayer);

    // Re-add all data layers in their original order
    currentDataLayers.forEach((layer) => {
      this.olMap.addLayer(layer);
    });

    // Store the current background reference
    this.currentBackgroundLayer = backgroundLayer;
  }

  private createBasemapLayer(): TileLayer<OSM | XYZ> {
    const selectedOption = this.backgroundOptions.find(
      (option) => option.value === this.selectedBackground
    );
    if (selectedOption?.url) {
      return new TileLayer({
        source: new XYZ({
          url: selectedOption.url,
          crossOrigin: 'anonymous',
          tileLoadFunction: (tile: any, src: string) => {
            const img = tile.getImage();
            img.crossOrigin = 'anonymous';
            img.onerror = () => {
              console.warn(
                `Failed to load tile for ${selectedOption.label}, falling back to OSM`
              );
              this.selectedBackground = 'osm';
              this.onBasemapChange();
            };
            img.src = src;
          },
        }),
        visible: this.basemapVisible,
      });
    } else {
      // Default to OpenStreetMap
      return new TileLayer({
        source: new OSM(),
        visible: this.basemapVisible,
      });
    }
  }

  onBasemapChange(): void {
    // Remove old basemap layer
    this.olMap.removeLayer(this.basemapLayer);

    // Create new basemap layer
    this.basemapLayer = this.createBasemapLayer();

    // Add new basemap layer at the beginning (bottom)
    this.olMap.getLayers().insertAt(0, this.basemapLayer);

    // Refresh vector layer styling to update icons for new basemap style
    this.vectorLayer.setStyle(this.createFeatureStyle.bind(this));
  }

  private createFeatureStyle(feature: any): Style {
    const geometry = feature.getGeometry();
    if (!geometry) return new Style();
    const layerType = feature.get('layerName');
    const geometryType = geometry.getType();
    const featureType = feature.get('type');
    const status = feature.get('status');
    const useAlternativeDesign = feature.get('useAlternativeDesign');
    this.getIconForLayer(layerType, useAlternativeDesign)

    if (!featureType) return new Style();

    // Check if we're using a CAD-style basemap
    const isCADStyle = ['cartodb-positron', 'esri-gray'].includes(
      this.selectedBackground
    );

    // Define colors based on feature type and status
    const getFeatureColor = (type: string, status: string) => {
      if (isCADStyle) {
        return '#000000';
      }
      switch (type) {
        case 'survey_area':
          return '#FF0000'; // Red for outer polygon
        case 'CSA':
          return '#00FF00'; // Green for CSA areas
        case 'cable':
          return status === 'active' ? '#0066FF' : '#FF0000'; // Blue for active, red for others
        case 'trench':
          return status === 'active' ? '#00FF00' : '#ff5900ff';
        case 'duct':
          return status === 'active' ? '#FF6600' : '#e5ff00ff';
        case 'building':
          return '#222'; // Outline only
        case 'FAT':
          return '#FF0000'; // Red for FAT points
        case 'POP':
          return '#0000FF'; // Blue for POP points
        case 'FDC':
          return '#FF6600'; // Orange for FDC points
        case 'FDT':
          return '#FF6600'; // Orange for FDC points
        case 'fat':
          return '#FF0000';
        case 'fdt':
          return '#FF0000';
        case 'fdc':
          return '#FF6600';
        case 'splice':
          return '#FF00FF';
        case 'manhole':
          return '#663300';
        case 'pole':
          return '#333333';
        case 'dsa':
          return 'rgba(0, 255, 0, 0.1)';
        default:
          return isCADStyle ? '#000000' : 'rgba(66, 133, 244, 0.2)';
      }
    };

    const getFeatureSize = (type: string) => {
      switch (type) {
        case 'FAT':
          return 1.0; // Very small for FAT points
        case 'POP':
          return 2.5; // Medium for POP points
        case 'FDC':
          return 1.0; // Very small for FDC points
        case 'fat':
          return 1.0;
        case 'fdc':
          return 1.0;
        case 'splice':
          return 2.0;
        case 'manhole':
          return 2.0;
        case 'pole':
          return 1.5;
        case 'building':
          return 1.0;
        default:
          return 1.5;
      }
    };

    const getLineWidth = (type: string, status: string) => {
      if (isCADStyle) {
        return type === 'cable' ? 0.8 : 0.5; // Thinner lines for CAD style
      }

      switch (type) {
        case 'cable':
          return status === 'active' ? 1.2 : 0.8; // Thinner for cables
        default:
          return 0.8; // Thinner default
      }
    };

    switch (geometryType) {
      case 'Point':
        const pointColor = getFeatureColor(featureType, status);
        const pointSize = getFeatureSize(featureType);

        // Use custom shapes that match PDF styling - no icon loading issues
        const currentZoom = this.olMap.getView().getZoom() || 15;
        const imageStyle = this.createFallbackShape(
          featureType,
          pointColor,
          pointSize,
          isCADStyle,
          currentZoom,
          feature
        );

        return new Style({
          image: imageStyle,
          text:
            this.showLabels && feature.get('name')
              ? new Text({
                text: feature.get('name'),
                font: 'bold 12px Arial',
                fill: new Fill({ color: '#222' }),
                stroke: new Stroke({ color: '#fff', width: 3 }),
                offsetY: -18,
              })
              : undefined,
        });

      case 'LineString':
        const lineColor = getFeatureColor(featureType, status);
        const lineWidth = getLineWidth(featureType, status);

        return new Style({
          stroke: new Stroke({
            color:
              featureType === 'cable'
                ? status === 'active'
                  ? '#0066FF'
                  : '#fe0000ff'
                : lineColor,
            width: getLineWidth(featureType, status),
            lineDash:
              featureType === 'cable'
                ? [6, 6]
                : isCADStyle
                  ? [5, 5]
                  : undefined,
          }),
          text:
            this.showLabels && feature.get('name')
              ? new Text({
                text: feature.get('name'),
                font: 'bold 12px Arial',
                fill: new Fill({ color: '#222' }),
                stroke: new Stroke({ color: '#fff', width: 3 }),
                placement: 'line',
                overflow: true,
              })
              : undefined,
        });

      case 'Polygon':
        const polygonColor = getFeatureColor(featureType, status);

        // For other polygons (survey area, etc.)
        return new Style({
          fill: new Fill({
            color: 'rgba(66, 133, 244, 0.2)',
          }),
          stroke: new Stroke({
            color: '#4285F4', // blue border
            width: 2,
          }),
          text:
            this.showLabels && feature.get('name')
              ? new Text({
                text: feature.get('name'),
                font: 'bold 12px Arial',
                fill: new Fill({ color: '#222' }),
                stroke: new Stroke({ color: '#fff', width: 3 }),
              })
              : undefined,
        });

      default:
        return new Style();
    }
  }

  private createFallbackShape(
    type: string,
    color: string,
    size: number,
    isCADStyle: boolean,
    zoom: number,
    feature?: any
  ): any {
    // Create custom shapes that match PDF styling
    if (type === 'FAT' || type === 'fat') {
      // Generate dynamic SVG for FAT points
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.15, zoom - 15);

      // Get feature properties for dynamic text directly from the feature
      const name = feature?.get('name') || 'FAT 03-2';
      const homepasses = feature?.get('homepasses') || 'HP14';

      // Generate dynamic SVG
      const svgContent = this.generateDynamicFATSvg(name, homepasses);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'FDT' || type === 'fdt') {
      // Generate dynamic SVG for FDT points
      const baseScale = 0.3;
      const zoomScale = Math.pow(1.15, zoom - 15);

      // Get feature properties for dynamic splitters
      const splitters = feature?.get('splitters') || ['2x4 SPL', '2x16 SPL', '2x8 SPL'];

      // Generate dynamic SVG
      const svgContent = ''
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5]
      });
    } else if (type === 'FDC' || type === 'fdc') {
      // Use SVG icon for FDC points with dynamic scaling
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.2, zoom - 15);
      return new Icon({
        src: 'assets/fdc.svg',
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5]
      });
    } else if (type === 'POP') {
      // Create circle for POP
      return new CircleStyle({
        radius: size,
        fill: new Fill({ color: color }),
        stroke: new Stroke({
          color: isCADStyle ? '#ffffff' : '#ffffff',
          width: 1,
        }),
      });
    } else if (type === 'splice') {
      // Use SVG icon for splice points with dynamic scaling
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.2, zoom - 15);
      return new Icon({
        src: 'assets/splice.svg',
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'manhole') {
      // Use SVG icon for manhole points with dynamic scaling
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'MH';
      const svgContent = this.generateManholeSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });

    } else if (type === 'handhole') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'HH';
      const svgContent = this.generateHandholeSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });

    } else if (type === 'olt') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'OLT';
      const oltNo = feature?.get('oltNo') || '01';
      const svgContent = this.generateOltSvg(name, oltNo);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'jointclosure') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'JC';
      const svgContent = this.generateJointClosureSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'splitter') {
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.2, zoom - 15);
      const name = feature?.get('name') || 'Splitter';
      const original = (feature?.get('originalType') || '').toLowerCase();

      let svgContent: string;
      if (original === 'fdt') {
        // svgContent = this.generateFdtSplitterSvg(name);
      } else {
        svgContent = this.generateFatSplitterSvg(name);
      }

      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'building' || type === 'building_center') {
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.15, zoom - 15);

      const original = (feature?.get('originalType') || '').toLowerCase();
      const name = feature?.get('name') || 'B';
      // Get feature properties for dynamic text
      const street = feature?.get('street') || 'STREET NAME';
      const number = feature?.get('number') || '0';
      const floor = feature?.get('floor') || '1F';
      const units = feature?.get('units') || '1';
      const fatId = feature?.get('fat_id') || 'FAT 00-00';
      const equipment = feature?.get('equipment') || 'SFU';
      const count = feature?.get('count') || '1';
      const olt = feature?.get('olt') || 'OLT 00-00';
      const location = feature?.get('location') || 'LOCATION';
      const status = feature?.get('status') || 'STATUS';

      let svgContent: string;
      if (original === 'sdu') {
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
        svgContent = this.generateSduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, status);
        return new Icon({
          src: dataUrl,
          scale: baseScale * zoomScale,
          anchor: [0.5, 0.5]
        });
      } else if (original === 'cdu') {
        svgContent = this.generateCduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location);
      } else {
        svgContent = this.generateMduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location);
      }

      const dataUrl =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === '8m poles' || type === '10m poles' || type === '12m poles') {
      // Use SVG icon for pole points with dynamic scaling
      const baseScale = 0.4;
      const zoomScale = Math.pow(1.2, zoom - 15);

      const sn = feature?.get('sn') || 'SN';
      const poleId = feature?.get('poleId') || 'NP_SAV-0001';
      const height = (feature?.get('height') || '').toLowerCase(); // example: '8m', '10m', '12m'

      let svgContent: string;

      // Choose SVG based on pole height
      if (type === '8m poles') {
        svgContent = this.generate8mPoleSvg(sn, poleId);
      } else if (type === '10m poles') {
        svgContent = this.generate10mPoleSvg(sn, poleId);
      } else {
        svgContent = this.generate12mPoleSvg(sn, poleId);
      }

      const dataUrl =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'cable') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'Cable';

      const svgContent = this.generateCableSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'trench') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'Trench';

      const svgContent = this.generateTrenchSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else if (type === 'duct') {
      const baseScale = 0.5;
      const zoomScale = Math.pow(1.15, zoom - 15);
      const name = feature?.get('name') || 'Duct';

      const svgContent = this.generateDuctSvg(name);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

      return new Icon({
        src: dataUrl,
        scale: baseScale * zoomScale,
        anchor: [0.5, 0.5],
      });
    } else {
      // Default circle for other features
      return new CircleStyle({
        radius: size,
        fill: new Fill({ color: color }),
        stroke: new Stroke({
          color: isCADStyle ? '#ffffff' : '#ffffff',
          width: 1,
        }),
      });
    }
  }

  private generateDynamicFATSvg(name: string, homepasses: string): string {
    return `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Magenta Shield Shape -->
  <path d="M30,20 H70 V60 A20,20 0 0 1 30,60 Z"
        stroke="magenta" stroke-width="2" fill="none" style="shape-rendering: crispEdges;"/>

  <!-- Small Hollow Circle in the middle -->
  <circle cx="50" cy="40" r="8" fill="none" stroke="magenta" stroke-width="2"/>

  <!-- Top Text - positioned above the circle with better spacing -->
  <text x="50" y="28" text-anchor="middle" fill="magenta" font-size="8" font-family="Arial, sans-serif" font-weight="bold" style="text-rendering: optimizeLegibility; dominant-baseline: middle;">${name}</text>

  <!-- Bottom Text - positioned below the circle with better spacing -->
  <text x="50" y="55" text-anchor="middle" fill="magenta" font-size="9" font-family="Arial, sans-serif" font-weight="bold" style="text-rendering: optimizeLegibility; dominant-baseline: middle;">${homepasses}</text>
</svg>`;
  }

  private generateSduSvg(
    name: string,
    street: string, number: string, floor: string, units: string,
    fatId: string, equipment: string, count: string, olt: string,
    location: string, status: string, size: number = 200
  ): string {
    return `<svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Rotated Rounded Rectangle -->
  <g transform="rotate(-10, 50, 50)">
    <rect x="10" y="10" width="80" height="80" rx="8" ry="8"
          stroke="lime" stroke-width="1.5" fill="none" />

    <!-- Multi-line Text -->
    <text x="50" y="25" text-anchor="middle" fill="lime" font-size="5" font-family="Arial, sans-serif" style="text-rendering: optimizeLegibility;">
      <tspan x="50" dy="0">OFF ${street} ${number}</tspan>
      <tspan x="50" dy="6">${floor}</tspan>
      <tspan x="50" dy="6">${units}</tspan>
      <tspan x="50" dy="6">OFF ${street}</tspan>
      <tspan x="50" dy="6">${number}</tspan>
      <tspan x="50" dy="6">${fatId}</tspan>
      <tspan x="50" dy="6">${equipment}</tspan>
      <tspan x="50" dy="6">${count}</tspan>
      <tspan x="50" dy="6">${olt}</tspan>
      <tspan x="50" dy="6">${location}</tspan>
      <tspan x="50" dy="6">${status}</tspan>
    </text>
  </g>
</svg>`;
  }

  private generateMduSvg(street: string, number: string, floor: string, units: string, fatId: string, equipment: string, count: string, olt: string, location: string, status: string, size: number = 200): string {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Rotated Rounded Rectangle -->
  <g transform="rotate(-10, 50, 50)">
    <rect x="10" y="10" width="80" height="80" rx="8" ry="8"
          stroke="lime" stroke-width="1.5" fill="none" />

    <!-- Multi-line Text -->
    <text x="50" y="25" text-anchor="middle" fill="lime" font-size="5" font-family="Arial, sans-serif" style="text-rendering: optimizeLegibility;">
      <tspan x="50" dy="0">OFF ${street} ${number}</tspan>
      <tspan x="50" dy="6">${floor}</tspan>
      <tspan x="50" dy="6">${units}</tspan>
      <tspan x="50" dy="6">OFF ${street}</tspan>
      <tspan x="50" dy="6">${number}</tspan>
      <tspan x="50" dy="6">${fatId}</tspan>
      <tspan x="50" dy="6">${equipment}</tspan>
      <tspan x="50" dy="6">${count}</tspan>
      <tspan x="50" dy="6">${olt}</tspan>
      <tspan x="50" dy="6">${location}</tspan>
      <tspan x="50" dy="6">${status}</tspan>
    </text>
  </g>
</svg>`;
  }

  private generateCduSvg(street: string, number: string, floor: string, units: string, fatId: string, equipment: string, count: string, olt: string, location: string, status: string, size: number = 200): string {
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Rotated Rounded Rectangle -->
  <g transform="rotate(-10, 50, 50)">
    <rect x="10" y="10" width="80" height="80" rx="8" ry="8"
          stroke="lime" stroke-width="1.5" fill="none" />

    <!-- Multi-line Text -->
    <text x="50" y="25" text-anchor="middle" fill="lime" font-size="5" font-family="Arial, sans-serif" style="text-rendering: optimizeLegibility;">
      <tspan x="50" dy="0">OFF ${street} ${number}</tspan>
      <tspan x="50" dy="6">${floor}</tspan>
      <tspan x="50" dy="6">${units}</tspan>
      <tspan x="50" dy="6">OFF ${street}</tspan>
      <tspan x="50" dy="6">${number}</tspan>
      <tspan x="50" dy="6">${fatId}</tspan>
      <tspan x="50" dy="6">${equipment}</tspan>
      <tspan x="50" dy="6">${count}</tspan>
      <tspan x="50" dy="6">${olt}</tspan>
      <tspan x="50" dy="6">${location}</tspan>
      <tspan x="50" dy="6">${status}</tspan>
    </text>
  </g>
</svg>`;
  }
  private generate12mPoleSvg(sn: string, poleId: string): string {
    return `
<svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">

  <!-- Green Circle -->
  <circle cx="50" cy="35" r="20" stroke="green" stroke-width="1" fill="none" />

  <!-- SN Text in Green -->
  <text x="50" y="40" text-anchor="middle" fill="green"
        font-size="10" font-family="Arial" font-weight="bold">
    ${sn}
  </text>

  <!-- Red Dot (optional for consistency) -->
  <circle cx="60" cy="35" r="1.5" fill="red" />

  <!-- 12m Pole ID in Green -->
  <text x="50" y="70" text-anchor="middle" fill="green"
        font-size="8" font-family="Arial" font-weight="bold">
    ${poleId.replace('_', '  ')}
  </text>
</svg>`;
  }

  private generate10mPoleSvg(sn: string, poleId: string): string {
    return `
<svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  
  <!-- Outer Circle -->
  <circle cx="50" cy="35" r="20" stroke="red" stroke-width="1.5" fill="none" />

  <!-- SN Text Inside Circle -->
  <text x="50" y="40" text-anchor="middle" fill="red" font-size="10" font-family="Arial" font-weight="bold">
    ${sn}
  </text>

  <!-- Pole ID Text Below Circle -->
  <text x="50" y="70" text-anchor="middle" fill="red" font-size="8" font-family="Arial" font-weight="bold">
    ${poleId}
  </text>
</svg>`;
  }

  private generate8mPoleSvg(sn: string, poleId: string): string {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- Circle -->
  <circle cx="100" cy="70" r="40" stroke="red" fill="none" stroke-width="1" />

  <!-- Letters S and N -->
  <text x="82" y="78" font-size="28" fill="red" font-family="Arial">S</text>
  <text x="108" y="78" font-size="28" fill="red" font-family="Arial">N</text>

  <!-- Code below -->
  <text x="50%" y="150" text-anchor="middle" font-size="18" fill="red" font-family="Arial">
    NP_SAV-0001
  </text>
</svg>`;
  }

  private generateManholeSvg(name: string): string {
    return `
  <svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <circle cx="50" cy="50" r="30"
          stroke="brown" stroke-width="2" fill="none" />
  <text x="50" y="55" text-anchor="middle" fill="brown"
        font-size="10" font-family="Arial" font-weight="bold">${name}</text>
  </svg>`;
  }

  private generateHandholeSvg(name: string): string {
    return `
  <svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <rect x="20" y="30" width="60" height="40" rx="8" ry="8"
        stroke="darkgreen" stroke-width="2" fill="none" />
  <text x="50" y="55" text-anchor="middle" fill="darkgreen"
        font-size="10" font-family="Arial" font-weight="bold">${name}</text>
  </svg>`;
  }

  private generateOltSvg(name: string, oltNo: string): string {
    return `
<svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">

  <!-- Outer Circle -->
  <circle cx="50" cy="50" r="48"
          stroke="red" stroke-width="1.5" fill="none" />

  <!-- Diamond (rotated square) -->
  <polygon points="50,5 95,50 50,95 5,50"
           stroke="red" stroke-width="1.5" fill="none" />

  <!-- OLT-No Text -->
  <text x="50" y="40" text-anchor="middle"
        fill="red" font-size="10" font-family="Arial" font-weight="bold">
    OLT-No
  </text>

  <!-- Line under OLT -->
  <line x1="25" y1="44" x2="75" y2="44"
        stroke="black" stroke-width="1" />

  <!-- Name Text -->
  <text x="50" y="60" text-anchor="middle"
        fill="red" font-size="12" font-family="Arial" font-weight="bold">
    ${name}
  </text>

  <!-- Line under NAME -->
  <line x1="25" y1="64" x2="75" y2="64"
        stroke="black" stroke-width="1" />

</svg>`;
  }

  private generateJointClosureSvg(name: string): string {
    return `
<svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">

  <!-- Outer rectangle -->
  <rect x="10" y="20" width="80" height="60"
        stroke="red" stroke-width="1.5" fill="none" />

  <!-- Diagonal lines forming X -->
  <line x1="10" y1="20" x2="90" y2="80" stroke="red" stroke-width="1.5"/>
  <line x1="90" y1="20" x2="10" y2="80" stroke="red" stroke-width="1.5"/>

  <!-- Optional text inside -->
  <text x="50" y="55" text-anchor="middle" fill="red"
        font-size="10" font-family="Arial" font-weight="bold">
    ${name}
  </text>
</svg>`;
  }

  private generateTrenchSvg(name: string): string {
    return `
<svg width="200" height="20" viewBox="0 0 100 10"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <line x1="0" y1="5" x2="100" y2="5"
        stroke="sienna" stroke-width="2"
        stroke-dasharray="6,3" />
  <text x="50" y="9" text-anchor="middle"
        font-size="6" fill="sienna" font-family="Arial">${name}</text>
</svg>`;
  }

  private generateDuctSvg(name: string): string {
    return `
<svg width="200" height="30" viewBox="0 0 100 20"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Pipe group -->
  <g stroke="black" stroke-width="0.3">
    <circle cx="15" cy="10" r="4" fill="#FFA500" />
    <circle cx="30" cy="10" r="4" fill="#00BFFF" />
    <circle cx="45" cy="10" r="4" fill="#00FF7F" />
    <circle cx="60" cy="10" r="4" fill="#FF69B4" />
    <circle cx="75" cy="10" r="4" fill="#9370DB" />
  </g>
  <text x="50" y="18" text-anchor="middle"
        font-size="6" fill="black" font-family="Arial">${name}</text>
</svg>`;
  }


  //   private generateFdtSplitterSvg(name: string): string {
  //     return `
  // <svg width="200" height="200" viewBox="0 0 100 100"
  //      xmlns="http://www.w3.org/2000/svg"
  //      style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">

  //   <!-- Outer Box -->
  //   <rect x="15" y="10" width="70" height="80" rx="5" ry="5"
  //         stroke="red" stroke-width="1.5" fill="none" />

  //   <!-- Splitter Tree (4 branches × 4 outputs) -->
  //   <g stroke="red" stroke-width="1">
  //     <!-- First Row -->
  //     <line x1="20" y1="25" x2="40" y2="25" />
  //     <line x1="40" y1="25" x2="50" y2="20" />
  //     <line x1="40" y1="25" x2="50" y2="25" />
  //     <line x1="40" y1="25" x2="50" y2="30" />
  //     <line x1="40" y1="25" x2="50" y2="35" />

  //     <!-- Second Row -->
  //     <line x1="20" y1="40" x2="40" y2="40" />
  //     <line x1="40" y1="40" x2="50" y2="35" />
  //     <line x1="40" y1="40" x2="50" y2="40" />
  //     <line x1="40" y1="40" x2="50" y2="45" />
  //     <line x1="40" y1="40" x2="50" y2="50" />

  //     <!-- Third Row -->
  //     <line x1="20" y1="55" x2="40" y2="55" />
  //     <line x1="40" y1="55" x2="50" y2="50" />
  //     <line x1="40" y1="55" x2="50" y2="55" />
  //     <line x1="40" y1="55" x2="50" y2="60" />
  //     <line x1="40" y1="55" x2="50" y2="65" />

  //     <!-- Fourth Row -->
  //     <line x1="20" y1="70" x2="40" y2="70" />
  //     <line x1="40" y1="70" x2="50" y2="65" />
  //     <line x1="40" y1="70" x2="50" y2="70" />
  //     <line x1="40" y1="70" x2="50" y2="75" />
  //     <line x1="40" y1="70" x2="50" y2="80" />
  //   </g>

  //   <!-- Name Label -->
  //   <text x="50" y="8" text-anchor="middle" fill="red" font-size="7" font-family="Arial">
  //     ${name}
  //   </text>

  //   <!-- Core Count -->
  //   <text x="20" y="95" fill="red" font-size="6" font-family="Arial">
  //     16 Core
  //   </text>
  // </svg>`;
  //   }


  private generateFatSplitterSvg(name: string): string {
    return `
<svg width="200" height="200" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <!-- Outer Rounded Box -->
  <rect x="20" y="20" width="60" height="60" rx="6" ry="6"
        stroke="orange" stroke-width="1.5" fill="none" />

  <!-- Branching Lines -->
  <g stroke="orange" stroke-width="1">
    <line x1="30" y1="40" x2="50" y2="40" />
    <line x1="50" y1="40" x2="55" y2="35" />
    <line x1="50" y1="40" x2="55" y2="45" />

    <line x1="30" y1="60" x2="50" y2="60" />
    <line x1="50" y1="60" x2="55" y2="55" />
    <line x1="50" y1="60" x2="55" y2="65" />
  </g>

  <!-- Labels -->
  // <text x="50" y="18" text-anchor="middle" fill="orange" font-size="7" font-family="Arial">
  //   ${name}
  // </text>
  <text x="25" y="85" fill="orange" font-size="6" font-family="Arial">
    8 Core
  </text>
</svg>`;
  }

  private generateCableSvg(name: string): string {
    const colorMap: { [key: string]: string } = {
      '2C': '#8000FF',   // Violet
      '6C': '#FF00FF',   // Magenta
      '12C': '#00FF00',  // Lime
      '24C': '#0000FF',  // Blue
      '48C': '#FF8000',  // Orange
      '96C': '#8B0000',  // Dark Red
      '144C': '#F4A7B9', // Pink
      '288C': '#D11C6B'  // Rose Red
    };

    const color = colorMap[name] || '#000000'; // Default to black

    return `
<svg width="200" height="30" viewBox="0 0 100 15"
     xmlns="http://www.w3.org/2000/svg"
     style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">
  <g fill="${color}" stroke="black" stroke-width="0.2">
    <rect x="0" y="2" width="10" height="10" />
    <rect x="12" y="2" width="10" height="10" />
    <rect x="24" y="2" width="10" height="10" />
    <rect x="36" y="2" width="10" height="10" />
    <rect x="48" y="2" width="10" height="10" />
    <rect x="60" y="2" width="10" height="10" />
    <rect x="72" y="2" width="10" height="10" />
    <rect x="84" y="2" width="10" height="10" />
  </g>
</svg>`;
  }

  //   private generateFdtSplitterAlternativeSvg(name: string): string {
  //     return `
  // <svg width="200" height="200" viewBox="0 0 100 100"
  //      xmlns="http://www.w3.org/2000/svg"
  //      style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">

  //   <!-- Alternative Design - Circular with ports -->
  //   <circle cx="50" cy="50" r="40" stroke="blue" stroke-width="2" fill="none" />

  //   <!-- Central circle -->
  //   <circle cx="50" cy="50" r="10" fill="blue" />

  //   <!-- Ports -->
  //   <circle cx="20" cy="30" r="5" fill="blue" />
  //   <circle cx="80" cy="30" r="5" fill="blue" />
  //   <circle cx="20" cy="70" r="5" fill="blue" />
  //   <circle cx="80" cy="70" r="5" fill="blue" />

  //   <!-- Connections -->
  //   <line x1="50" y1="50" x2="20" y2="30" stroke="blue" stroke-width="1" />
  //   <line x1="50" y1="50" x2="80" y2="30" stroke="blue" stroke-width="1" />
  //   <line x1="50" y1="50" x2="20" y2="70" stroke="blue" stroke-width="1" />
  //   <line x1="50" y1="50" x2="80" y2="70" stroke="blue" stroke-width="1" />

  //   <!-- Name Label -->
  //   <text x="50" y="20" text-anchor="middle" fill="blue" font-size="8" font-family="Arial">
  //     ${name}
  //   </text>
  // </svg>`;
  //   }

  private generateFdtSplitterAlternativeSvg(splitters: any): string {
    const splitterHeight = 100;
    const spacing = 20;
    const splitterWidth = 200;
    const triangleWidth = 35;
    const fanoutLength = 30;

    const totalHeight = splitters.length * (splitterHeight + spacing) - spacing;
    const outerWidth = 200;

    let svgContent = `<svg width="${outerWidth}" height="${totalHeight + 40}" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">`;

    // Outer rectangle
    svgContent += `<rect x="5" y="5" width="${outerWidth - 10}" height="${totalHeight + 30}" stroke="red" fill="none" stroke-width="1"/>`;

    splitters.forEach((label: any, index: any) => {
      const yOffset = index * (splitterHeight + spacing) + 20;
      const numFanouts = parseInt(label.split("x")[1]);

      // Label
      svgContent += `<text x="20" y="${yOffset + 58}" fill="red" font-family="Arial, sans-serif" font-size="12">${label}</text>`;

      // Box lines
      svgContent += `<line x1="35" y1="${yOffset + 40}" x2="75" y2="${yOffset + 40}" stroke="red" stroke-width="1"/>`; // Top
      svgContent += `<line x1="75" y1="${yOffset + 40}" x2="75" y2="${yOffset + 70}" stroke="red" stroke-width="1"/>`; // Right
      svgContent += `<line x1="75" y1="${yOffset + 70}" x2="35" y2="${yOffset + 70}" stroke="red" stroke-width="1"/>`; // Bottom

      // Triangle
      svgContent += `<polygon points="${75},${yOffset + 55} ${110},${yOffset + 20} ${110},${yOffset + 90}" fill="none" stroke="red" stroke-width="1"/>`;

      // Fanout lines
      const startY = yOffset + 20;
      const endY = yOffset + 90;
      const step = (endY - startY) / (numFanouts - 1);
      for (let i = 0; i < numFanouts; i++) {
        const y = startY + i * step;
        svgContent += `<line x1="110" y1="${y}" x2="130" y2="${y}" stroke="red" stroke-width="1"/>`;
      }

      // Rotated text
      svgContent += `<text x="155" y="${yOffset + 80}" fill="red" font-family="Arial, sans-serif" font-size="12" transform="rotate(270 ${155},${yOffset + 80})">BOX SPL</text>`;
    });

    svgContent += '</svg>';
    return svgContent;
  }



  private createBackgroundLayers() {
    this.backgroundLayers['openstreetmap'] = new TileLayer({
      source: new OSM(),
      properties: { name: 'openstreetmap' },
    });

    // Google Maps Layer (using XYZ source)
    this.backgroundLayers['googlemap'] = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyBQSmG1_89IPYvoFMyZ8G6r13niTiu333Q',
        attributions: 'Google Maps',
      }),
      properties: { name: 'googlemap' },
    });
    this.backgroundLayers['google-satellite'] = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=AIzaSyBQSmG1_89IPYvoFMyZ8G6r13niTiu333Q',
        attributions: 'Google Satellite',
        maxZoom: 20
      }),
      properties: { name: 'google-satellite' },
    });

    this.backgroundLayers['esri-topo'] = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attributions: 'ESRI World Topo Map',
      }),
      properties: { name: 'esri-topo' },
    });

    this.backgroundLayers['esri-gray'] = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attributions: 'ESRI Light Gray Canvas',
      }),
      properties: { name: 'esri-gray' },
    });

    this.backgroundLayers['cartodb-positron'] = new TileLayer({
      source: new XYZ({
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attributions: 'CartoDB Positron (CAD Style)',
      }),
      properties: { name: 'cartodb-positron' },
    });

    this.backgroundLayers['esri-natgeo'] = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        attributions: 'ESRI National Geographic',
      }),
      properties: { name: 'esri-natgeo' },
    });
  }
  private cleanupMaps(): void {
    if (this.olMap) {
      this.olMap.setTarget(undefined);
      this.olMap = null;
    }
    if (this.mlMap) {
      this.mlMap.remove();
      this.mlMap = null;
    }
    if (this.deckgl) {
      this.deckgl.finalize();
      this.deckgl = null;
    }
  }

  initializeCountryBorderLayer() {
    this.countryBorderSource = new VectorSource();
    this.countryBorderLayer = new VectorLayer({
      source: this.countryBorderSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(75, 192, 192, 0.2)',
        }),
        stroke: new Stroke({
          color: '#4BC0C0',
          width: 3,
          lineDash: [10, 5],
        }),
      }),
      visible: false,
    });
    this.olMap.addLayer(this.countryBorderLayer);
  }
  // vectorLayers = {
  //     countryBorder: null as VectorLayer | null,
  //     counties: null as VectorLayer | null,
  //     districts: null as VectorLayer | null
  // };
  vectorLayers: { [key: string]: VectorLayer } = {};
  async onCountryBorderToggle(event: { visible: boolean; name: string }) {
    const layerName = event.name;

    if (!event.visible && this.vectorLayers[layerName]) {
      this.olMap.removeLayer(this.vectorLayers[layerName]!);
      this.vectorLayers[layerName] = null;
      this.layerNames[layerName] = '';

      // Clear list when hiding
      if (layerName === 'counties') this.countiesList = [];
      if (layerName === 'districts') this.districtsList = [];
      return;
    }

    let response: any = [];

    switch (layerName) {
      case 'countryBorder':
        response = await this.apiService.getCountryBorder().toPromise();
        if (response?.length > 0) {
          this.layerNames['countryBorder'] = response[0].adm0Name;
        }
        break;

      case 'counties':
        response = await this.apiService.getCounties().toPromise();
        this.countiesList = response; //  store full list
        this.layerNames['counties'] = response
          .map((item: any) => item.adm1Name)
          .filter(
            (name: string, i: number, arr: string[]) =>
              name && arr.indexOf(name) === i
          )
          .join(', ');
        break;

      case 'districts':
        response = await this.apiService.getDistricts().toPromise();
        this.districtsList = response; //  store full list
        this.layerNames['districts'] = response
          .map((item: any) => item.adm2Name)
          .filter(
            (name: string, i: number, arr: string[]) =>
              name && arr.indexOf(name) === i
          )
          .join(', ');
        break;
    }

    this.loadLayerWithStyle(response, layerName);
  }

  /** Toggle one county by adm1Name */
  onCountyToggle(event: { county: any, visible: boolean }) {
    const { county, visible } = event;
    const layerName = 'counties';
    const vLayer = this.vectorLayers[layerName];
    if (!vLayer) return;

    const src = vLayer.getSource();
    if (!src) return;

    const features = src.getFeatures();
    features.forEach(f => {
      // try a few property name variants depending on the GeoJSON/props you have
      const adm1 = f.get('adm1Name') || f.get('ADM1_NAME') || f.get('adm1') || f.get('ADM1') || '';
      if (adm1 === county.adm1Name) {
        if (visible) this.showFeature(f);
        else this.hideFeature(f);
      }
    });
  }

  /** Toggle one district by adm2Name */
  onDistrictToggle(event: { district: any, visible: boolean }) {
    const { district, visible } = event;
    const layerName = 'districts';
    const vLayer = this.vectorLayers[layerName];
    if (!vLayer) return;

    const src = vLayer.getSource();
    if (!src) return;

    const features = src.getFeatures();
    features.forEach(f => {
      const adm2 = f.get('adm2Name') || f.get('ADM2_NAME') || f.get('adm2') || '';
      if (adm2 === district.adm2Name) {
        if (visible) this.showFeature(f);
        else this.hideFeature(f);
      }
    });
  }


  loadLayerWithStyle(data: CountryBorderData[], layerName: string) {
    // Clear existing layer if it exists
    if (this.vectorLayers[layerName]) {
      this.olMap.removeLayer(this.vectorLayers[layerName]!);
    }

    const features = new GeoJSON().readFeatures(
      {
        type: 'FeatureCollection',
        features: data.map((item) => ({
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: item.geom?.coordinates,
          },
          properties: { ...item },
        })),
      },
      { dataProjection: 'EPSG:4326' }
    );

    const vectorSource = new VectorSource({ features });

    // Apply different styles per layer
    const style = this.getLayerStyle(layerName);

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style,
    });

    this.olMap.addLayer(vectorLayer);
    this.vectorLayers[layerName] = vectorLayer;
  }

  getLayerStyle(layerName: string): Style {
    switch (layerName) {
      case 'countryBorder':
        return new Style({
          stroke: new Stroke({ color: '#000000', width: 2 }), // Black border
        });
      case 'counties':
        return new Style({
          fill: new Fill({ color: 'rgba(66, 133, 244, 0.2)' }), // Light blue fill
          stroke: new Stroke({ color: '#4285F4', width: 1 }), // Blue border
        });
      case 'districts':
        return new Style({
          fill: new Fill({ color: 'rgba(219, 68, 55, 0.2)' }), // Light red fill
          stroke: new Stroke({ color: '#DB4437', width: 1 }), // Red border
        });
      default:
        return new Style(); // Default style
    }
  }

  private initializeOpenLayersMap(): void {
    const osmLayer = new TileLayer({ source: new OSM(), visible: true });
    // const vectorSource = new VectorSource();
    this.vectorSource = new VectorSource();
    this.basemapLayer = osmLayer;

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.createFeatureStyle.bind(this),
      properties: { type: 'data' },
      visible: true,
    });

    this.initializeLayers();

    // Explicitly type as OpenLayers MapOptions
    const olMapOptions: import('ol/Map').MapOptions = {
      target: 'map-container', // This is now properly typed
      layers: [
        this.basemapLayer,
        // osmLayer,
        this.vectorLayer,
        ...Object.values(this.layersConfig).map((l) => l.layer),
      ],
      view: new View({
        center: [37.86427724795533, -0.20753488739339332],
        zoom: 6,
        projection: 'EPSG:4326',
      }),
      controls: defaultControls({
        attribution: false,
        zoom: false,
        rotate: false,
      }),
    };

    this.olMap = new OlMap(olMapOptions);
    this.basemapVisible = true;

    this.currentBackgroundLayer = this.basemapLayer;
  }

  private initializeMapLibreMap(): void {
    const mlMapOptions: import('maplibre-gl').MapOptions = {
      container: 'map-container',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      interactive: false,
      attributionControl: false,
    };

    this.mlMap = new MapLibreMap(mlMapOptions);

    // this.initializeLayers();
    this.mlMap.on('load', () => {
      this.deckgl = new MapboxOverlay({
        layers: [],
      });

      this.mlMap.addControl(this.deckgl);

      // this.map.addControl(this.deckgl);
      // Load existing building layer if data exists
      if (this.buildings?.length) {
        this.addScatterplotLayer(
          'building-points',
          this.buildings,
          [255, 140, 0],
          ['name', 'buildingType', 'category']
        );
      }
      // Load existing pop layer if data exists
    });
  }

  addScatterplotLayer(
    layerId: string,
    data: any[],
    color: [number, number, number],
    tooltipFields: string[]
  ): void {
    if (!this.deckgl || !data?.length) return;
    const layer = new ScatterplotLayer({
      id: layerId,
      data,
      getPosition: (d: any) => d?.geom?.coordinates || [0, 0],
      getFillColor: color,
      getRadius: 1000,
      pickable: true,
      onHover: ({ object, x, y }) => {
        const tooltip = document.getElementById('tooltip');
        if (object && tooltip) {
          tooltip.style.display = 'block';
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.innerHTML = tooltipFields
            .map(
              (field) => `
          <strong>${field}:</strong> ${object[field] || '-'}
        `
            )
            .join('<br/>');
        }
      },
      onClick: ({ object }) => {
        console.log(`${layerId} clicked:`, object);
      },
    });
    // Merge with existing layers without removing others
    const existingLayers = this.deckgl.props?.layers || [];
    const filteredLayers = existingLayers.filter((l: any) => l.id !== layerId);
    this.deckgl.setProps({
      layers: [...filteredLayers, layer],
    });
  }

  private initializeLayers(): void {
    const baseLayers = {
      countryBorder: {
        layerName: 'Keyna-country-border',
        displayName: 'Country Border',
        initialVisibility: false,
        img: 'assets/icons/c-border.svg',
      },
      counties: {
        layerName: 'Keyna-counties',
        displayName: 'Counties',
        initialVisibility: false,
        img: 'assets/icons/counties.svg',
      },
      districts: {
        layerName: 'Keyna-districts',
        displayName: 'Districts',
        initialVisibility: false,
        img: 'assets/icons/districts.svg',
      },
      cableLines: {
        layerName: 'cables',
        displayName: 'Cable Lines',
        initialVisibility: false,
        img: 'assets/icons/cable.svg',
      },
      surveyArea: {
        layerName: 'surveyArea',
        displayName: 'Survey Area',
        initialVisibility: false,
        img: 'assets/icons/surveyarea.svg',
      },
    };

    Object.entries(baseLayers).forEach(([key, config]) => {
      this.layersConfig[key] = {
        name: key,
        displayName: config.displayName,
        visible: config.initialVisibility,
        layer: this.createWmsLayer(config.layerName, config.initialVisibility),
        opacity: 0.5,
        img: config.img || '',
        properties: { type: 'overlay' },
      };
    });
  }

  startDrawing(type: 'Polygon' | 'LineString' | 'Point'): void {
    this.isSurveyShow = false;
    if (type == 'Point') {
      if (
        !this.selectedSurveyAreaId ||
        !this.selectedSurveyAreas[this.selectedSurveyAreaId]
      ) {
        this.toastr.warning(
          'Please select a survey area first before adding points'
        );
        this.currentDrawingMode = null;
        return;
      }

      const selectedSurvey = this.surveyAreas.find(
        (area) => area.id === this.selectedSurveyAreaId);
      if (
        selectedSurvey?.surveyStatusName === 'Initiated' ||
        selectedSurvey?.surveyStatusName === 'Assigned'
      ) {
        this.toastr.warning(
          `Please change the survey status to In Progress.`
        );
        this.currentDrawingMode = null;
        return;
      }

      this.currentDrawingMode = type;
      this.clearFormContainer();
      this.addNetworkElement = false;
      this.showCableOption = false;
      this.showRectangleOption = false;
      this.showForm = false;
      // this.clearDrawings();
      this.drawingType = 'Point';
      this.layerDialog.show(this.currentSurveyStage);
      this.removeDrawInteraction();
      // Set up point drawing with validation
      const style = this.getStyleForType('Point', this.selectedLayer);
      this.drawInteraction = new Draw({
        source: this.vectorLayer.getSource()!,
        type: 'Point',
        style: style,
      });

      this.drawInteraction.on('drawend', (event) => {
        const coordinates = (
          event.feature.getGeometry() as Point
        ).getCoordinates();
        const lonLat = transform(
          coordinates,
          this.olMap.getView().getProjection(),
          'EPSG:4326'
        );

        // Check if point is within survey area
        if (!this.isPointInSurveyArea(lonLat)) {
          // Mark invalid point
          const invalidFeature = new Feature({
            geometry: new Point(coordinates),
            isInvalidPoint: true,
          });
          this.vectorLayer.getSource()?.addFeature(invalidFeature);
          this.toastr.warning(
            'Point must be placed within the selected survey area'
          );
          // Remove the drawn point
          this.vectorLayer.getSource()?.removeFeature(event.feature);
          return;
        }

        // If point is valid, proceed with form
        if (this.currentFormComponent?.instance) {
          this.currentFormComponent.instance.updateCoordinates(lonLat);
        }
      });

      this.olMap.addInteraction(this.drawInteraction);
      return;

      // In your startDrawing method for LineString
    } else if (type === 'LineString') {
      if (!this.selectedSurveyAreaId) {
        this.toastr.warning(
          'Please select a survey area first before drawing lines'
        );
        this.currentDrawingMode = null;
        return;
      }
      this.currentDrawingMode = type;
      this.addNetworkElement = true;
      this.showCableOption = true;
      this.clearFormContainer();
      this.selectedLayer = 'cable';
      this.showForm = true;
      Promise.resolve().then(() => {
        this.loadFormComponent();
      });

      this.cdr.detectChanges();

      setTimeout(() => {
        this.removeDrawInteraction();
        this.drawInteraction = new Draw({
          source: this.vectorLayer.getSource()!,
          type: 'LineString',
          style: this.getStyleForType('LineString'),
        });

        this.drawInteraction.on('drawend', (event) => {
          const geometry = event.feature.getGeometry();
          if (geometry && geometry.getType() === 'LineString') {

            // --- ADD THIS For Draw cable Visible---
            event.feature.set('type', 'cable');
            event.feature.set('layerName', 'cable');

            const lineString = geometry as LineString;
            const coords = lineString.getCoordinates();
            this.currentLineCoordinates = coords.map(coord => {
              if (Array.isArray(coord) && coord.length >= 2) {
                const transformed = transform(coord, this.olMap.getView().getProjection(), 'EPSG:4326');
                return [transformed[0], transformed[1]];
              }
              return [0, 0];
            });


            if (
              this.currentFormComponent?.instance &&
              'updateLineCoordinates' in this.currentFormComponent.instance
            ) {
              this.currentFormComponent.instance.updateLineCoordinates(coords);
              const length = this.calculateLineLength(coords);
              this.currentFormComponent.instance.form.patchValue({
                measuredLengthM: length,
              });
            }
          }
        });
        this.olMap.addInteraction(this.drawInteraction);
      });
      return;
    } else {
      this.addNetworkElement = false;
      this.showCableOption = false;
    }
    this.removeDrawInteraction();
    const style = this.getStyleForType(type);
    this.drawInteraction = new Draw({
      source: this.vectorLayer.getSource()!,
      type: type,
      style: style,
    });

    this.drawInteraction.on('drawend', (event) => {
      if (this.currentFormComponent?.instance) {
        const coordinates = (
          event.feature.getGeometry() as Point
        ).getCoordinates();
        const lonLat = coordinates;
        this.currentFormComponent.instance.updateCoordinates(lonLat);
      }
    });

    this.olMap.addInteraction(this.drawInteraction);
  }
  private calculateLineLength(coords: number[][]): number {
    let length = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lon1, lat1] = coords[i - 1];
      const [lon2, lat2] = coords[i];
      length += this.haversineDistance(lat1, lon1, lat2, lon2);
    }
    return Math.round(length * 1000); // Convert km to meters and round
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private getStyleForType(type: string, selectedLayer?: string): Style {
    switch (type) {
      case 'Point':
        switch (selectedLayer) {
          case 'fat':
            return new Style({
              image: new Icon({
                src: 'assets/icons/fat.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });
          case 'splitter':
            return new Style({
              image: new Icon({
                src: 'assets/icons/splitter.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });
          case 'fdt':
            return new Style({
              image: new Icon({
                src: 'assets/icons/fdt.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case 'olt':
            return new Style({
              image: new Icon({
                src: 'assets/icons/olt.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case '8m poles':
            return new Style({
              image: new Icon({
                src: 'assets/icons/8m.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case '10m poles':
            return new Style({
              image: new Icon({
                src: 'assets/icons/10m.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case '12m poles':
            return new Style({
              image: new Icon({
                src: 'assets/icons/12m.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case 'SDU':
            return new Style({
              image: new Icon({
                src: 'assets/icons/sdu.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case 'MDU':
            return new Style({
              image: new Icon({
                src: 'assets/icons/mdu.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case 'CDU':
            return new Style({
              image: new Icon({
                src: 'assets/icons/cdu.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          case 'jointclosure':
            return new Style({
              image: new Icon({
                src: 'assets/icons/joint_closure.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });

          default:
            return new Style({
              image: new Icon({
                src: 'assets/default.svg',
                scale: 0.5,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
              }),
            });
        }

      case 'LineString':
        return new Style({
          stroke: new Stroke({
            color: '#00C853',
            width: 4,
            lineDash: [10, 5],
          }),
        });

      case 'Rectangle':
        return new Style({
          fill: new Fill({
            color: 'rgba(66, 133, 244, 0.3)',
          }),
          stroke: new Stroke({
            color: '#4285F4',
            width: 3,
            lineDash: [5, 5],
          }),
        });

      case 'Polygon':
        return new Style({
          fill: new Fill({
            color: 'rgba(66, 133, 244, 0.3)',
          }),
          stroke: new Stroke({
            color: '#4285F4',
            width: 3,
            lineDash: [5, 5],
          }),
        });

      default:
        return new Style();
    }
  }

  private removeDrawInteraction(): void {
    if (this.drawInteraction) {
      this.olMap.removeInteraction(this.drawInteraction);
      this.drawInteraction = null;
    }
  }

  clearDrawings(): void {
    // this.currentDrawingMode = null;
    this.removeDrawInteraction();
    const source = this.vectorLayer.getSource();
    if (source) {
      source.getFeatures().forEach((feature) => {
        // Only remove features that are NOT survey area or survey features
        if (
          !feature.get('isSurveyArea') && // keep survey area polygon
          !feature.get('layerName') // keep loaded survey features (like FAT, pole, etc.)
        ) {
          source.removeFeature(feature);
        }
      });
    }
    this.addNetworkElement = false;
    this.isShowLayers = false;
    this.isSurveyShow = false;
  }

  onCloseLayerPanel(): void {
    this.isShowLayers = false;
    this.isSurveyShow = false;
  }

  startDrawingRectangle(): void {
    const userRoles = localStorage.getItem('userRoles');
    if (userRoles) {
      this.clearFormContainer();

      // Show the form and component immediately
      this.addNetworkElement = true;
      this.showRectangleOption = true;
      this.showCableOption = false;
      this.showForm = true;

      this.cdr.detectChanges();

      //  Create component immediately
      const factory =
        this.componentFactoryResolver.resolveComponentFactory(
          SurveyAreaComponent
        );
      this.currentFormComponent = this.formContainer.createComponent(factory);

      //  Subscribe to form submit early (optional)
      const sub = this.currentFormComponent.instance.formSubmit?.subscribe(
        (formData: any) => {
          this.onFormSubmit(formData);
        }
      );
      if (sub) {
        this.currentFormComponent.onDestroy(() => sub.unsubscribe());
      }

      //  Now allow drawing
      this.removeDrawInteraction();

      this.drawInteraction = new Draw({
        source: this.vectorLayer.getSource()!,
        type: 'Circle',
        geometryFunction: createBox(),
        style: this.getStyleForType('Rectangle'),
      });

      this.drawInteraction.on('drawend', (event) => {
        event.feature.set('isRectangle', true);
        const geometry = event.feature.getGeometry();

        if (geometry && geometry.getType() === 'Polygon') {
          const coords = (geometry as Polygon).getCoordinates();

          //  Just update coordinates in existing component
          if (this.currentFormComponent?.instance.updateCoordinates) {
            this.currentFormComponent.instance.updateCoordinates(coords);
          }

          this.cdr.detectChanges();
        }
      });
      this.olMap.addInteraction(this.drawInteraction);
    } else {
      this.toastr.error(
        'Only admin users are allowed to create surveys.',
        'Warning'
      );
    }
  }

  getLayers(): LayerConfig[] {
    return [
      this.layersConfig['countryBorder'],
      this.layersConfig['counties'],
      this.layersConfig['districts'],
      this.layersConfig['building'],
      this.layersConfig['cableLines'],
      this.layersConfig['customerPoints'],
      this.layersConfig['fat'],
      this.layersConfig['fdt'],
      this.layersConfig['olt'],
      this.layersConfig['fdc'],
      this.layersConfig['fdp'],
      this.layersConfig['pop'],
      this.layersConfig['splitter'],
      this.layersConfig['jointclosure'],
      this.layersConfig['8m poles'],
      this.layersConfig['10m poles'],
      this.layersConfig['12m poles'],
      this.layersConfig['manHole'],
      this.layersConfig['handHole'],
      this.layersConfig['buildingsdu'],
      this.layersConfig['buildingmdu'],
      this.layersConfig['buildingcdu'],
      this.layersConfig['surveyArea'],
    ].filter((layer) => layer);
  }

  private createWmsLayer(layerName: string, visible: boolean): TileLayer {
    return new TileLayer({
      source: new TileWMS({
        // url: 'http://164.52.212.187/cgi-bin/mapserv',
        params: {
          MAP: '/var/serv/mapserver/maps/FtthGisMvp/kenya-main-3-db.map',
          // 'LAYERS': layerName,
          VERSION: '1.3.0',
          FORMAT: 'image/png',
          TRANSPARENT: 'TRUE',
          CRS: 'EPSG:4326',
        },
        serverType: 'mapserver',
        crossOrigin: 'anonymous',
      }),
      opacity: 0.5,
      visible,
    });
  }

  public updateWmsLayer(layerName: string): void {
    const layerConfig = this.layersConfig[layerName];
    if (layerConfig) {
      const source = layerConfig.layer.getSource();
      if (source && source instanceof TileWMS) {
        source.updateParams({
          LAYERS: layerName,
        });
      }
    }
  }

  public updateViewExtent(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): void {
    this.olMap.getView().fit([minX, minY, maxX, maxY], {
      padding: [50, 50, 50, 50],
      nearest: true,
    });
  }

  toggleLayer(layerName: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (layerName === 'surveyArea') {
      if (isChecked) {
        this.loadSurveyAreas();
      } else {
        // Clear survey area display when unchecked
        this.vectorLayer.getSource()?.clear();
        this.selectedSurveyAreaId = null;
        this.currentSurveyAreaPolygon = null;
      }
    }

    if (layerName === 'pole') {
      this.isPoleChecked = isChecked;
      if (isChecked) {
        this.loadAndDisplayPoles(); // Will handle pole API call
      } else {
        this.removePoleLayer();
      }
    } else if (layerName === 'fat') {
      this.isFatChecked = isChecked;
      if (isChecked) {
        this.loadAndDisplayFats(); // Will handle FAT API call
      } else {
        this.removeFatLayer();
      }
    } else {
      // Existing logic for WMS layers
      if (this.layersConfig[layerName]) {
        this.layersConfig[layerName].visible = isChecked;
        this.layersConfig[layerName].layer.setVisible(isChecked);
      }

      // Special handling for survey area layer
      if (layerName === 'surveyArea' && isChecked) {
        this.loadSurveyAreas();
      }
    }
  }

  private removePoleLayer(): void {
    this.removeLayerFromDeckgl('pole-points');
    this.poles = []; // Clear pole data
  }

  private removeFatLayer(): void {
    this.removeLayerFromDeckgl('fat-points');
    this.fats = []; // Clear FAT data
  }
  private removeLayerFromDeckgl(layerId: string): void {
    if (!this.deckgl) return;

    const existingLayers = this.deckgl.props?.layers || [];
    const filteredLayers = existingLayers.filter((l: any) => l.id !== layerId);
    this.deckgl.setProps({
      layers: filteredLayers,
    });
  }

  private loadAndDisplayPoles(): void {
    this.apiService.getAllPoles().subscribe({
      next: (response: any) => {
        this.poles = response?.data || [];
      },
      error: (error) => {
        console.error('Error loading poles:', error);
        this.toastr.error('Failed to load poles');
      },
    });
  }

  private loadAndDisplayFats(): void {
    this.apiService.getAllFats().subscribe({
      next: (response: any) => {
        this.fats = response?.data || [];
      },
      error: (error) => {
        console.error('Error loading FATs:', error);
        this.toastr.error('Failed to load FATs');
      },
    });
  }

  loadSurveyAreas() {
    // Get userId from your authentication service or local storage
    const userId = this.apiService.getUserId();
    const mvnoId = this.apiService.getMvnoId();
    if (!userId) {
      this.toastr.warning('User ID not found');
      return;
    }
    // Clear previous selections
    Object.keys(this.selectedSurveyAreas).forEach((id) => {
      this.removeSurveyAreaWMSLayer(Number(id));
    });

    this.selectedSurveyAreas = {};
    this.apiService.getsurveyArea(userId, mvnoId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.surveyAreas = response.data || [];
          if (this.surveyAreas.length > 0) {
            // Display the first survey area by default
            // this.displaySurveyAreaPolygon(this.surveyAreas[0]);
            // this.selectedSurveyAreaId = this.surveyAreas[0].id;
            // this.currentSurveyAreaPolygon = this.surveyAreas[0].geom;
            // // Zoom to the survey area
            // this.zoomToSurveyArea(this.surveyAreas[0]);
          }
        } else {
          this.toastr.warning(response.message || 'No survey areas found');
        }
      },
    });
  }

  private displaySelectedFeature(featureData: any, layerName: string): void {
    this.clearSelections();
    // Create a blue circle marker for the selected feature
    const coordinates = featureData.geom.coordinates;
    const point = new Point(fromLonLat(coordinates));

    const feature = new Feature({
      geometry: point,
      ...featureData,
      isSelected: true,
      layerName: layerName,
    });
    const color = {
      pole: [0, 100, 255], // Blue
      fat: [255, 0, 0], // Red
      building: [255, 140, 0], // Orange
    }[layerName];
    // Style for selected feature (blue circle)
    // feature.setStyle(new Style({
    //   image: new CircleStyle({
    //     radius: 10,
    //     fill: new Fill({ color: `rgba(${color.join(',')}, 0.7)` }),
    //     stroke: new Stroke({ color: 'white', width: 2 })
    //   })
    // }));
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: 'rgba(66, 133, 244, 0.7)' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
        }),
      })
    );

    this.vectorLayer.getSource()?.addFeature(feature);
    this.showFeatureDetailsPopup(featureData, layerName);
  }

  private showFeatureDetailsPopup(featureData: any, layerName: string): void {
    this.selectedFeatureDetails = {
      ...featureData,
      layerName: layerName,
    };
    this.showFeatureDetails = true;
  }

  OpenControls() {
    this.isShowLayers = !this.isShowLayers;
    this.isShowElements = false;
    this.isSurveyShow = false;
  }

  OpenElements() {
    this.isShowElements = !this.isShowElements;
    this.isShowLayers = false;
    this.isSurveyShow = false;
  }

  onLayerChange() {
    this.clearFormContainer();
    if (!this.selectedLayer) {
      this.showForm = false;
      return;
    }
    this.showForm = true;
    // Use setTimeout to ensure change detection runs
    setTimeout(() => {
      this.loadFormComponent();
    });
  }

  private loadFormComponent() {
    let component: any;

    switch (this.selectedLayer) {
      case 'customerPoint':
        component = CustomerPointComponent;
        break;
      case 'fdp':
        component = FdpComponent;
        break;
      case 'fat':
        component = FatComponent;
        break;
      case 'fdt':
        component = FdtComponent;
        break;
      case 'olt':
        component = OltComponent;
        break;
      case 'cable':
        component = CableComponent;
        break;
      case 'building':
        component = BuildingComponent;
        break;
      case 'fdc':
        component = FdcComponent;
        break;
      case 'splitter':
        component = SplitterComponent;
        break;
      case 'pop':
        component = PopComponent;
        break;
      case 'jointclosure':
        component = JointComponent;
        break;
      case '8m poles':
      case '10m poles':
      case '12m poles':
        component = PoleComponent;
        break;
      case 'manHole':
        component = ManHoleComponent;
        break;
      case 'handHole':
        component = HandHoleComponent;
        break;
      case 'surveyArea':
        component = SurveyAreaComponent;
        break;
      case 'SDU':
      case 'MDU':
      case 'CDU':
        component = BuildlingTypeComponent;
        break;
      default:
        this.showForm = false;
        return;
    }
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    this.currentFormComponent = this.formContainer.createComponent(factory);
    // Pass survey area ID to the form component
    if (
      this.selectedSurveyAreaId &&
      this.currentFormComponent?.instance?.setSurveyAreaId
    ) {
      this.currentFormComponent.instance.setSurveyAreaId(
        this.selectedSurveyAreaId
      );
    }

    if (
      ['8m poles', '10m poles', '12m poles'].includes(this.selectedLayer) &&
      this.currentFormComponent.instance
    ) {
      this.currentFormComponent.instance.poleSizeType = this.selectedLayer as
        | '8m poles'
        | '10m poles'
        | '12m poles';

      //  Automatically refresh pole layer on submit
      const poleCreatedSub =
        this.currentFormComponent.instance.poleCreated?.subscribe(() => {
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); //  reload the map layer
          }
        });

      //  Clean up on destroy
      this.currentFormComponent.onDestroy(() => {
        poleCreatedSub?.unsubscribe();
      });
    }

    //  Pass buildingType input if using BuildlingTypeComponent
    if (
      ['SDU', 'MDU', 'CDU'].includes(this.selectedLayer) &&
      this.currentFormComponent?.instance
    ) {
      this.currentFormComponent.instance.buildingType = this.selectedLayer as
        | 'SDU'
        | 'MDU'
        | 'CDU';

      //  Automatically refresh building layer on submit
      const buildingCreatedSub =
        this.currentFormComponent.instance.buildingCreated?.subscribe(() => {
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); //  reload the layer without manual refresh
          }
        });

      //  Clean up on destroy
      this.currentFormComponent.onDestroy(() => {
        buildingCreatedSub?.unsubscribe();
      });
    }

    // FAT extra input
    if (this.selectedLayer === 'fat' && this.currentSurveyAreaPolygon) {
      this.currentFormComponent.instance.surveyAreaGeometry =
        this.currentSurveyAreaPolygon;
    }

    if (this.selectedLayer === 'fdt' && this.selectedSurveyAreaId) {
      const fdtCloseSub =
        this.currentFormComponent.instance.closeForm?.subscribe(() => {
          this.handleFormClose();
          this.currentDrawingMode = null;
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); // <--- reload features
          }
        });

      const fdtSubmitSub =
        this.currentFormComponent.instance.formSubmit?.subscribe(
          (formData: any) => {
            this.onFormSubmit(formData);

            let res = this.apiService.getsurveyAreaByUser(
              formData.surveyAreaId
            );

            this.handleFormClose(); // Close the form after submission
            this.currentDrawingMode = null; //  Also deactivate "Point" button on submit
          }
        );

      this.currentFormComponent.onDestroy(() => {
        fdtCloseSub?.unsubscribe();
        fdtSubmitSub?.unsubscribe();
      });
    }

    if (this.selectedLayer === 'olt' && this.selectedSurveyAreaId) {
      const oltCloseSub =
        this.currentFormComponent.instance.closeForm?.subscribe(() => {
          this.handleFormClose();
          this.currentDrawingMode = null;
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); // <--- reload features
          }
        });

      const oltSubmitSub =
        this.currentFormComponent.instance.formSubmit?.subscribe(
          (formData: any) => {
            this.onFormSubmit(formData);

            let res = this.apiService.getsurveyAreaByUser(
              formData.surveyAreaId
            );

            this.handleFormClose(); // Close the form after submission
            this.currentDrawingMode = null; //  Also deactivate "Point" button on submit
          }
        );

      this.currentFormComponent.onDestroy(() => {
        oltCloseSub?.unsubscribe();
        oltSubmitSub?.unsubscribe();
      });
    }

    if (this.selectedLayer === 'jointclosure' && this.selectedSurveyAreaId) {
      const jointClosureCloseSub =
        this.currentFormComponent.instance.closeForm?.subscribe(() => {
          this.handleFormClose();
          this.currentDrawingMode = null;
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); // <--- reload features
          }
        });

      const jointClosureSubmitSub =
        this.currentFormComponent.instance.formSubmit?.subscribe(
          (formData: any) => {
            this.onFormSubmit(formData);

            let res = this.apiService.getsurveyAreaByUser(
              formData.surveyAreaId
            );

            this.handleFormClose(); // Close the form after submission
            this.currentDrawingMode = null; //  Also deactivate "Point" button on submit
          }
        );

      this.currentFormComponent.onDestroy(() => {
        jointClosureCloseSub?.unsubscribe();
        jointClosureSubmitSub?.unsubscribe();
      });
    }

    // Set survey area ID if one is selected - ADD THIS RIGHT HERE
    if (
      this.selectedSurveyAreaId &&
      this.currentFormComponent?.instance?.setSurveyAreaId
    ) {
      this.currentFormComponent.instance.setSurveyAreaId(
        this.selectedSurveyAreaId
      );
    }

    if (this.selectedLayer === 'surveyArea') {
      const surveyAreaInstance = this.currentFormComponent
        .instance as SurveyAreaComponent;

      // Subscribe to form submission
      const sub = surveyAreaInstance.formSubmit.subscribe((formData: any) => {
        this.onFormSubmit(formData);

        this.handleFormClose(); // Close after successful submission
      });

      // Subscribe to close event
      const closeSub = surveyAreaInstance.closeForm.subscribe(() => {
        this.handleFormClose();
      });

      this.currentFormComponent.onDestroy(() => {
        sub.unsubscribe();
        closeSub.unsubscribe();
      });
    }
    // for send selected survey id
    if (this.selectedLayer === 'fat' && this.selectedSurveyAreaId) {
      // const factory = this.componentFactoryResolver.resolveComponentFactory(FatComponent);
      // this.currentFormComponent = this.formContainer.createComponent(factory);

      if (this.currentSurveyAreaPolygon) {
        this.currentFormComponent.instance.surveyAreaGeometry =
          this.currentSurveyAreaPolygon;
      }

      //  Subscribe to closeForm to deactivate the draw point button
      const fatCloseSub =
        this.currentFormComponent.instance.closeForm?.subscribe(() => {
          this.handleFormClose();
          this.currentDrawingMode = null;
          if (this.selectedSurveyAreaId) {
            this.loadAndDisplaySurveyData(this.selectedSurveyAreaId); // <--- reload features
          }
        });

      const fatSubmitSub =
        this.currentFormComponent.instance.formSubmit?.subscribe(
          (formData: any) => {
            this.onFormSubmit(formData);

            let res = this.apiService.getsurveyAreaByUser(
              formData.surveyAreaId
            );

            this.handleFormClose(); // Close the form after submission
            this.currentDrawingMode = null; //  Also deactivate "Point" button on submit
          }
        );

      this.currentFormComponent.onDestroy(() => {
        fatCloseSub?.unsubscribe();
        fatSubmitSub?.unsubscribe();
      });
    }

    if (
      [
        'fat',
        'fdt',
        'olt',
        '8m poles',
        '10m poles',
        '12m poles',
        'SDU',
        'MDU',
        'CDU',
        'jointclosure'
      ].includes(this.selectedLayer)
    ) {
      this.attachFormEvents(this.currentFormComponent.instance);
    }
    // Handle line coordinates for cable component
    if (
      this.selectedLayer !== 'cable' &&
      this.currentFormComponent.instance.updateCoordinates
    ) {
      const geometry = this.vectorLayer
        .getSource()
        ?.getFeatures()[0]
        ?.getGeometry();

      if (geometry?.getType() === 'Point') {
        // For Point geometry
        const coords = (geometry as Point).getCoordinates();
        // this.currentFormComponent.instance.updateCoordinates(coords);
      } else if (geometry?.getType() === 'Polygon') {
        // For Polygon geometry - take first coordinate
        const polygonCoords = (geometry as Polygon).getCoordinates();
        if (polygonCoords.length > 0 && polygonCoords[0].length > 0) {
          this.currentFormComponent.instance.updateCoordinates(
            polygonCoords[0][0]
          );
        }
      }
    }
    // Handle form submission
    const sub = this.currentFormComponent.instance.formSubmit?.subscribe(
      (formData: any) => {
        this.onFormSubmit(formData);
        this.handlePopUpdateSuccess(formData);
        this.handleFormClose(); // Close the form after submission
      }
    );

    const closeSub = this.currentFormComponent.instance.closeForm?.subscribe(
      () => {
        this.handleFormClose();
      }
    );
    this.currentFormComponent.onDestroy(() => {
      sub?.unsubscribe();
      closeSub?.unsubscribe();
      // this.currentFormComponent?.instance.cleanupMarker();
    });

    if (sub) {
      this.currentFormComponent.onDestroy(() => sub.unsubscribe());
    }
    this.cdr.detectChanges();
  }

  private attachFormEvents(instance: any): void {
    const submitSub = instance.formSubmit?.subscribe((formData: any) => {
      this.onFormSubmit(formData);
      this.handleFormClose();
      this.currentDrawingMode = null; //  Deactivate the Point button
    });

    const closeSub = instance.closeForm?.subscribe(() => {
      this.handleFormClose();
      this.currentDrawingMode = null; //  Deactivate the Point button
    });

    this.currentFormComponent.onDestroy(() => {
      submitSub?.unsubscribe();
      closeSub?.unsubscribe();
    });
  }

  clearFormContainer() {
    if (this.currentFormComponent) {
      this.currentFormComponent.destroy();
      this.currentFormComponent = null;
    }
    if (this.formContainer) {
      this.formContainer.clear();
    }
  }

  onFormSubmit(formData: any) {

    this.clearDrawings();

    if (formData?.geom && formData?.geom?.type === 'LineString') {
      const lineCoords = formData.geom.coordinates.map((coord: number[]) =>
        fromLonLat(coord)
      );
      this.addLineToMap(lineCoords, formData);
      this.updateWmsLayer(this.selectedLayer);

    } else if (formData.longitude && formData.latitude) {
      // Handle point-based components
      const mapCoords = fromLonLat([formData.longitude, formData.latitude]);
      this.addPointToMap(mapCoords, formData);
      // Add to the appropriate WMS layer
      this.updateWmsLayer(this.selectedLayer);
    }
    // Reset the form
    this.addNetworkElement = false;
    this.showForm = false;
  }

  private addLineToMap(coords: number[][], properties: any) {
    const { geom, ...restProps } = properties;
    const feature = new Feature({
      geometry: new LineString(coords),
      ...restProps,
      layerName: 'cable',
    });
    this.vectorLayer.getSource()?.addFeature(feature);
  }

  private addPointToMap(coords: number[], properties: any) {
    const { longitude, latitude, ...restProps } = properties;
    const pointCoords = coords.length >= 2 ? [coords[0], coords[1]] : coords;
    const feature = new Feature({
      geometry: new Point(pointCoords),
      ...restProps,
    });

    // Make sure to add to your data layer
    this.vectorLayer.getSource()?.addFeature(feature);
  }

  OpenForm() {
    this.addNetworkElement = !this.addNetworkElement;
    this.showCableOption = false; // Reset cable option visibility when toggling form
  }

  onSearchTyping(): void {
    // Just hide the form — do NOT call search here
    this.addNetworkElement = false;
    this.showForm = false;
    this.showCableOption = false;
    this.showRectangleOption = false;
  }

  onEnterSearch(): void {
    this.search(); // Call actual search logic only on Enter
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.geocodingService.search(this.searchQuery).subscribe({
      next: (results: any[]) => {
        this.searchResults = results.map((result) => ({
          name: result.display_name,
          type: result.type,
          longitude: parseFloat(result.lon),
          latitude: parseFloat(result.lat),
          boundingbox: result.boundingbox,
        }));
      },
      error: (error: any) => {
        console.error('Search error:', error);
        this.searchResults = [];
      },
    });
  }

  zoomToResult(result: any) {
    // Clear search results to close dropdown
    this.searchResults = [];

    if (result.boundingbox) {
      // Convert bounding box to map extent
      const [minLat, maxLat, minLon, maxLon] = result.boundingbox;
      const extent = [
        parseFloat(minLon),
        parseFloat(minLat),
        parseFloat(maxLon),
        parseFloat(maxLat),
      ];

      this.olMap.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 12,
        duration: 500,
      });
    } else if (result.longitude && result.latitude) {
      // For point results
      const center = fromLonLat([result.longitude, result.latitude]);
      this.olMap.getView().animate({
        center: center,
        zoom: 12,
        duration: 500,
      });
    }
    this.updateLocationMarker([result.longitude, result.latitude]);
  }

  switchToAdminPanel() {
    this.router.navigate(['/home']);
  }

  clearTemporaryDrawingPoints() {
    const source = this.vectorLayer.getSource();
    if (!source) return;
    // Remove features that are not survey area and not permanent (e.g., not in allFeatures)
    source.getFeatures().forEach((feature) => {
      // Remove features that are not survey area polygons and not in allFeatures
      if (
        !feature.get('isSurveyArea') &&
        !feature.get('isSelected') &&
        !feature.get('layerName') // Only remove if not a permanent feature
      ) {
        source.removeFeature(feature);
      }
    });
  }

  onLayerSelected(layer: string) {
    this.selectedLayer = layer;
    // Clear any temporary/drawing points before opening new form
    this.clearTemporaryDrawingPoints();

    this.addNetworkElement = true;
    this.showForm = true;
    this.onLayerChange();

    if (this.drawingType === 'Point') {
      this.removeDrawInteraction();

      const style = this.getStyleForType('Point', this.selectedLayer);

      this.drawInteraction = new Draw({
        source: this.vectorLayer.getSource()!,
        type: 'Point',
        style: style,
      });

      this.drawInteraction.on('drawend', (event) => {
        const coordinates = (
          event.feature.getGeometry() as Point
        ).getCoordinates();
        const lonLat = transform(
          coordinates,
          this.olMap.getView().getProjection(),
          'EPSG:4326'
        );

        if (this.currentFormComponent?.instance) {
          this.currentFormComponent.instance.updateCoordinates(lonLat);
        }

        if (!this.isPointInSurveyArea(lonLat)) {
          const invalidFeature = new Feature({
            geometry: new Point(coordinates),
            isInvalidPoint: true,
          });

          // Layer wise selected shape
          const invalidStyle = this.getInvalidStyleForLayer(this.selectedLayer);
          invalidFeature.setStyle(invalidStyle);

          this.vectorLayer.getSource()?.addFeature(invalidFeature);
          this.vectorLayer.getSource()?.removeFeature(event.feature);
          // this.toastr.warning('Point must be placed within the selected survey area');
          return;
        }
      });

      this.olMap.addInteraction(this.drawInteraction);
    }

    this.drawingType = null; // reset
  }

  private getInvalidStyleForLayer(layerType: string): Style {
    switch (layerType.toLowerCase()) {
      case 'fat':
        return new Style({
          image: new Icon({
            src: 'assets/icons/fat.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });
      case 'splitter':
        return new Style({
          image: new Icon({
            src: 'assets/icons/splitter.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });
      case 'fdt':
        return new Style({
          image: new Icon({
            src: 'assets/icons/fdt.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case 'olt':
        return new Style({
          image: new Icon({
            src: 'assets/icons/olt.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case '8m poles':
        return new Style({
          image: new Icon({
            src: 'assets/icons/8m.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });
      case '10m poles':
        return new Style({
          image: new Icon({
            src: 'assets/icons/10m.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });
      case '12m poles':
        return new Style({
          image: new Icon({
            src: 'assets/icons/12m.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case 'sdu':
        return new Style({
          image: new Icon({
            src: 'assets/icons/sdu.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case 'mdu':
        return new Style({
          image: new Icon({
            src: 'assets/icons/mdu.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case 'cdu':
        return new Style({
          image: new Icon({
            src: 'assets/icons/cdu.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      case 'jointclosure':
        return new Style({
          image: new Icon({
            src: 'assets/icons/joint_closure.svg',
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });

      default:
        return new Style({
          image: new Icon({
            src: 'assets/default.svg', // fallback image if needed
            scale: 0.5,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
          }),
        });
    }
  }

  refreshSurveyStage() {
    // If you want to reload the survey data in the SurveyStageComponent:
    if (this.surveyStageComp && this.surveyStageComp.loadSurveyData) {
      this.surveyStageComp.loadSurveyData();
    }
    // Or, if you want to reload survey areas in OlMapComponent:
    this.loadSurveyAreas();
  }

  openSurveyAssignment() {
    this.showSurveyDialog = true;
    this.isShowLayers = false;
    this.isSurveyShow = false;
  }

  // Survey area work End
  private handleMapClick(event: any) {
    this.clearSelections();

    // Get clicked coordinates
    const lonLat = transform(
      event.coordinate,
      this.olMap.getView().getProjection(),
      'EPSG:4326'
    );
    this.clickedPoint = { lat: lonLat[1], lon: lonLat[0] };

    this.olMap.forEachFeatureAtPixel(event.pixel, (feature: any) => {
      let layerName = feature.get('layerName');
      const publicId = feature.get('publicId');

      // Normalize for pole types
      if (layerName === '8m') layerName = '8m poles';
      if (layerName === '10m') layerName = '10m poles';
      if (layerName === '12m') layerName = '12m poles';

      if (layerName === 'cable' && publicId) {
        this.fetchFeatureDetails(publicId, 'cable');
        return true;
      }

      if (layerName && publicId) {
        this.fetchFeatureDetails(publicId, layerName);
        return true; // Stop checking other features
      }
      return false;
    });
  }

  private clearSelections(): void {
    // Remove any existing selection markers
    this.vectorLayer.getSource()?.forEachFeature((feature) => {
      if (feature.get('isSelected')) {
        this.vectorLayer.getSource()?.removeFeature(feature);
      }
    });
  }

  private async fetchFeatureDetails(publicId: string, layerName: string) {
    this.apiService.getFeatureByPublicId(publicId, layerName).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          let featureData = response.data;

          // Always pass the full object for the layer, with layerName for context
          if (layerName.toLowerCase() === 'fat' && featureData.fat) {
            featureData = { ...featureData.fat, layerName: 'fat' };
          } else if (layerName.toLowerCase() === 'fdt' && featureData.fdt) {
            featureData = { ...featureData.fdt, layerName: 'fdt' };
          } else if (layerName.toLowerCase() === 'olt' && featureData.olt) {
            featureData = { ...featureData.olt, layerName: 'olt' };
          } else if (layerName.toLowerCase() === 'cable' && featureData.cable) {
            featureData = { ...featureData.cable, layerName: 'cable' }; // <-- ADD THIS
          } else if (
            ['8m poles', '10m poles', '12m poles', 'pole'].includes(layerName.toLowerCase()) &&
            featureData.pole
          ) {
            featureData = { ...featureData.pole, layerName: layerName.toLowerCase() };
          } else if (
            ['sdu', 'mdu', 'cdu', 'building'].includes(layerName.toLowerCase())
          ) {
            featureData =
              featureData.sdu
                ? { ...featureData.sdu, layerName: 'sdu' }
                : featureData.mdu
                  ? { ...featureData.mdu, layerName: 'mdu' }
                  : featureData.cdu
                    ? { ...featureData.cdu, layerName: 'cdu' }
                    : featureData.building
                      ? { ...featureData.building, layerName: 'building' }
                      : null;
          }

          if (featureData) {
            this.displaySelectedFeature(featureData, layerName);
          }
        }
      },
      error: (error) => {
        this.toastr.error(`Failed to load ${layerName} details`);
      },
    });
  }

  public staffMembers: any[] = [];
  public selectedStaffId: number | null = null;
  public assignmentMappings: any[] = [];

  private handlePopUpdateSuccess(updatedData: any) {
    // Update the map feature if needed
    this.clearDrawings();
    this.addNetworkElement = false;
    this.showForm = false;

    // Optionally refresh the map view
    this.olMap.getView().animate({
      center: fromLonLat([updatedData.longitude, updatedData.latitude]),
      zoom: this.olMap.getView().getZoom(),
      duration: 500,
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nearby-features-dropdown')) {
      this.showNearbyDropdown = false;
    }
  }

  checkFormContainer() {
    console.log('Current form container state:', {
      addNetworkElement: this.addNetworkElement,
      showForm: this.showForm,
      containerExists: !!this.formContainer,
    });
  }

  public handleFormClose() {
    setTimeout(() => {
      this.clearFormContainer();
      this.addNetworkElement = false;
      this.showForm = false;
      this.clearDrawings();

      // Force change detection
      this.cdr.detectChanges();
    }, 100);
  }

  onMouseLeaveLayerList() {
    this.isShowLayers = false;
  }

//Area mapping

openAreaMapping() {
  this.showAreaMappingPanel = !this.showAreaMappingPanel;
  if (!this.showAreaMappingPanel) {
    // Remove area mapping polygons from map when closing
    this.onAreaMappingData(null);
  }
}

onAreaMappingData(data: any) {
  // Remove previous area mapping layer if it exists
  if (this.areaMappingLayer) {
    this.olMap.removeLayer(this.areaMappingLayer);
    this.areaMappingLayer = null;
  }
  if (!data) return;

  const features: Feature[] = [];

  // Country
  if (data.country && Array.isArray(data.country)) {
    data.country.forEach((country: any) => {
      if (country.geom) {
        features.push(new Feature({
          geometry: this.geoJSONFormat.readGeometry(country.geom, { dataProjection: 'EPSG:4326' }),
          name: country.countryName || 'Country',
          type: 'areaMapping'
        }));
      }
    });
  }
  // State
  if (data.state && Array.isArray(data.state)) {
    data.state.forEach((state: any) => {
      if (state.geom) {
        features.push(new Feature({
          geometry: this.geoJSONFormat.readGeometry(state.geom, { dataProjection: 'EPSG:4326' }),
          name: state.stateName || 'State',
          type: 'areaMapping'
        }));
      }
    });
  }
  // District
  if (data.district && Array.isArray(data.district)) {
    data.district.forEach((district: any) => {
      if (district.geom) {
        features.push(new Feature({
          geometry: this.geoJSONFormat.readGeometry(district.geom, { dataProjection: 'EPSG:4326' }),
          name: district.district || 'District',
          type: 'areaMapping'
        }));
      }
    });
  }

  if (features.length === 0) return;

  const vectorSource = new VectorSource({ features });
  this.areaMappingLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 193, 7, 0.2)' }),
      stroke: new Stroke({ color: '#FFC107', width: 3, lineDash: [8, 4] }),
    }),
    zIndex: 100
  });

  this.olMap.addLayer(this.areaMappingLayer);

    // Zoom to area if only one area is selected and zoomGeom is present
  if (data && data.zoomGeom) {
    this.zoomToAreaMappingGeometry(data.zoomGeom);
  }
}

zoomToAreaMappingGeometry(geom: any) {
  if (!geom || !geom.coordinates) return;
  // Assuming MultiPolygon
  const coords = geom.coordinates.flat(2); // flatten to array of [lng, lat]
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  coords.forEach(([lng, lat]: [number, number]) => {
    if (lng < minX) minX = lng;
    if (lng > maxX) maxX = lng;
    if (lat < minY) minY = lat;
    if (lat > maxY) maxY = lat;
  });
  this.olMap.getView().fit([minX, minY, maxX, maxY], {
    padding: [50, 50, 50, 50],
    duration: 500,
  });
}

  private surveyAreaWmsLayers: { [id: number]: TileLayer } = {};

  toggleSurveyArea(area: any, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Uncheck all others
      Object.keys(this.selectedSurveyAreas).forEach((key) => {
        if (+key !== area.id) {
          this.selectedSurveyAreas[+key] = false;
        }
      });

      // Load data for selected survey area
      this.currentSurveyArea = area;
      this.selectedSurveyAreas[area.id] = true;
      this.loadAndDisplaySurveyData(area.id);
    } else {
      // Clear data if unchecked
      this.selectedSurveyAreas[area.id] = false;
      // this.vectorLayer.getSource()?.clear();
      // this.selectedSurveyAreaId = null;
      this.selectedSurveyAreaName = '';
      this.clearSurveyAreaDisplay();
      this.currentSurveyArea = null;
      this.selectedSurveyAreaId = null;
    }
  }

  private clearSurveyAreaDisplay(): void {
    if (this.currentSurveyAreaFeature) {
      this.vectorLayer
        .getSource()
        ?.removeFeature(this.currentSurveyAreaFeature);
      this.currentSurveyAreaFeature = null;
    }
  }

  private zoomToSurveyArea(surveyArea: any): void {
    if (!surveyArea?.geom?.coordinates) return;

    const polygonCoords = surveyArea.geom.coordinates[0];
    const extent = polygonCoords.reduce(
      (acc: number[], coord: number[]) => {
        return [
          Math.min(acc[0], coord[0]),
          Math.min(acc[1], coord[1]),
          Math.max(acc[2], coord[0]),
          Math.max(acc[3], coord[1]),
        ];
      },
      [Infinity, Infinity, -Infinity, -Infinity]
    );

    this.olMap.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      duration: 500,
    });
  }

  displaySurveyAreaPolygon(surveyArea: any) {
    //   if (!surveyArea?.geom?.coordinates) {
    //   console.error('Invalid survey area geometry:', surveyArea);
    //   return;
    // }
    try {
      const geoJSON = {
        type: 'Feature',
        properties: {
          name: surveyArea.name,
          publicId: surveyArea.publicId,
          isSurveyArea: true,
        },
        geometry: surveyArea.geom,
      };

      const feature = this.geoJSONFormat.readFeature(
        geoJSON
      ) as Feature<Geometry>;

      feature.setStyle(
        new Style({
          fill: new Fill({
            color: 'rgba(75, 192, 192, 0.2)',
          }),
          stroke: new Stroke({
            color: '#4BC0C0',
            width: 3,
            lineDash: [10, 5],
          }),
        })
      );

      this.vectorLayer.getSource()?.addFeature(feature);
      this.currentSurveyAreaFeature = feature as Feature<Polygon>;
      console.log('Survey area displayed successfully');
    } catch (error) {
      console.error('Error displaying survey area:', error);
    }
  }

  private removeSurveyAreaWMSLayer(surveyAreaId: number) {
    const layer = this.surveyAreaWmsLayers[surveyAreaId];
    if (layer) {
      this.olMap.removeLayer(layer);
      delete this.surveyAreaWmsLayers[surveyAreaId];
    }
  }

  printVectorLayerFeatures() {
    const features = this.vectorLayer.getSource()?.getFeatures() || [];
  }

  logout() {
    this.router.navigate(['/login']);
    this.cdr.detectChanges();
  }

  startDrawingPolygon(publicId?: string, isEdit: boolean = false) {
    this.isSurveyShow = false;
    const userRoles = localStorage.getItem('userRoles');
    if (!userRoles) {
      this.toastr.error(
        'Only admin users are allowed to create surveys.',
        'Warning'
      );
      return;
    }

    // SKIP this block if in edit mode
    if (!isEdit) {
      // Clear the current survey area polygon from the map
      // this.clearSurveyAreaDisplay();
      // this.clearSurveyAreaFeatures();
      this.clearFormContainer();
      // this.clearTemporaryDrawingPoints();

      // Uncheck the Survey Area checkbox in base layers
      this.layersConfig['surveyArea'].visible = false;
      this.layersConfig['surveyArea'].layer?.setVisible(false);

      this.selectedSurveyAreaId = null;
      this.selectedSurveyAreas = {};
      this.isSurveyLayerVisible = false;

      this.addNetworkElement = true;
      this.showRectangleOption = true;
      this.showCableOption = false;
      this.showForm = true;

      this.cdr.detectChanges();

      const factory =
        this.componentFactoryResolver.resolveComponentFactory(
          SurveyAreaComponent
        );
      this.currentFormComponent = this.formContainer.createComponent(factory);

      const sub = this.currentFormComponent.instance.formSubmit?.subscribe(
        (formData: any) => {
          this.onFormSubmit(formData);
          this.surveyAreaRefresh();
          this.handleFormClose();
        }
      );

      const closeSub = this.currentFormComponent.instance.closeForm?.subscribe(
        () => {
          this.handleFormClose();
        }
      );

      this.currentFormComponent.onDestroy(() => {
        sub?.unsubscribe();
        closeSub?.unsubscribe();
      });
    }

    // Always allow drawing (or modification interaction)
    this.removeDrawInteraction();

    this.drawInteraction = new Draw({
      source: this.vectorLayer.getSource()!,
      type: 'Polygon',
      style: this.getStyleForType('Polygon'),
    });

    this.drawInteraction.on('drawend', (event) => {
      const geometry = event.feature.getGeometry();
      // Set the type property so style works!
      event.feature.set('type', 'survey_area'); // or whatever type you want

      if (geometry && geometry.getType() === 'Polygon') {
        const coords = (geometry as Polygon).getCoordinates();
        if (this.currentFormComponent?.instance.updateCoordinates) {
          this.currentFormComponent.instance.updateCoordinates(coords);
        }
        this.cdr.detectChanges();
      }
    });

    this.olMap.addInteraction(this.drawInteraction);
  }

  clearSurveyAreaFeatures() {
    const source = this.vectorLayer.getSource();
    if (!source) return;
    const surveyFeatureLayers = [
      'isSurveyArea', // property for the polygon
      'fat',
      'fdt',
      'olt',
      'pole',
      'fdc',
      'fdp',
      'pop',
      'splitter',
      'jointclosure',
      'building',
      'handhole',
      'manhole',
      'cable',
      'customer',
      '8m',
      '10m',
      '12m',
      'sdu',
      'mdu',
      'cdu',
    ];
    source.getFeatures().forEach((feature) => {
      const layerName = feature.get('layerName');
      if (
        feature.get('isSurveyArea') ||
        surveyFeatureLayers.includes(layerName)
      ) {
        source.removeFeature(feature);
      }
    });
  }

  // for only add point within survey area
  isPointInSurveyArea(point: number[]): boolean {
    if (!this.selectedSurveyAreaId || !this.surveyAreas.length) return false;

    const surveyArea = this.surveyAreas.find(
      (area) => area.id === this.selectedSurveyAreaId
    );
    if (!surveyArea?.geom?.coordinates) return false;

    const polygon = surveyArea.geom.coordinates[0];
    const x = point[0];
    const y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }
  logCurrentProjectionInfo() {
    const view = this.olMap.getView();
    if (view.getCenter()) {
      const lonLat = toLonLat(view.getCenter(), view.getProjection());
    }
  }
  private loadAndDisplaySurveyData(surveyAreaId: number): void {
    // Find the selected survey area object
    const selectedArea = this.surveyAreas.find(a => a.id === surveyAreaId);

    // If Digitalization stage, use getSurveyDataForDigitalization
    if (selectedArea && selectedArea.surveyStageName === 'Digitalization') {
      this.apiService.getSurveyDataForDigitalization(surveyAreaId).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            if (response.data.survey_area?.length > 0) {
              this.currentSurveyAreaPolygon = response.data.survey_area[0].geom;
              if (this.currentFormComponent?.instance?.surveyAreaGeometry) {
                this.currentFormComponent.instance.surveyAreaGeometry = this.currentSurveyAreaPolygon;
              }
            }
            this.layerFeatures = {};
            this.selectedFeatures = {};
            Object.entries(response.data).forEach(([layerType, features]) => {
              if (
                Array.isArray(features) &&
                features.length > 0 &&
                layerType !== 'survey_area'
              ) {
                this.layerFeatures[layerType] = features;
                this.selectedFeatures[layerType] = new Set();
              }
            });
            this.displayAllSurveyLayers(response.data);
            this.selectedSurveyAreaId = surveyAreaId;
            this.zoomToSurveyArea(response.data.survey_area[0]);
          }
        },
        error: (error: any) => {
          console.error('Error loading survey data:', error);
          this.toastr.error('Failed to load survey data');
        },
      });
    } else {
      // Otherwise, use getsurveyAreaByUser
      this.apiService.getsurveyAreaByUser(surveyAreaId).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            if (response.data.survey_area?.length > 0) {
              this.currentSurveyAreaPolygon = response.data.survey_area[0].geom;
              // Pass to FAT component if it's active
              if (this.currentFormComponent?.instance?.surveyAreaGeometry) {
                this.currentFormComponent.instance.surveyAreaGeometry =
                  this.currentSurveyAreaPolygon;
              }
            }
            // Clear previous features
            this.layerFeatures = {};
            this.selectedFeatures = {};

            // Store all features by layer type
            Object.entries(response.data).forEach(([layerType, features]) => {
              if (
                Array.isArray(features) &&
                features.length > 0 &&
                layerType !== 'survey_area'
              ) {
                this.layerFeatures[layerType] = features;
                this.selectedFeatures[layerType] = new Set();
              }
            });

            this.displayAllSurveyLayers(response.data);
            this.selectedSurveyAreaId = surveyAreaId;
            this.zoomToSurveyArea(response.data.survey_area[0]);
          }
        },
        error: (error: any) => {
          console.error('Error loading survey data:', error);
          this.toastr.error('Failed to load survey data');
        },
      });
    }
  }

  isSelectedSurveyInitiated(): boolean {
    const selectedArea = this.surveyAreas.find(
      (a) => a.id === this.selectedSurveyAreaId
    );
    return (
      !!selectedArea &&
      selectedArea.surveyStatusName?.toLowerCase() === 'initiated'
    );
  }

  displayAllSurveyLayers(data: any): void {
    // Clear existing features first
    // this.vectorLayer.getSource()?.clear();

    // Display survey area polygon
    if (data.survey_area?.length) {
      this.displaySurveyAreaPolygon(data.survey_area[0]);
    }

    // Display all other layers
    const layerTypes = [
      'pole',
      'fat',
      'fdt',
      'olt',
      'fdc',
      'trench',
      'splitter',
      'duct',
      'building',
      'pop',
      'handhole',
      'fdp',
      'manhole',
      'cable',
      'jointclosure',
      'customer',
      'sdu',
      'mdu',
      'cdu',
      '8m',
      '10m',
      '12m',
    ];

    layerTypes.forEach((layerType) => {
      if (data[layerType]?.length) {
        this.displayLayerFeatures(data[layerType], layerType);
      }
    });
  }


  private displayLayerFeatures(features: any[], layerType: string): void {
    let normalizedLayerType = layerType;

    let feature = features;
    if (layerType === '8m') normalizedLayerType = '8m poles';
    if (layerType === '10m') normalizedLayerType = '10m poles';
    if (layerType === '12m') normalizedLayerType = '12m poles';
    if (layerType === 'fat') normalizedLayerType = 'fat';

    if (
      layerType.toLowerCase() === 'jointclosure' ||
      layerType.toLowerCase() === 'joint-closure' ||
      layerType.toLowerCase() === 'jointclosures' ||
      layerType.toLowerCase() === 'joint_closure'
    ) {
      normalizedLayerType = 'jointclosure';
    }
    const color = this.getColorForLayer(normalizedLayerType);
    const icon = this.getIconForLayer(normalizedLayerType);

    if (!this.allFeatures[layerType]) this.allFeatures[layerType] = {};
    if (!this.featureVisibility[layerType])
      this.featureVisibility[layerType] = {};

    features.forEach((feature) => {
      // --- ADD THIS BLOCK ---
      let rawType = (feature.layerName || layerType || '').toLowerCase();
      let type = rawType;
      if (type === '8m' || type === '10m' || type === '12m') type = 'pole';
      else if (type === 'sdu' || type === 'mdu' || type === 'cdu') type = type;
      else if (
        type === 'jointclosure' || type === 'joint-closure' ||
        type === 'jointclosures' || type === 'joint_closure'
      ) type = 'jointclosure';
      else if (type === 'splitter') type = 'splitter';
      else if (type === 'fdt') type = 'splitter';
      else if (['2c', '6c', '12c', '24c', '48c', '96c', '144c', '288c'].includes(type)) type = 'cable';
      else if (type === 'trench') type = 'trench';
      else if (type === 'duct') type = 'duct';
      else if (type === 'fat') type = 'fat';

      // --- END BLOCK ---

      const geoJSON = {
        type: 'Feature',
        properties: {
          ...feature,
          layerName: layerType,
          type: type,           // <-- Set type
          originalType: rawType // <-- Set originalType
        },
        geometry: feature.geom,
      };

      const olFeature = this.geoJSONFormat.readFeature(
        geoJSON
      ) as Feature<Geometry>;
      olFeature.setId(feature.publicId);

      let style: Style;

      if (feature.geom.type === 'Point') {
        style = new Style({
          image: new Icon({
            src: icon,
            scale: 0.5,
            anchor: [0.5, 1],
          }),
        });
      } else if (feature.geom.type === 'LineString') {
        style = new Style({
          stroke: new Stroke({
            color: color,
            width: 3,
          }),
        });
      }

      olFeature.set('originalStyle', style);
      olFeature.setStyle(style);

      this.allFeatures[layerType][feature.publicId] = olFeature;

      if (this.featureVisibility[layerType][feature.publicId] === undefined) {
        this.featureVisibility[layerType][feature.publicId] = true;
      }

      if (this.featureVisibility[layerType][feature.publicId]) {
        const source = this.vectorLayer.getSource();
        if (source && !source.getFeatureById(feature.publicId)) {
          source.addFeature(olFeature);
        }
      }
    });
  }

  getColorForLayer(layerType: string): string {
    const colors: Record<string, string> = {
      pole: '#4A89DC',
      fat: '#E9573F',
      fdt: '#52ed4dff',
      olt: '#8632e6ff',
      building: '#F6BB42',
      cable: '#37BC9B',
      trench: '#A0522D',
      duct: '#00BFFF',
      surveyArea: '#4BC0C0',
      default: '#656D78',
    };
    return colors[layerType] || colors['default'];
  }

  getIconForLayer(layerType: string, useAlternativeDesign?:any): string {
    
    const features = this.vectorLayer.getSource()?.getFeatures() || [];
    // Find a feature that matches the given layerType
    // Check what properties each feature actually has
    features.forEach((f, index) => {
      const props = f.getProperties();
    });

    // Use the correct property name that exists in your data
    const feature = features.find(f => f.get('name') === layerType);
    const name = feature?.get('name') || 'Name';
    const street = feature?.get('street') || 'STREET NAME';
    const number = feature?.get('number') || '0';
    const floor = feature?.get('floor') || '1F';
    const units = feature?.get('units') || '1';
    const fatId = feature?.get('fat_id') || 'FAT 00-00';
    const equipment = feature?.get('equipment') || 'SFU';
    const count = feature?.get('count') || '1';
    const olt = feature?.get('olt') || 'OLT 00-00';
    const location = feature?.get('location') || 'LOCATION';
    const status = feature?.get('status') || 'STATUS';

    // Get feature properties for dynamic splitters
    const splitters = feature?.get('splitters') || ['2x4 SPL', '2x16 SPL', '2x8 SPL'];

    // Generate dynamic SVG
    const svgContent = this.generateFdtSplitterAlternativeSvg(splitters);
    // const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

    // return new Icon({
    //   src: dataUrl,
    //   scale: baseScale * zoomScale,
    //   anchor: [0.5, 0.5]
    // });


    if (this.useAlternativeDesign) {
      switch (layerType) {
        case 'fat':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generateDynamicFATSvg('FAT', '0'));
        case 'fdt':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
        case 'olt':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generateOltSvg('OLT', '01'));
        case 'sdu':
          const svgSdu = this.generateSduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, status);
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgSdu);
        case 'mdu':
          const svgMdu = this.generateMduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location);
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMdu);
        case 'cdu':
          const svgCdu = this.generateCduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location);
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCdu);
        case '8m poles':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generate8mPoleSvg('SN', 'NP_SAV-0001'));
        case '10m poles':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generate10mPoleSvg('SN', 'NP_SAV-0001'));
        case 'jointclosure':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generateJointClosureSvg(name));
        case '12m poles':
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.generate12mPoleSvg('SN', 'NP_SAV-0001'));
        // case 'cable':
        //   const cable = this.generateCableSvg(name,);
        //   return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cable);
        default:
          break;
      }
    }

    const icons: Record<string, string> = {
      pole: 'assets/poles.svg',
      '8m poles': 'assets/icons/8m.svg',
      '10m poles': 'assets/icons/10m.svg',
      '12m poles': 'assets/icons/12m.svg',
      'fat': 'assets/icons/fat.svg',
      splitter: 'assets/icons/splitter.svg',
      jointclosure: 'assets/icons/joint_closure.svg',
      fdt: 'assets/icons/fdt.svg',
      olt: 'assets/icons/olt.svg',
      building: 'assets/building.svg',
      fdc: 'assets/fdc.svg',
      sdu: 'assets/icons/sdu.svg',
      mdu: 'assets/icons/mdu.svg',
      cdu: 'assets/icons/cdu.svg',
    };
    return icons[layerType];
  }


  private generateDynamicFDTSvg(splitters: string[]): string {
    const splitterHeight = 100;
    const spacing = 20;
    const splitterWidth = 200;
    const triangleWidth = 35;
    const fanoutLength = 30;

    const totalHeight = splitters.length * (splitterHeight + spacing) - spacing;
    const outerWidth = 200;

    let svgContent = `<svg width="${outerWidth}" height="${totalHeight + 40}" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges; text-rendering: optimizeLegibility;">`;

    // Outer rectangle
    svgContent += `<rect x="5" y="5" width="${outerWidth - 10}" height="${totalHeight + 30}" stroke="red" fill="none" stroke-width="1"/>`;

    splitters.forEach((label, index) => {
      const yOffset = index * (splitterHeight + spacing) + 20;
      const numFanouts = parseInt(label.split("x")[1]);

      // Label
      svgContent += `<text x="20" y="${yOffset + 58}" fill="red" font-family="Arial, sans-serif" font-size="12">${label}</text>`;

      // Box lines
      svgContent += `<line x1="35" y1="${yOffset + 40}" x2="75" y2="${yOffset + 40}" stroke="red" stroke-width="1"/>`; // Top
      svgContent += `<line x1="75" y1="${yOffset + 40}" x2="75" y2="${yOffset + 70}" stroke="red" stroke-width="1"/>`; // Right
      svgContent += `<line x1="75" y1="${yOffset + 70}" x2="35" y2="${yOffset + 70}" stroke="red" stroke-width="1"/>`; // Bottom

      // Triangle
      svgContent += `<polygon points="${75},${yOffset + 55} ${110},${yOffset + 20} ${110},${yOffset + 90}" fill="none" stroke="red" stroke-width="1"/>`;

      // Fanout lines
      const startY = yOffset + 20;
      const endY = yOffset + 90;
      const step = (endY - startY) / (numFanouts - 1);
      for (let i = 0; i < numFanouts; i++) {
        const y = startY + i * step;
        svgContent += `<line x1="110" y1="${y}" x2="130" y2="${y}" stroke="red" stroke-width="1"/>`;
      }

      // Rotated text
      svgContent += `<text x="155" y="${yOffset + 80}" fill="red" font-family="Arial, sans-serif" font-size="12" transform="rotate(270 ${155},${yOffset + 80})">BOX SPL</text>`;
    });

    svgContent += '</svg>';
    return svgContent;
  }
  // Add this to your OlMapComponent class
  getFeatureProperties(feature: any): { key: string; value: any }[] {
    if (!feature) return [];

    // Only show these fields for SDU, MDU, CDU, building
    const simpleLayers = ['sdu', 'mdu', 'cdu', 'building'];
    if (simpleLayers.includes((feature.layerName || '').toLowerCase())) {
      const keys = ['name', 'category', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    // Only show these fields for poles
    const poleLayers = ['8m poles', '10m poles', '12m poles'];
    if (poleLayers.includes((feature.layerName || '').toLowerCase())) {
      const keys = ['name', 'status', 'heightM'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    // Only show these fields for FAT
    if ((feature.layerName || '').toLowerCase() === 'fat') {
      const keys = ['name', 'capacity', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    // Only show these fields for FDT
    if ((feature.layerName || '').toLowerCase() === 'fdt') {
      const keys = ['name', 'capacity', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    if ((feature.layerName || '').toLowerCase() === 'olt') {
      const keys = ['name', 'capacity', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    if ((feature.layerName || '').toLowerCase() === 'splitter') {
      const keys = ['name', 'parentNeType', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    if ((feature.layerName || '').toLowerCase() === 'jointclosure') {
      const keys = ['name', 'parentNeType', 'status'];
      return keys
        .filter((key) => feature[key] !== undefined)
        .map((key) => ({
          key: this.formatPropertyName(key),
          value: this.formatPropertyValue(feature[key]),
        }));
    }

    if ((feature.layerName || '').toLowerCase() === 'cable') {
      const keys = [
        { key: 'name', label: 'Name' },
        { key: 'lookupCableType', label: 'Cable Type', nested: 'name' },
        { key: 'cableSpecification', label: 'Specification', nested: 'name' },
        { key: 'status', label: 'Status' },
        { key: 'measuredLengthM', label: 'Measured Length (m)' }
      ];
      return keys
        .map(({ key, label, nested }) => {
          let value = feature[key];
          if (nested && value && typeof value === 'object') {
            value = value[nested];
          }
          if (value !== undefined) {
            return {
              key: label,
              value: this.formatPropertyValue(value),
            };
          }
          return null;
        })
        .filter(Boolean) as { key: string; value: any }[];
    }

    // Exclude these internal properties from display
    const excludedProperties = [
      'geom',
      'geometry',
      'layerName',
      'publicId',
      'id',
      'isSelected',
    ];

    return Object.entries(feature)
      .filter(([key]) => !excludedProperties.includes(key))
      .map(([key, value]) => ({
        key: this.formatPropertyName(key),
        value: this.formatPropertyValue(value),
      }));
  }

  private formatPropertyName(name: string): string {
    // Convert camelCase to Title Case
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  private formatPropertyValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  }

  // zoom-in - out
  onZoomIn() {
    const view = this.olMap.getView();
    view.animate({
      zoom: view.getZoom()! + 1,
      duration: 200,
    });
  }

  onZoomOut() {
    const view = this.olMap.getView();
    view.animate({
      zoom: view.getZoom()! - 1,
      duration: 200,
    });
  }
  // search
  clearForms() {
    this.addNetworkElement = false;
    this.showForm = false;
    this.showCableOption = false;
    this.showRectangleOption = false;
  }
  onSurveyAreaToggle(event: { area: SurveyArea; visible: boolean }): void {
    const { area, visible } = event;

    if (visible) {
      // Uncheck all others
      // Object.keys(this.selectedSurveyAreas).forEach((key) => {
      //   if (+key !== area.id) {
      //     this.selectedSurveyAreas[+key] = false;
      //   }
      // });

      //  Track selected survey ID and object
      this.selectedSurveyAreas[area.id] = true;
      this.selectedSurveyAreaId = area.id;
      this.selectedSurvey = area; //   Save full survey object for use in DrawingTools

      this.loadAndDisplaySurveyData(area.id);
    } else {
      this.selectedSurveyAreas[area.id] = false;

      //  Clear selected survey info
      if (this.selectedSurveyAreaId === area.id) {
        this.selectedSurveyAreaId = null;
        this.selectedSurvey = null; //  Clear selected survey
      }

      this.vectorLayer.getSource()?.clear();
    }
  }

  onLayerToggle(event: { name: string; visible: boolean }): void {
    if (this.vectorLayer) {
      this.vectorLayer.setVisible(event.visible);
    }
    const { name, visible } = event;

    // Existing logic for WMS layers
    if (this.layersConfig[name]) {
      this.layersConfig[name].visible = visible;
      this.layersConfig[name].layer.setVisible(visible);
    }

    // Special handling for survey area layer
    if (name === 'surveyArea') {
      this.isSurveyLayerVisible = visible; // <-- Add this line
      if (visible) {
        this.loadSurveyAreas();
      } else {
        this.vectorLayer.getSource()?.clear();
        this.selectedSurveyAreaId = null;
        this.currentSurveyAreaPolygon = null;
      }
    }
  }

  toggleFeatureSelection(
    layer: string,
    featureId: string,
    isChecked: boolean
  ): void {
    if (!this.selectedFeatures[layer]) {
      this.selectedFeatures[layer] = new Set();
    }

    if (isChecked) {
      this.selectedFeatures[layer].add(featureId);
      this.highlightFeature(layer, featureId);
    } else {
      this.selectedFeatures[layer].delete(featureId);
      this.removeFeatureHighlight(layer, featureId);
    }
  }

  toggleAllFeatures(layer: string, isChecked: boolean): void {
    if (!this.layerFeatures[layer]) return;

    this.selectedFeatures[layer] = isChecked
      ? new Set(this.layerFeatures[layer].map((f: any) => f.publicId))
      : new Set();

    this.layerFeatures[layer].forEach((feature: any) => {
      const featureId = feature.publicId;
      this.featureVisibility[layer][featureId] = isChecked;

      const olFeature = this.allFeatures[layer]?.[featureId];
      if (!olFeature) return;

      if (isChecked) {
        this.showFeature(olFeature);
      } else {
        this.hideFeature(olFeature);
      }
    });
  }

  private highlightFeature(layer: string, featureId: string): void {
    const feature = this.allFeatures[layer]?.[featureId];
    if (feature) {
      feature.setStyle(this.getStyleForLayer(layer, true)); // Highlighted style
    }
  }

  private removeFeatureHighlight(layer: string, featureId: string): void {
    const feature = this.allFeatures[layer]?.[featureId];
    if (feature) {
      // Return to normal style (check visibility)
      const isVisible = this.featureVisibility[layer]?.[featureId] !== false;
      feature.setStyle(this.getStyleForLayer(layer, false, !isVisible));
    }
  }
  public featureVisibility: {
    [layer: string]: { [featureId: string]: boolean };
  } = {};

  onFeatureToggle(event: {
    layer: string;
    featureId: string;
    visible: boolean;
  }) {
    const { layer, featureId, visible } = event;

    // Update visibility state
    this.featureVisibility[layer][featureId] = visible;

    // Update map display
    const feature = this.getFeatureById(layer, featureId);
    if (feature) {
      if (visible) {
        this.showFeature(feature);
      } else {
        this.hideFeature(feature);
      }
    }
  }

  private showFeature(feature: Feature) {
    const source = this.vectorLayer.getSource();
    const featureId = feature.getId() as string;

    if (source && !source.getFeatureById(featureId)) {
      source.addFeature(feature);
    }

    // Always restore the original icon or style
    const originalStyle = feature.get('originalStyle');
    if (originalStyle) {
      feature.setStyle(originalStyle);
    }
  }

  private getFeatureById(layer: string, featureId: string): Feature | null {
    // Try by id
    if (this.allFeatures[layer]?.[featureId]) {
      return this.allFeatures[layer][featureId];
    }
    // Try by publicId
    const source = this.vectorLayer.getSource();
    if (source) {
      const features = source.getFeatures();
      return features.find(f =>
        (f.get('id')?.toString() === featureId) ||
        (f.get('publicId')?.toString() === featureId)
      ) || null;
    }
    return null;
  }
  private hideFeature(feature: Feature) {
    feature.setStyle(new Style({})); // Empty style to hide it
  }

  // In your OlMapComponent
  private getStyleForLayer(
    layer: string,
    isHighlighted = false,
    isHidden = false
  ): Style {
    const iconSrc = this.getIconForLayer(layer); // Get icon path using your helper

    // If it's a point feature with icon, use Icon style
    const iconStyle = new Style({
      image: new Icon({
        src: iconSrc,
        scale: 0.1,
        anchor: [0.5, 1],
      }),
    });

    // For hidden features: either return empty style or a hidden version
    if (isHidden) {
      const hiddenStyle = new Style({
        image: new Icon({
          src: iconSrc,
          scale: 0.1,
          anchor: [0.5, 1],
          opacity: 0, // Completely transparent, but still reserving space
        }),
      });
      return hiddenStyle;
    }

    return iconStyle;
  }

  onAllFeaturesToggle(event: { layer: string; visible: boolean }) {
    const { layer, visible } = event;

    if (!this.layerFeatures[layer]) return;

    // Update featureVisibility for all features in this layer
    this.layerFeatures[layer].forEach((feature) => {
      const featureId = feature.publicId;
      this.featureVisibility[layer][featureId] = visible;

      const olFeature = this.allFeatures[layer]?.[featureId];
      if (!olFeature) return;

      if (visible) {
        this.showFeature(olFeature);
      } else {
        this.hideFeature(olFeature);
      }
    });

    // Update selectedFeatures set
    this.selectedFeatures[layer] = visible
      ? new Set(this.layerFeatures[layer].map((f: any) => f.publicId))
      : new Set();
  }

  handleCenterMap(coords: { lat: number; lng: number }) {
    const view = this.olMap.getView();
    view.animate({
      center: [coords.lng, coords.lat],
      zoom: 17,
      duration: 500,
    });

    this.updateLocationMarker([coords.lng, coords.lat]);
  }
  updateLocationMarker(coords: number[]) {
    if (!this.locationMarker) {
      this.locationMarker = new Feature({
        geometry: new Point(coords),
        type: 'location',
      });

      this.locationMarker.setStyle(
        new Style({
          image: new Icon({
            src: 'assets/marker-icon-2x.png',
            scale: 0.4,
            anchor: [0.5, 1],
          }),
        })
      );

      this.vectorLayer.getSource()?.addFeature(this.locationMarker);
    } else {
      (this.locationMarker.getGeometry() as Point).setCoordinates(coords);
    }
  }

  editSurveyArea() {
    if (!this.selectedSurveyAreaId) {
      this.toastr.warning('Please select a survey area first before editing');
      return;
    }

    const cachedArea = this.selectedSurveyAreaCache[this.selectedSurveyAreaId];

    if (cachedArea) {
      this.openEditForm(cachedArea);
      return;
    }

    this.apiService.getsurveyAreaByUser(this.selectedSurveyAreaId).subscribe({
      next: (response: any) => {
        const selectedArea = response?.data?.survey_area?.[0];

        if (!selectedArea) {
          this.toastr.error('Survey area not found');
          return;
        }

        //  Cache the data for future use
        this.selectedSurveyAreaCache[this.selectedSurveyAreaId] = selectedArea;

        this.openEditForm(selectedArea);
      },
      error: (err) => {
        this.toastr.error('Failed to fetch survey area details', 'Error');
        console.error('API error:', err);
      },
    });
  }

  private openEditForm(selectedArea: any) {
    this.clearFormContainer();
    this.addNetworkElement = true;
    this.showForm = true;
    this.cdr.detectChanges();

    const factory =
      this.componentFactoryResolver.resolveComponentFactory(
        SurveyAreaComponent
      );
    this.currentFormComponent = this.formContainer.createComponent(factory);

    this.currentFormComponent.instance.isEditMode = true;
    this.currentFormComponent.instance.publicIdToEdit = selectedArea.publicId;

    setTimeout(() => {
      this.currentFormComponent.instance.form.patchValue({
        name: selectedArea.name,
        description: selectedArea.description ?? '',
        surveyStatusId: selectedArea.surveyStatusId ?? null,
        surveyStartDate: selectedArea.surveyStartDate === 'null' ? null : selectedArea.surveyEndDate?.split('T')[0],
        surveyEndDate: selectedArea.surveyStartDate === 'null' ? null : selectedArea.surveyEndDate?.split('T')[0],
        isActive: selectedArea.isActive === 'true',
        geom: selectedArea.geom,
      });
      this.currentFormComponent.instance.form.markAllAsTouched();
    });

    const source = this.vectorLayer.getSource();
    this.modifyInteraction = new Modify({ source });
    this.olMap.addInteraction(this.modifyInteraction);

    this.modifyInteraction.on('modifyend', (event) => {
      const modifiedFeatures = event.features.getArray();
      const modifiedGeoJSON =
        this.geoJSONFormat.writeFeaturesObject(modifiedFeatures);
      const geometry = modifiedGeoJSON.features[0].geometry;
      if (geometry && geometry.type === 'Polygon') {
        this.currentFormComponent?.instance.updateCoordinates(
          geometry.coordinates
        );
        this.cdr.detectChanges();
      }
    });

    // Setup form event handlers
    const closeSub = this.currentFormComponent.instance.closeForm?.subscribe(
      () => {
        this.handleFormClose();
        this.clearModifyInteraction();
      }
    );

    const sub = this.currentFormComponent.instance.formSubmit?.subscribe(() => {
      this.surveyAreaRefresh();
      this.handleFormClose();
      this.clearModifyInteraction();

      // Invalidate the cache to force fresh data on next edit
      delete this.selectedSurveyAreaCache[this.selectedSurveyAreaId];
    });

    this.currentFormComponent.onDestroy(() => {
      sub?.unsubscribe();
      closeSub?.unsubscribe();
    });
  }

  surveyAreaRefresh() {
    this.apiService.getsurveyArea(this.userId, this.apiService.getMvnoId()).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.surveyAreas = response.data || [];
        } else {
          this.toastr.warning(response.message);
        }
      },
    });
  }

  clearModifyInteraction() {
    if (this.modifyInteraction) {
      this.selectedSurveyAreaId
        ? this.loadAndDisplaySurveyData(this.selectedSurveyAreaId)
        : null;
      this.olMap.removeInteraction(this.modifyInteraction);
      this.modifyInteraction = null;
    }
  }

  onEditFeature(featureData: any) {
    this.showFeatureDetails = false;
    this.clearFormContainer();
    this.addNetworkElement = true;
    this.showForm = true;
    this.selectedLayer = featureData.layerName;
    this.cdr.detectChanges();

    // Map layerName to component
    const componentMap: any = {
      fat: FatComponent,
      fdt: FdtComponent,
      olt: OltComponent,
      '8m poles': PoleComponent,
      '10m poles': PoleComponent,
      '12m poles': PoleComponent,
      sdu: BuildlingTypeComponent,
      mdu: BuildlingTypeComponent,
      cdu: BuildlingTypeComponent,
      building: BuildingComponent,
      splitter: SplitterComponent,
      jointclosure: JointComponent,
      cable: CableComponent
    };

    const componentType = componentMap[featureData.layerName];
    if (!componentType) {
      this.toastr.error('Edit not supported for this feature type');
      return;
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.currentFormComponent = this.formContainer.createComponent(factory);

    this.currentFormComponent.instance.featureData = featureData;
    this.currentFormComponent.instance.isEditMode = true;

    // Set poleSizeType for poles
    if (
      ['8m poles', '10m poles', '12m poles'].includes(featureData.layerName) &&
      this.currentFormComponent.instance
    ) {
      this.currentFormComponent.instance.poleSizeType = featureData.layerName;
      this.currentFormComponent.instance.publicIdToEdit = featureData.publicId;
    }

    // Set buildingType for building types
    if (
      ['sdu', 'mdu', 'cdu'].includes(featureData.layerName) &&
      this.currentFormComponent.instance
    ) {
      this.currentFormComponent.instance.buildingType = featureData.layerName.toUpperCase();
    }

    // Set survey area if needed
    if (this.selectedSurveyAreaId && this.currentFormComponent.instance.setSurveyAreaId) {
      this.currentFormComponent.instance.setSurveyAreaId(this.selectedSurveyAreaId);
    }

    // Find the OL Feature by publicId and layer
    const olFeature = this.getFeatureById(featureData.layerName, featureData.publicId);
    if (olFeature && olFeature.getGeometry().getType() === 'Point') {
      // Create a new vector source with only this feature
      const singleFeatureSource = new VectorSource({ features: [olFeature] });

      // Add Modify interaction for this feature
      this.modifyInteraction = new Modify({ source: singleFeatureSource });
      this.olMap.addInteraction(this.modifyInteraction);

      // Listen for geometry change and update form fields
      this.modifyInteraction.on('modifyend', (event) => {
        const geom = olFeature.getGeometry();
        if (geom.getType() === 'Point') {
          const coords = (geom as Point).getCoordinates();
          // Convert to lon/lat if needed (assuming map is EPSG:4326)
          const [lon, lat] = coords;
          // Update the form in the dynamic component
          if (this.currentFormComponent?.instance?.updateCoordinates) {
            this.currentFormComponent.instance.updateCoordinates([lon, lat]);
          }
        }
      });
    }

    // Subscribe to form submit and close
    const submitSub = this.currentFormComponent.instance.formSubmit?.subscribe((formData: any) => {
      this.onFormSubmit(formData);
      this.handleFormClose();
    });
    const closeSub = this.currentFormComponent.instance.closeForm?.subscribe(() => {
      this.clearModifyInteraction();
      this.handleFormClose();
    });

    this.currentFormComponent.onDestroy(() => {
      submitSub?.unsubscribe();
      closeSub?.unsubscribe();
      this.clearModifyInteraction();
    });

    this.cdr.detectChanges();
  }

  onDeleteFeature(feature: any): void {
    const originalLayer = feature.layerName?.toLowerCase();
    const publicId = feature.publicId;

    if (!publicId || !originalLayer) {
      this.toastr.error('Invalid feature data', 'Delete Error');
      return;
    }

    this.confirmationService.confirm({
      message: `Do you want to delete this ${originalLayer.toUpperCase()}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.performFeatureDelete(originalLayer, publicId, feature);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled',
        });
      }
    });
  }
  performFeatureDelete(layer: string, publicId: string, feature: any): void {

  if (layer === 'cable') {
    this.apiService.deleteCable(publicId).subscribe({
      next: () => {
        this.toastr.success('Cable deleted successfully');
        // Remove from map immediately
        this.removeCableFromMap(publicId);
        this.refreshMapLayer('cable'); // Optionally reload from server
      },
      error: (err) => {
        this.toastr.error('Failed to delete cable');
      }
    });
    return;
  }

    const poleTypes = ['8m poles', '10m poles', '12m poles'];
    if (poleTypes.includes(layer)) {
      layer = 'pole';
    }

    const deleteMap: any = {
      fat: () => this.apiService.deleteFat(publicId),
      sdu: () => this.apiService.deleteSdu(publicId),
      mdu: () => this.apiService.deleteMdu(publicId),
      cdu: () => this.apiService.deleteCdu(publicId),
      pole: () => this.apiService.deletePole(publicId),
      fdt: () => this.apiService.deleteFdt(publicId),
      olt: () => this.apiService.deleteOlt(publicId),
      splitter: () => this.apiService.deleteSplitter(publicId),
      jointclosure: () => this.apiService.deleteJointClosure(publicId),
      cable: () => this.apiService.deleteCable(publicId)
    };

    const deleteFn = deleteMap[layer];
    if (!deleteFn) {
      this.toastr.error('Delete not supported for this layer');
      return;
    }

    deleteFn().subscribe({
      next: (res: any) => {
        // Remove from vector layer
        const olFeature = this.getFeatureById(layer, publicId);
        if (olFeature) {
          this.vectorLayer.getSource()?.removeFeature(olFeature);
        }
        // Optionally remove from allFeatures and featureVisibility
        if (this.allFeatures[layer]) {
          delete this.allFeatures[layer][publicId];
        }
        if (this.featureVisibility[layer]) {
          delete this.featureVisibility[layer][publicId];
        }
        // Show your actual message and close popup
        this.toastr.success(res?.message || 'Feature deleted successfully', 'Success');
        this.showFeatureDetails = false;
        this.refreshMapLayer(layer);
      },
      error: (err: any) => {
        this.toastr.error(err?.message || 'Delete failed', 'Error');
      }
    });
  }

    // Add this helper:
private removeCableFromMap(publicId: string) {
  const source = this.vectorLayer.getSource();
  if (!source) return;
  const features = source.getFeatures();
  const cableFeature = features.find(f =>
    f.get('publicId') === publicId || f.getId() === publicId
  );
  if (cableFeature) {
    source.removeFeature(cableFeature);
  }
}


  /**
   * Reloads the specified map layer after a feature is deleted.
   */
  refreshMapLayer(layer: string): void {
    // If a survey area is selected, reload its data (which includes all layers)
    if (this.selectedSurveyAreaId) {
      this.loadAndDisplaySurveyData(this.selectedSurveyAreaId);
    } else {
      // Otherwise, just clear and reload the vector layer if needed
      if (this.vectorLayer && this.vectorLayer.getSource()) {
        this.vectorLayer.getSource().clear();
      }
    }
  }

  onSplitterCreated(event: any) {
    this.canAddCable = true;
    this.lastCreatedSplitterId = event?.data?.id || event?.id || null;
    // Temporary workaround: reload all survey data
    if (this.selectedSurveyAreaId) {
      this.loadAndDisplaySurveyData(this.selectedSurveyAreaId);
    }
  }

  onConnectivity(payload: { splitterId: number, mvnoId: number, surveyAreaId: number, neType: string }) {
    if (this.selectedSurveyAreaId) {
      this.loadAndDisplaySurveyData(this.selectedSurveyAreaId);
    }
    // Optional: send to API
    // this.apiService.connectFatToSdu(payload).subscribe({
    //   next: () => this.toastr.success('FAT connected to SDU successfully!'),
    //   error: () => this.toastr.error('Failed to connect FAT to SDU.'),
    // });
  }

  onNearbyElementSelected(event: { type: 'from' | 'to', element: any }) {
    // Remove previous highlight for this type
    const source = this.vectorLayer.getSource();
    source.getFeatures().forEach(f => {
      if (
        (event.type === 'from' && f.get('isHighlightedFrom')) ||
        (event.type === 'to' && f.get('isHighlightedTo'))
      ) {
        source.removeFeature(f);
      }
    });

    // Add highlight for selected element
    const coords = event.element.geom.coordinates;
    const layerName = event.element.layername || event.element.layercode || '';
    const highlightType = event.type === 'from' ? 'isHighlightedFrom' : 'isHighlightedTo';

    const highlightColor = event.type === 'from' ? '#e91e63' : '#4CAF50';
    const highlightRadius = event.type === 'from' ? 40 : 32;

    const areaFeature = new Feature({
      geometry: new Point(coords),
      name: event.element.name,
      publicId: event.element.id,
      layerName,
      [highlightType]: true
    });
    areaFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: highlightRadius,
          fill: new Fill({ color: event.type === 'from' ? 'rgba(233,30,99,0.15)' : 'rgba(76,175,80,0.15)' }),
          stroke: new Stroke({
            color: highlightColor,
            width: 3,
            lineDash: [10, 8]
          })
        })
      })
    );
    source.addFeature(areaFeature);

    // Small solid circle
    const pointFeature = new Feature({
      geometry: new Point(coords),
      name: event.element.name,
      publicId: event.element.id,
      layerName,
      [highlightType]: true
    });
    pointFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#fff' }),
          stroke: new Stroke({
            color: highlightColor,
            width: 3
          })
        })
      })
    );
    source.addFeature(pointFeature);
  }

  private zoomToSelectedElements(coordsArr: number[][]) {
    if (coordsArr.length === 1) {
      this.zoomToPoint(coordsArr[0]);
      return;
    }
    if (coordsArr.length === 2) {
      const extent = [
        Math.min(coordsArr[0][0], coordsArr[1][0]),
        Math.min(coordsArr[0][1], coordsArr[1][1]),
        Math.max(coordsArr[0][0], coordsArr[1][0]),
        Math.max(coordsArr[0][1], coordsArr[1][1])
      ];
      this.olMap.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500, maxZoom: 18 });
    }
  }

  onParentConnectivity(payload: { fromId: number, toId: number, fromLayer: string, toLayer: string, surveyAreaId: number }) {
    // Find features
    const fromFeature = this.getFeatureById(payload.fromLayer, String(payload.fromId));
    const toFeature = this.getFeatureById(payload.toLayer, String(payload.toId));

    // Get coordinates
    const coordsArr: number[][] = [];
    if (fromFeature && fromFeature.getGeometry() instanceof Point) coordsArr.push((fromFeature.getGeometry() as Point).getCoordinates());
    if (toFeature && toFeature.getGeometry() instanceof Point) coordsArr.push((toFeature.getGeometry() as Point).getCoordinates());

    // Zoom to selected elements
    this.zoomToSelectedElements(coordsArr);

    // Open cable form
    this.openCableFormFromDialog();
  }

  // For cable, after successful creation (in cable.component.ts or via event in ol-map.component.ts)
  onCableCreated() {
    if (this.selectedSurveyAreaId) {
      this.loadAndDisplaySurveyData(this.selectedSurveyAreaId);
    }
  }

  openCableFormFromDialog() {
    this.showDialog = false;
    this.selectedLayer = 'cable';
    this.addNetworkElement = true;
    this.showForm = true;
    this.showCableOption = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.startDrawing('LineString');

      // Wait longer to ensure form is rendered
      setTimeout(() => {
        if (
          this.currentFormComponent &&
          this.currentFormComponent.instance &&
          this.lastCreatedSplitterId
        ) {
          this.currentFormComponent.instance.setSplitterId(this.lastCreatedSplitterId);
        } else {
          console.warn('Cable form not yet rendered');
        }
      }, 200); // Adjust timing if needed
    }, 50);
  }


  AddConnectivity(featureData: any) {
    if (
      !this.selectedSurvey ||
      (this.selectedSurvey.surveyStatusName || '').toLowerCase() !== 'in progress'
    ) {
      this.toastr.warning('Please change the survey status to In Progress.');
      return;
    }

    const layerName = this.selectedFeatureDetails?.layerName?.toLowerCase();

 if (layerName === 'fat') {
    // Open FAT connection dialog
    this.active = 0;
    this.connectivityFeatureData = this.selectedFeatureDetails;
    this.showFeatureDetails = false;
    this.showDialog = true;
    this.showParentConnectionDialog = false;
  } else if (layerName === 'olt' || layerName === 'jointclosure' || layerName === 'fdt') {
    // Open OLT parent connection dialog (sidebar)
    this.parentConnectionFeatureData = this.selectedFeatureDetails;
    this.showFeatureDetails = false;
    this.showDialog = false;
    this.showParentConnectionDialog = true; // This will trigger the sidebar
  }  else {
    this.toastr.error('Connectivity is only available for FAT and OLT features.');
  }
  }
  toggleBasemap() {
    if (!this.currentBackgroundLayer) {
      console.warn('Basemap layer not initialized yet');
      return;
    }

    this.basemapVisible = !this.basemapVisible;
    this.currentBackgroundLayer.setVisible(this.basemapVisible);

    // Optional: Force a redraw if needed
    this.olMap.render();
  }

  exportDigitalizeExcel() {
    if (!this.selectedSurveyAreaId) {
      this.toastr.warning('No survey area selected.');
      return;
    }

    let features = this.vectorSource.getFeatures();

    // ✅ Filter out survey area polygons
    features = features.filter(feature => {
      return !feature.get('isSurveyArea') && feature.get('type') !== 'survey_area';
    });

    if (features.length === 0) {
      alert('No features to export.');
      return;
    }

    // Call your API to download Excel (replace with your actual API call)
    this.apiService.exportDigitalizeExcel(this.selectedSurveyAreaId).subscribe({
      next: (response: any) => {
        // Assuming the API returns a Blob for the Excel file
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'digitalize-survey.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastr.error('Failed to export Excel.');
      }
    });
  }

  exportToExcel() {
    if (!this.selectedSurveyAreaId) {
      this.toastr.warning('No survey area selected.');
      return;
    }

    let features = this.vectorSource.getFeatures();

    // ✅ Filter out survey area polygons
    features = features.filter(feature => {
      return !feature.get('isSurveyArea') && feature.get('type') !== 'survey_area';
    });

    if (features.length === 0) {
      alert('No features to export.');
      return;
    }
    // Call your API to download Excel (replace with your actual API call)
    this.apiService.exportBomExcel(this.selectedSurveyAreaId).subscribe({
      next: (response: any) => {
        // Assuming the API returns a Blob for the Excel file
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bom-survey.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastr.error('Failed to export Excel.');
      }
    });
  }

  private async svgToImage(svg: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2;
        canvas.width = 200 * scale;
        canvas.height = 200 * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(pngDataUrl);
        } else {
          resolve('');
        }
      };
      img.onerror = () => {
        console.warn('SVG image failed to load');
        resolve('');
      };
      img.src = url;
    });
  }

  // for digitalization
// ======================
// Export PDF
// ======================
async exportToPDF(): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const capitalizeFirst = (str: string): string =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    const surveyTitle = this.selectedSurveyAreaName
      ? `${capitalizeFirst(this.selectedSurveyAreaName)} - FTTH Survey`
      : 'FTTH Survey';

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text(surveyTitle, pdfWidth / 2, 20, { align: 'center' });

      // Add map info
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 35);

    //  Get survey area feature
    const surveyAreaFeature = this.vectorSource
      .getFeatures()
      .find(f => f.get('isSurveyArea') || f.get('type') === 'survey_area');

    if (!surveyAreaFeature) {
      alert('No survey area found.');
      return;
    }

    // Get extent of survey area
    const surveyExtent = surveyAreaFeature.getGeometry().getExtent();

    // Expand with buffer (~15%)
    const bufferFactor = 0.15;
    const width = surveyExtent[2] - surveyExtent[0];
    const height = surveyExtent[3] - surveyExtent[1];

    const bufferedExtent = [
      surveyExtent[0] - width * bufferFactor,
      surveyExtent[1] - height * bufferFactor,
      surveyExtent[2] + width * bufferFactor,
      surveyExtent[3] + height * bufferFactor,
    ];

    // Convert to bounds object
    const bounds = {
      minLng: bufferedExtent[0],
      minLat: bufferedExtent[1],
      maxLng: bufferedExtent[2],
      maxLat: bufferedExtent[3],
    };

    // Bounds info
    pdf.text(
      `Bounds: ${bounds.minLng.toFixed(6)}, ${bounds.minLat.toFixed(
        6
      )} to ${bounds.maxLng.toFixed(6)}, ${bounds.maxLat.toFixed(6)}`,
      20,
      42
    );

    // Calculate proper aspect ratio from bounds
    const dataWidth = bounds.maxLng - bounds.minLng;
    const dataHeight = bounds.maxLat - bounds.minLat;
    const dataAspectRatio = dataWidth / dataHeight;

    //  Calculate map area in PDF (leaving space for title and info)
    const mapStartY = 50;
    const mapHeight = pdfHeight - mapStartY - 20;
    const mapWidth = mapHeight * dataAspectRatio;
    const mapStartX = (pdfWidth - mapWidth) / 2;

    // Draw background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(mapStartX, mapStartY, mapWidth, mapHeight, 'F');

    // Get map snapshot for survey area only
    const mapImageDataUrl = await this.getMapCanvasAsImage(bounds);

    if (mapImageDataUrl) {
      pdf.addImage(mapImageDataUrl, 'PNG', mapStartX, mapStartY, mapWidth, mapHeight);
    }

    //  Draw only NON-survey features inside survey extent
    const features = this.vectorSource
      .getFeatures()
      .filter(f => {
        const geom = f.getGeometry();
        if (!geom) return false;

        const isSurvey = f.get('isSurveyArea') || f.get('type') === 'survey_area';
        return !isSurvey && intersects(geom.getExtent(), surveyExtent);
      });

    for (const feature of features) {
      try {
        const geometry = feature.getGeometry();
        if (!geometry) continue;

        const geometryType = geometry.getType();
        const coordinates = (geometry as any).getCoordinates();

        switch (geometryType) {
          case 'Point':
            await this.drawPointFromGeoJSON(
              pdf, coordinates, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
            );
            break;
          case 'MultiPoint':
            for (const coord of coordinates) {
              await this.drawPointFromGeoJSON(
                pdf, coord, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
              );
            }
            break;
          case 'LineString':
            this.drawLineFromGeoJSON(
              pdf, coordinates, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
            );
            break;
          case 'MultiLineString':
            for (const line of coordinates) {
              this.drawLineFromGeoJSON(
                pdf, line, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
              );
            }
            break;
          case 'Polygon':
            this.drawPolygonFromGeoJSON(
              pdf, coordinates, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
            );
            break;
          case 'MultiPolygon':
            for (const polygon of coordinates) {
              this.drawPolygonFromGeoJSON(
                pdf, polygon, mapStartX, mapStartY, mapWidth, mapHeight, bounds, feature
              );
            }
            break;
        }
      } catch (error) {
        console.warn('Error drawing feature:', error);
      }
    }

    pdf.save('survey-area-vector.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
}


// ======================
// Map snapshot function
// ======================
private getMapCanvasAsImage(bounds?: any): Promise<string> {
  return new Promise((resolve) => {
    const view = this.olMap.getView();
    const originalCenter = view.getCenter();
    const originalZoom = view.getZoom();

    if (bounds) {
      view.fit([bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat], {
        size: this.olMap.getSize(),
        padding: [20, 20, 20, 20],
      });
    }

    this.olMap.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      const size = this.olMap.getSize();
      if (!size) return resolve('');
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');

      Array.prototype.forEach.call(
        this.olMap.getViewport().querySelectorAll('.ol-layer canvas'),
        (canvas: HTMLCanvasElement) => {
          if (canvas.width > 0 && canvas.height > 0) {
            const opacity = canvas.parentElement?.style.opacity
              ? Number(canvas.parentElement.style.opacity)
              : 1;
            mapContext!.globalAlpha = opacity;
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              // Get the matrix from the style's transform
              matrix = transform.match(/^matrix\(([^\(]*)\)$/)?.[1]
                .split(',')
                .map(Number);
            }
            if (matrix && matrix.length === 6) {
              mapContext!.setTransform(
                matrix[0], matrix[1],
                matrix[2], matrix[3],
                matrix[4], matrix[5]
              );
            } else {
              mapContext!.setTransform(1, 0, 0, 1, 0, 0);
            }
            mapContext!.drawImage(canvas, 0, 0);
          }
        }
      );

      // ✅ Restore user view
      if (originalCenter && originalZoom) {
        view.setCenter(originalCenter);
        view.setZoom(originalZoom);
      }

      resolve(mapCanvas.toDataURL('image/png'));
    });
    this.olMap.renderSync();
  });
}

  private calculateBoundsFromFeatures(features: any[]): {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  } {
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;

    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getCoordinates();
        const bounds = this.updateBoundsFromCoordinates(
          coordinates,
          geometry.getType(),
          { minLng, minLat, maxLng, maxLat }
        );
        minLng = bounds.minLng;
        minLat = bounds.minLat;
        maxLng = bounds.maxLng;
        maxLat = bounds.maxLat;
      }
    });

    // Check if we got valid bounds
    if (
      minLng === Infinity ||
      minLat === Infinity ||
      maxLng === -Infinity ||
      maxLat === -Infinity
    ) {
      // Fallback bounds for Thakkarabapa Nagar area
      return {
        minLng: 72.63,
        minLat: 23.04,
        maxLng: 72.64,
        maxLat: 23.05,
      };
    }

    return { minLng, minLat, maxLng, maxLat };
  }

  private updateBoundsFromCoordinates(
    coordinates: any,
    geometryType: string,
    bounds: any
  ): { minLng: number; minLat: number; maxLng: number; maxLat: number } {
    let { minLng, minLat, maxLng, maxLat } = bounds;

    switch (geometryType) {
      case 'Point':
        minLng = Math.min(minLng, coordinates[0]);
        minLat = Math.min(minLat, coordinates[1]);
        maxLng = Math.max(maxLng, coordinates[0]);
        maxLat = Math.max(maxLat, coordinates[1]);
        break;
      case 'MultiPoint':
      case 'LineString':
        coordinates.forEach((coord: number[]) => {
          minLng = Math.min(minLng, coord[0]);
          minLat = Math.min(minLat, coord[1]);
          maxLng = Math.max(maxLng, coord[0]);
          maxLat = Math.max(maxLat, coord[1]);
        });
        break;
      case 'MultiLineString':
        coordinates.forEach((line: number[][]) => {
          line.forEach((coord: number[]) => {
            minLng = Math.min(minLng, coord[0]);
            minLat = Math.min(minLat, coord[1]);
            maxLng = Math.max(maxLng, coord[0]);
            maxLat = Math.max(maxLat, coord[1]);
          });
        });
        break;
      case 'Polygon':
        coordinates[0].forEach((coord: number[]) => {
          minLng = Math.min(minLng, coord[0]);
          minLat = Math.min(minLat, coord[1]);
          maxLng = Math.max(maxLng, coord[0]);
          maxLat = Math.max(maxLat, coord[1]);
        });
        break;
      case 'MultiPolygon':
        coordinates.forEach((polygon: number[][][]) => {
          polygon[0].forEach((coord: number[]) => {
            minLng = Math.min(minLng, coord[0]);
            minLat = Math.min(minLat, coord[1]);
            maxLng = Math.max(maxLng, coord[0]);
            maxLat = Math.max(maxLat, coord[1]);
          });
        });
        break;
    }

    return { minLng, minLat, maxLng, maxLat };
  }
  private async drawPointFromGeoJSON(
    pdf: jsPDF,
    coordinates: number[],
    mapStartX: number,
    mapStartY: number,
    mapWidth: number,
    mapHeight: number,
    bounds: any,
    feature: any
  ): Promise<void> {
    try {
      const pdfCoords = this.geoJSONToPDF(
        coordinates,
        mapStartX,
        mapStartY,
        mapWidth,
        mapHeight,
        bounds
      );

      // Validate coordinates
      if (!isFinite(pdfCoords[0]) || !isFinite(pdfCoords[1])) {
        return;
      }

      const featureType = feature.get('type');
      const status = feature.get('status');

      const getFeatureColor = (type: string, status: string) => {
        switch (type) {
          case 'FAT':
            return [255, 0, 0]; // Red for FAT
          case 'POP':
            return [0, 0, 255]; // Blue for POP
          case 'FDC':
            return [255, 102, 0]; // Orange for FDC
          case 'CSA':
            return [0, 255, 0]; // Green for CSA
          case 'fat':
            return [255, 0, 0];
          case 'fdc':
            return [255, 102, 0];
          case 'splice':
            return [255, 0, 255];
          case 'manhole':
            return [102, 51, 0];
          case 'pole':
            return [51, 51, 51];
          case 'building':
            return [170, 170, 170];
          default:
            return [255, 68, 68];
        }
      };

      const getFeatureSize = (type: string) => {
        switch (type) {
          case 'FAT':
            return 1.0; // Very small for FAT points
          case 'POP':
            return 2.5; // Medium for POP points
          case 'FDC':
            return 1.0; // Very small for FDC points
          case 'fat':
            return 1.0;
          case 'fdc':
            return 1.0;
          case 'splice':
            return 2.0;
          case 'manhole':
            return 2.0;
          case 'pole':
            return 1.5;
          case 'building':
            return 1.0;
          default:
            return 1.5;
        }
      };

      const color = getFeatureColor(featureType, status);
      const size = getFeatureSize(featureType);

      // Enhanced vector shapes with better quality
      if (featureType === 'FAT' || featureType === 'fat') {
        const name = feature.get('id') || 'FAT';
        const homepasses = feature.get('homepasses') || '0';
        const svg = this.generateDynamicFATSvg(name, homepasses);
        const image = await this.svgToImage(svg);
        if (image) {
          const width = 12;
          const height = 12;
          pdf.addImage(
            image,
            'PNG',
            pdfCoords[0] - width / 2,
            pdfCoords[1] - height / 2,
            width,
            height,
          );
        }
      } else if (
        featureType === 'building' ||
        featureType === 'building_center' ||
        featureType === 'sdu' ||
        featureType === 'mdu' ||
        featureType === 'cdu'
      ) {
        const original = (feature.get('originalType') || featureType || '').toLowerCase();
        const name = feature.get('name') || original.toUpperCase();
        const street = feature?.get('street') || 'STREET NAME';
        const number = feature?.get('number') || '0';
        const floor = feature?.get('floor') || '1F';
        const units = feature?.get('units') || '1';
        const fatId = feature?.get('fat_id') || 'FAT 00-00';
        const equipment = feature?.get('equipment') || 'SFU';
        const count = feature?.get('count') || '1';
        const olt = feature?.get('olt') || 'OLT 00-00';
        const location = feature?.get('location') || 'LOCATION';
        const status = feature?.get('status') || 'STATUS';


        let svg: string;
        if (original === 'sdu' || featureType === 'sdu') {
          svg = this.generateSduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, status, 150);
        } else if (original === 'cdu' || featureType === 'cdu') {
          svg = this.generateCduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, 150);
        } else if (original === 'mdu' || featureType === 'mdu') {
          svg = this.generateMduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, 150);
        } else {
          svg = this.generateMduSvg(name, street, number, floor, units, fatId, equipment, count, olt, location, 150);
        }

        const image = await this.svgToImage(svg);
        if (image) {
          const width = 16;
          const height = 16;
          pdf.addImage(
            image,
            'PNG',
            pdfCoords[0] - width / 2,
            pdfCoords[1] - height / 2,
            width,
            height,
          );
          return;
        }
      } else if (featureType === 'pole') {
        const poleId = feature.get('poleId') || 'Pole';
        const sn = feature.get('sn') || 'SN';
        const type = (feature.get('originalType') || '').toLowerCase(); // optional: store original

        let svg: string;
        if (type === '8m') svg = this.generate8mPoleSvg(sn, poleId);
        else if (type === '12m') svg = this.generate12mPoleSvg(sn, poleId);
        else svg = this.generate10mPoleSvg(sn, poleId);

        const image = await this.svgToImage(svg);
        if (image) {
          const width = 6;
          const height = 16;
          pdf.addImage(
            image,
            'PNG',
            pdfCoords[0] - width,
            pdfCoords[1] - height / 2,
            width,
            height
          );
        }
      } else if (featureType === 'manhole') {
        const name = feature.get('name') || 'MH';
        const svg = this.generateManholeSvg(name);
        const image = await this.svgToImage(svg);
        if (image) {
          const width = 14;
          const height = 14;
          pdf.addImage(image, 'PNG', pdfCoords[0] - width / 2, pdfCoords[1] - height / 2, width, height);
        }

      } else if (featureType === 'handhole') {
        const name = feature.get('name') || 'HH';
        const svg = this.generateHandholeSvg(name);
        const image = await this.svgToImage(svg);
        if (image) {
          const width = 14;
          const height = 14;
          pdf.addImage(image, 'PNG', pdfCoords[0] - width / 2, pdfCoords[1] - height / 2, width, height);
        }
      } else if (featureType === 'olt') {
        const name = feature.get('name') || 'OLT';
        const oltNo = feature.get('oltNo') || '01';
        const svg = this.generateOltSvg(name, oltNo);
        const image = await this.svgToImage(svg);
        if (image) {
          const width = 16;
          const height = 16;
          pdf.addImage(image, 'PNG', pdfCoords[0] - width / 2, pdfCoords[1] - height / 2, width, height);
        }
      } else if (featureType === 'jointclosure') {
        const name = feature.get('name') || 'JC';
        const svg = this.generateJointClosureSvg(name);
        const image = await this.svgToImage(svg);
        if (image) {
          const width = 14;
          const height = 14;
          pdf.addImage(image, 'PNG', pdfCoords[0] - width / 2, pdfCoords[1] - height / 2, width, height);
        }
      } else if (featureType === 'splitter') {
        const name = feature.get('name') || 'Splitter';
        const original = (feature.get('originalType') || '').toLowerCase();

        let svg: string;
        if (original === 'fdt') {
          // svg = this.generateFdtSplitterSvg(name);
        } else {
          svg = this.generateFatSplitterSvg(name);
        }

        const image = await this.svgToImage(svg);
        if (image) {
          const width = 16;
          const height = 16;
          pdf.addImage(image, 'PNG', pdfCoords[0] - width / 2, pdfCoords[1] - height / 2, width, height);
        }
      } else {
        // fallback shape for other types
        pdf.setDrawColor(color[0], color[1], color[2]);
        pdf.setLineWidth(0.3);
        pdf.circle(pdfCoords[0], pdfCoords[1], size, 'D');
      }
    } catch (error) {
      console.warn('Error drawing point feature:', error);
    }
  }

  private async drawLineFromGeoJSON(
    pdf: jsPDF,
    coordinates: number[][],
    mapStartX: number,
    mapStartY: number,
    mapWidth: number,
    mapHeight: number,
    bounds: any,
    feature: any
  ): Promise<void> {
    if (!coordinates || coordinates.length < 2) return;

    const pdfCoords = coordinates.map((coord) =>
      this.geoJSONToPDF(coord, mapStartX, mapStartY, mapWidth, mapHeight, bounds)
    );

    const validCoords = pdfCoords.filter(
      (coord) => isFinite(coord[0]) && isFinite(coord[1])
    );
    if (validCoords.length < 2) return;

    const featureType = feature.get('type');
    const status = feature.get('status');

    // Check if feature is a cable → use SVG instead of normal lines
    if (featureType === 'cable') {
      const name = feature.get('name') || 'Cable';
      const svg = this.generateCableSvg(name);
      const image = await this.svgToImage(svg);

      if (image) {
        for (let i = 0; i < validCoords.length - 1; i++) {
          const current = validCoords[i];
          const next = validCoords[i + 1];

          const midX = (current[0] + next[0]) / 2;
          const midY = (current[1] + next[1]) / 2;

          pdf.addImage(image, 'PNG', midX - 8, midY - 4, 16, 8);
        }
        return; // Skip default line drawing
      }
    } else if (featureType === 'trench') {
      const name = feature.get('name') || 'Trench';
      const svg = this.generateTrenchSvg(name);
      const image = await this.svgToImage(svg);

      if (image) {
        for (let i = 0; i < validCoords.length - 1; i++) {
          const current = validCoords[i];
          const next = validCoords[i + 1];

          const midX = (current[0] + next[0]) / 2;
          const midY = (current[1] + next[1]) / 2;

          pdf.addImage(image, 'PNG', midX - 8, midY - 4, 16, 8);
        }
        return; // Skip default line drawing
      }
    } else if (featureType === 'duct') {
      const name = feature.get('name') || 'Duct';
      const svg = this.generateDuctSvg(name);
      const image = await this.svgToImage(svg);

      if (image) {
        for (let i = 0; i < validCoords.length - 1; i++) {
          const current = validCoords[i];
          const next = validCoords[i + 1];

          const midX = (current[0] + next[0]) / 2;
          const midY = (current[1] + next[1]) / 2;

          pdf.addImage(image, 'PNG', midX - 8, midY - 4, 16, 8);
        }
        return; // Skip default line drawing
      }
    }

    // Default color and line width fallback
    const getLineColor = (type: string, status: string) => {
      switch (type) {
        case 'cable':
          return status === 'active' ? [0, 102, 255] : [255, 0, 0];
        default:
          return [0, 0, 0];
      }
    };

    const getLineWidth = (type: string, status: string) => {
      switch (type) {
        case 'cable':
          return status === 'active' ? 0.4 : 0.3;
        default:
          return 0.2;
      }
    };

    const color = getLineColor(featureType, status);
    const lineWidth = getLineWidth(featureType, status);

    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.setLineWidth(lineWidth);

    for (let i = 0; i < validCoords.length - 1; i++) {
      const current = validCoords[i];
      const next = validCoords[i + 1];

      if (
        isFinite(current[0]) &&
        isFinite(current[1]) &&
        isFinite(next[0]) &&
        isFinite(next[1])
      ) {
        pdf.line(current[0], current[1], next[0], next[1]);
      }
    }
  }


  private drawPolygonFromGeoJSON(
    pdf: jsPDF,
    coordinates: number[][][],
    mapStartX: number,
    mapStartY: number,
    mapWidth: number,
    mapHeight: number,
    bounds: any,
    feature: any
  ): void {
    const pdfCoords = coordinates[0].map((coord) =>
      this.geoJSONToPDF(
        coord,
        mapStartX,
        mapStartY,
        mapWidth,
        mapHeight,
        bounds
      )
    );

    // Filter out invalid coordinates
    const validCoords = pdfCoords.filter(
      (coord) => isFinite(coord[0]) && isFinite(coord[1])
    );

    if (validCoords.length < 3) {
      return;
    }

    const featureType = feature.get('type');
    const status = feature.get('status');

    // Get polygon color
    const getPolygonColor = (type: string, status: string) => {
      switch (type) {
        case 'CSA':
          return [0, 255, 0]; // Green for CSA areas
        case 'dsa':
          return [0, 255, 0]; // Green for DSA
        case 'survey_area':
          return [255, 0, 0]; // Red for survey areas
        case 'building':
          return status === 'connected'
            ? [0, 170, 0]
            : status === 'planned'
              ? [255, 255, 0]
              : [170, 170, 170];
        default:
          return [0, 170, 0];
      }
    };

    const color = getPolygonColor(featureType, status);

    // Enhanced polygon drawing with fills for certain types
    if (featureType === 'dsa') {
      // Fill polygon for DSA areas using a more reliable method
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setDrawColor(color[0], color[1], color[2]);
      pdf.setLineWidth(0.3);

      // Use individual line segments to create the polygon fill effect
      for (let i = 0; i < validCoords.length; i++) {
        const current = validCoords[i];
        const next = validCoords[(i + 1) % validCoords.length];

        // Draw filled line segments to create fill effect
        pdf.line(current[0], current[1], next[0], next[1]);
      }
    }

    // Draw polygon border with enhanced vector quality
    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.setLineWidth(
      featureType === 'building' || featureType === 'CSA' ? 0.1 : 0.2
    );

    // Solid border - draw each edge as a separate line
    for (let i = 0; i < validCoords.length; i++) {
      const current = validCoords[i];
      const next = validCoords[(i + 1) % validCoords.length];

      // Ensure coordinates are valid numbers
      if (
        isFinite(current[0]) &&
        isFinite(current[1]) &&
        isFinite(next[0]) &&
        isFinite(next[1])
      ) {
        pdf.line(current[0], current[1], next[0], next[1]);
      }
    }
  }
  private geoJSONToPDF(
    coordinates: number[],
    mapStartX: number,
    mapStartY: number,
    mapWidth: number,
    mapHeight: number,
    bounds: any
  ): number[] {
    const x =
      mapStartX +
      ((coordinates[0] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
      mapWidth;
    const y =
      mapStartY +
      ((bounds.maxLat - coordinates[1]) / (bounds.maxLat - bounds.minLat)) *
      mapHeight;

    return [x, y];
  }

  private convertToGeoJSONFeatures(data: any): Feature[] {
    const features: Feature[] = [];

    Object.keys(data).forEach((layerName) => {
      const items = data[layerName];
      items.forEach((item: any) => {
        // Normalize layerName → feature type
        let rawType = (item.layerName || layerName || '').toLowerCase();
        let type = rawType; //  Fix here
        let cableCore = null;

        // Map to consistent feature types for styling & SVG logic
        if (type === '8m' || type === '10m' || type === '12m') type = 'pole';
        else if (type === 'sdu' || type === 'mdu' || type === 'cdu') type = 'building_center';
        else if (['manhole', 'handhole'].includes(type)) {
          type = rawType; // keep them as-is
        } else if (type === 'jointClosure') {
          type = 'jointclosure'
        } else if (type === 'splitter') {
          type = 'splitter';
        } else if (type === 'fdt') {
          type = 'splitter'; // same type, different originalType
        } else if (['2c', '6c', '12c', '24c', '48c', '96c', '144c', '288c'].includes(type)) {
          type = 'cable';
          cableCore = rawType.toUpperCase(); // preserve for color logic
        } else if (type === 'trench') {
          type = 'trench';

        } else if (type === 'duct') {
          type = 'duct';
        }

        const feature = new Feature({
          geometry: new GeoJSON().readGeometry(item.geom, {
            featureProjection: 'EPSG:4326',
          }),
          name: item.name,
          publicId: item.publicId,
          type: type,
          originalType: rawType,
          status: item.status || '',
          height: rawType,
          cableCore: cableCore,
        });

        features.push(feature);
      });
    });

    return features;
  }


  private async loadGeoJSON(): Promise<void> {
    try {
      const response = await fetch('assets/json/thakkarabapa-nagar.geojson');
      const json = await response.json();

      // DO NOT call readFeatures here
      const features = this.convertToGeoJSONFeatures(json.data);

      // Optional: Convert building polygons to icons
      const processedFeatures = this.processBuildingFeatures(features);

      this.vectorSource.addFeatures(processedFeatures);

      // Zoom to extent
      setTimeout(() => {
        const extent = this.vectorSource.getExtent();
        if (extent && !extent.every((coord) => coord === Infinity)) {
          this.olMap.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 18,
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  }

  private processBuildingFeatures(features: any[]): any[] {
    const processedFeatures: any[] = [];

    features.forEach((feature) => {
      const featureType = feature.get('type');

      if (featureType === 'building') {
        // Convert building polygon to center point
        const geometry = feature.getGeometry();
        if (geometry && geometry.getType() === 'Polygon') {
          const extent = geometry.getExtent();
          const centerX = (extent[0] + extent[2]) / 2;
          const centerY = (extent[1] + extent[3]) / 2;

          // Create a new point feature at the center
          const centerPoint = new Point([centerX, centerY]);

          // Create new feature with point geometry but keep building properties
          const centerFeature = feature.clone();
          centerFeature.setGeometry(centerPoint);
          centerFeature.set('type', 'building_center'); // Mark as building center

          processedFeatures.push(centerFeature);
        }
      } else {
        // Keep other features as they are
        processedFeatures.push(feature);
      }
    });

    return processedFeatures;
  }

  toggleDesign() {
    this.useAlternativeDesign = !this.useAlternativeDesign;
    this.refreshMapFeatures();
  }
  refreshMapFeatures() {
    const source = this.vectorLayer.getSource();
    if (source) {
      source.getFeatures().forEach(feature => {
        feature.setStyle(this.createFeatureStyle(feature));
      });
    }
  }

  createConnectivity() {
    
  }

}
