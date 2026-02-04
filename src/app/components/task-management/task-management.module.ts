import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementComponent } from './task-management.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeactivateService } from 'src/app/service/deactivate.service';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
const routes = [
  {
    path: '',
    component: TaskManagementComponent,
    canDeactivate: [DeactivateService],
  },
  {
    path: ':projectId',
    component: TaskManagementComponent,
    canDeactivate: [DeactivateService],
  },
];

@NgModule({
  declarations: [TaskManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TooltipModule
  ],
})
export class TaskManagementModule {}
