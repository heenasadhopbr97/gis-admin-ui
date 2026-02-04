import { Component, EventEmitter, Output, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MapService } from '../../map.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drawing-tools',
  templateUrl: './drawing-tools.component.html',
  styleUrls: ['./drawing-tools.component.css'],
  standalone: false
})
export class DrawingToolsComponent implements OnInit{
  @Input() userId: number | null = null;
  // @Input() selectedSurveyAreaId: number | null = null;
  @Output() drawStart = new EventEmitter<'Point' | 'LineString' | 'Polygon'>();
  @Output() clearDrawings = new EventEmitter<void>();
  @Output() polygonDrawStart = new EventEmitter<void>();
  @Input() currentDrawingMode: 'Point' | 'LineString' | 'Polygon' | null = null;
  @Input() selectedSurvey: any = null;

  @Output() closeLayerPanel = new EventEmitter<void>();

  hasSurveyCreatePermission: boolean = false;
  hasNetworkCreatePermission: boolean = false;


  private aclSubscription: Subscription | null = null;

  constructor( public messageService: MessageService,private mapService: MapService, public apiService: ApiService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.checkSurveyCreatePermission();
    this.checkNetworkCreatePermission();
  }

  // checkSurveyCreatePermission(): void {
  //   this.aclSubscription = this.mapService.aclEntry$.subscribe((aclEntries: any[] | null) => {
  //     if (aclEntries) {
  //       this.hasSurveyCreatePermission = aclEntries.some(entry =>
  //         entry.code === "survey_management_survey_create"
  //       );
  //     }
  //   });
  // }

    checkSurveyCreatePermission() {
      this.mapService.getMethod("/acl/getAclEntry").subscribe((res: any) => {
        const aclEntries = res?.dataList || [];

        // Check if the required permission code exists
        this.hasSurveyCreatePermission = aclEntries.some((entry: any) =>
          entry.code === "survey_management_survey_create"
        );
      });
    }

    checkNetworkCreatePermission() {
      this.mapService.getMethod("/acl/getAclEntry").subscribe((res: any) => {
        const aclEntries = res?.dataList || [];

          // Check if the required permission code exists
          this.hasNetworkCreatePermission = aclEntries.some((entry: any) =>
            entry.code === "network_management_create"
          );
        });
    }


startDrawing(type: 'Point' | 'LineString' | 'Polygon') {
  const role = this.apiService.getRoleName();

  if ((type === 'Point' || type === 'LineString') && role !== 'Admin') {
    if (!this.selectedSurvey) {
      this.toastr.warning('Please select a survey area first.');
      return;
    }

    const status = this.selectedSurvey?.surveyStatusName?.toString().trim().toLowerCase();
    console.log(status);
    
    if (status == 'completed') {
      this.toastr.warning('Survey area is completed. You cannot draw points or lines.');
      return;
    }

    // ADD THIS CONDITION:
    if (status !== 'in progress') {
      this.toastr.warning('Please change the survey status to In Progress.');
      return;
    }
  }

  if (type === 'Polygon') {
    this.currentDrawingMode = type;
    this.polygonDrawStart.emit();
  } else {
    this.drawStart.emit(type);
  }

  this.closeLayerPanel.emit();
}

  onClearDrawings(): void {
    this.currentDrawingMode = null;
    this.clearDrawings.emit();
  }
}
