import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-customer-point',
  templateUrl: './customer-point.component.html',
  styleUrl: './customer-point.component.css',
  standalone: false
})
export class CustomerPointComponent {
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['',Validators.required],
      address: ['',Validators.required],
      port: ['',Validators.required],
      customerType: ['',Validators.required],
      longitude: [null, Validators.required],
      latitude: [null, Validators.required],
      parentType: ['Handhold', Validators.required],
      status: ['',Validators.required],
      activationDate: ['', Validators.required],
      userId: this.apiService.getUserId(),
      parentId: [1, Validators.required],
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
    this.apiService.createCustomer({
      name: formData.name,
      address: formData.address,
      port: formData.port,
      customerType: formData.customerType,
      longitude: formData.longitude,
      latitude: formData.latitude,
      parentType: formData.parentType,
      status: formData.status,
      activationDate: formData.activationDate,
      userId: formData.userId,
      parentId: formData.parentId,
      mvnoId: formData.mvnoId
    }).subscribe({
      next: (response:any) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message
      });
        this.form.reset();
      },
      error: (error) => {
        console.error(error, 'Error creating Customer Point');
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