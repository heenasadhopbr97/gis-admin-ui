import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-hand-hole',
  standalone: false,
  templateUrl: './hand-hole.component.html',
  styleUrl: './hand-hole.component.css'
})
export class HandHoleComponent {

  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService) {
    this.form = this.fb.group({
      name: ['',Validators.required],
      holeSize: ['', Validators.required],
      material: ['Plastic',Validators.required],
      accessType: ['Top Open', Validators.required],
      longitude: [null, Validators.required], 
      latitude: [null, Validators.required],
      status: ['Planned', Validators.required], 
      userId: this.apiService.getUserId(),
      mvnoId: this.apiService.getMvnoId(),
    });
  }
  // Update coordinates method
  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1],
    });
  }

  onSubmit(){
    if (this.form.invalid) return;
    this.isLoading = true;
    const formData = this.form.value;
    this.apiService.createHandhole(formData).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, 'Success');
        this.form.reset();
      },
      error: (error:any) => {
        console.error(error, 'Error creating HAND HOLE');
        this.toastr.error('Failed to create HAND HOLE', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
 

}
