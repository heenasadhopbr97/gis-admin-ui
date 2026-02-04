import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-man-hole',
  standalone: false,
  templateUrl: './man-hole.component.html',
  styleUrl: './man-hole.component.css'
})
export class ManHoleComponent {

  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;
  isLoading = false;

    constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService) {
    this.form = this.fb.group({
      name: ['',Validators.required],
      manholeSize: ['', Validators.required],
      depthCm: ['',Validators.required],
      coverType: ['',Validators.required],
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
    this.apiService.createManhole(formData).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, 'Success');
        this.form.reset();
      },
      error: (error:any) => {
        console.error(error, 'Error creating MANHOLE');
        this.toastr.error('Failed to create MANHOLE', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
