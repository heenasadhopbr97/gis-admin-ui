import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, transform } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { Style, Icon } from 'ol/style';
import { Translate } from 'ol/interaction';

@Component({
  selector: 'app-fdp',
  templateUrl: './fdp.component.html',
  styleUrl: './fdp.component.css',
  standalone: false
})
export class FdpComponent implements OnDestroy {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() map!: Map;
  @Input() featureData: any;
  isEditMode = false;

  form: FormGroup;
  isLoading = false;
  fdpError: string | null = null;
  fdpTypes: any[] = [];
  popList = [
    { id: 1, name: 'POP A' },
    { id: 2, name: 'POP B' },
    { id: 3, name: 'POP C' }
  ];

  public markerFeature: Feature<Point> | null = null;
  public vectorLayer: VectorLayer<VectorSource> | null = null;
  public translateInteraction: Translate | null = null;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService, 
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      port: [null, Validators.required],
      typeId: [1],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      status: [''],
      userId: this.apiService.getUserId(),
      parentNeId: [1, Validators.required],
      mvnoId: this.apiService.getMvnoId(),
    });
  }

  ngOnInit() {
    this.loadFdpTypes();
    if (this.featureData) {
      this.isEditMode = true;
      this.patchFormWithData(this.featureData);
      this.initMarker();
    }
  }

  private initMarker(): void {
    const vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: 'assets/marker-icon-2x.png',
          scale: 0.5,
          anchor: [0.5, 1]
        })
      })
    });

    const coords = fromLonLat([
      this.form.value.longitude,
      this.form.value.latitude
    ]);
    this.markerFeature = new Feature({
      geometry: new Point(coords)
    });

    vectorSource.addFeature(this.markerFeature);
    this.map.addLayer(this.vectorLayer);

    this.translateInteraction = new Translate({
      features: vectorSource.getFeaturesCollection()
    });
    this.map.addInteraction(this.translateInteraction);

    this.translateInteraction.on('translateend', () => {
      const coords = (this.markerFeature!.getGeometry() as Point).getCoordinates();
      const lonLat = transform(coords, this.map.getView().getProjection(), 'EPSG:4326');
      this.form.patchValue({
        longitude: lonLat[0],
        latitude: lonLat[1]
      });
    });
  }

  loadFdpTypes() {
    this.isLoading = true;
    this.fdpError = null;

    this.apiService.getFdpTypes().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.fdpTypes = response.data;
          if (this.fdpTypes.length > 0 && !this.isEditMode) {
            this.form.patchValue({
              typeId: this.fdpTypes[0].id
            });
          }
        }
      },
      error: (error) => {
        this.fdpError = 'Failed to load FDP types';
        this.toastr.error('Failed to load FDP types', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const formData = this.form.value;
    const publicId = this.featureData?.publicId;

    if (!publicId) {
      this.apiService.createFdp(formData).subscribe({
        next: (response: any) => {
          this.toastr.success(response?.message || 'FDP created successfully', 'Success');
          this.form.reset();
          this.closeForm.emit();
          this.formSubmit.emit(response.data);
          this.cleanupMarker();
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message || 
            error.message || 
            'Failed to create FDP', 
            'Error'
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.updateFdp(publicId, formData).subscribe({
        next: (response: any) => {
          this.toastr.success(response?.message || 'FDP updated successfully', 'Success');
          this.form.reset();
          this.closeForm.emit();
          this.formSubmit.emit(response.data);
          this.cleanupMarker();
        },
        error: (error: any) => {
          this.toastr.error(
            error.error?.message || 
            error.message || 
            'Failed to update FDP', 
            'Error'
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private cleanupMarker(): void {
    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
    }
    if (this.translateInteraction) {
      this.map.removeInteraction(this.translateInteraction);
    }
  }

  ngOnDestroy(): void {
    this.cleanupMarker();
  }

  patchFormWithData(data: any): void {
    this.form.patchValue({
      name: data.name,
      port: data.port,
      typeId: data.lookupFdpType.id,
      status: data.status,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      parentNeId: data.parentNeId || 1,
      userId: data.userId || 1
    });
  }

  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1],
    });
  }
}