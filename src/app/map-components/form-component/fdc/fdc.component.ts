import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-fdc',
  templateUrl: './fdc.component.html',
  styleUrl: './fdc.component.css',
  standalone: false
})
export class FdcComponent {
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      status: ['', Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      parentNeType: ['Handhold', Validators.required],
      userId: this.apiService.getUserId(),
      parentNeId: [1, Validators.required],
      mvnoId: this.apiService.getMvnoId(),
    });
  }

  updateCoordinates(coords: [number, number]) {
    this.form.patchValue({
      longitude: coords[0],
      latitude: coords[1],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const formData = this.form.value;
    this.apiService.createFDC(formData).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message
      });
        this.form.reset();
      },
      error: (error:any) => {
        console.error(error, 'Error creating FDC');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
      });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
