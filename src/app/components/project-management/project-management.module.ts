import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManagementComponent } from './project-management.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeactivateService } from 'src/app/service/deactivate.service';
import { FormsModule } from '@angular/forms';

const routes = [
  {
    path: '',
    component: ProjectManagementComponent,
    canDeactivate: [DeactivateService],
  },
];

@NgModule({
  declarations: [ProjectManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class ProjectManagementModule {}
