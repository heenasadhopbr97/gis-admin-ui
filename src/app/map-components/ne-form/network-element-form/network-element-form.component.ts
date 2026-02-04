import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-network-element-form',
  templateUrl: './network-element-form.component.html',
  styleUrls: ['./network-element-form.component.css'],
  standalone:false
})
export class NetworkElementFormComponent {
  @Input() showCableOption: boolean = false;
  @Input() showRectangleOption: boolean = false;
  @Input() selectedFeatureDetails: any = null;
  @Input() selectedLayer: string = '';
  
  @Output() layerSelected = new EventEmitter<string>();
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formClosed = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      layerSelect: ['']
    });
  }

  onLayerChange() {
    this.layerSelected.emit(this.form.get('layerSelect')?.value);
  }

  onSubmit() {
    this.formSubmitted.emit();
  }

  onClose() {
    this.formClosed.emit();
  }
}