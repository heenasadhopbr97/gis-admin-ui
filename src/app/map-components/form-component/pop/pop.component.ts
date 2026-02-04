import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
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
import { Select, Translate } from 'ol/interaction';

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrl: './pop.component.css',
  standalone: false
})
export class PopComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() map!: Map;
  @Input() featureData: any;
   isEditMode = false;

  form: FormGroup;
  isLoading = false;
  public markerFeature: Feature<Point> | null = null;
  public vectorLayer: VectorLayer<VectorSource> | null = null;
  public translateInteraction: Translate | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      parentNeType: ['Handhold', Validators.required],
      userId: this.apiService.getUserId(),
      parentNeId: [1, Validators.required],
      mvnoId: this.apiService.getMvnoId(),
    });
  }

  ngOnInit(): void {
      if (this.featureData) {
      this.isEditMode = true; // Set to true when editing
      this.patchFormWithData(this.featureData);
      this.initMarker();
    }
  }

  private initMarker(): void {
    // Create vector source and layer
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

     // Add translate interaction
  this.translateInteraction = new Translate({
    features: vectorSource.getFeaturesCollection()
  });
  this.map.addInteraction(this.translateInteraction);


    // Create marker feature
    const coords = fromLonLat([
      this.form.value.longitude,
      this.form.value.latitude
    ]);
    this.markerFeature = new Feature({
      geometry: new Point(coords)
    });

    vectorSource.addFeature(this.markerFeature);
    this.map.addLayer(this.vectorLayer);

    // Add translate interaction
    this.translateInteraction = new Translate({
      features: vectorSource.getFeaturesCollection()
    });
    this.map.addInteraction(this.translateInteraction);

  // Listen to drag end events instead of translating
  this.translateInteraction.on('translateend', () => {
    const coords = (this.markerFeature!.getGeometry() as Point).getCoordinates();
    const lonLat = transform(coords, this.map.getView().getProjection(), 'EPSG:4326');
    
    this.form.patchValue({
      longitude: lonLat[0],
      latitude: lonLat[1]
    });
  });
  }

  onSubmit() {
  if (this.form.invalid) return;
  this.isLoading = true;
  const formData = this.form.value;
  const publicId = this.featureData?.publicId;

  if (!publicId) {
    this.apiService.createPOP(formData).subscribe({
      next: (response: any) => {
         this.toastr.success(
          response?.message?.message || 
          response?.message || 
          'POP created successfully', 
          'Success'
        );
        this.form.reset();
        this.closeForm.emit(); // Emit close event
        this.formSubmit.emit(response.data); // Emit form submit with data
        this.cleanupMarker();
      },
      error: (error: any) => {
        console.error(error, 'Error creating POP');
        this.toastr.error('Failed to create POP', 'Error');
        this.isLoading = false;
      }
    });
  } else {
    this.apiService.updatePop(publicId, formData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success('POP updated successfully', 'Success');
        this.form.reset();
        this.closeForm.emit(); // Emit close event
        this.formSubmit.emit(response.data); // Emit form submit with data
        this.cleanupMarker();
      },
      error: (error: any) => {
        console.error('Update error:', error);
        this.toastr.error('Failed to update POP');
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
      address: data.address,
      category: data.category,
      status: data.status,
      longitude: data.geom?.coordinates?.[0] || data.longitude,
      latitude: data.geom?.coordinates?.[1] || data.latitude,
      parentNeId: data.parentNeId || 1,
      parentNeType: data.parentNeType || 'Handhold',
      userId: data.userId || 1
    });
  }

  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      latitude: coords[1],
      longitude: coords[0],
    });
  }

}