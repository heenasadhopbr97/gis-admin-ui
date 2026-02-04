import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
type SurveyStatus = 'Initiated' | 'Assigned' | 'In progress' | 'Approved' | 'Completed' | 'Done' | 'Reassign' | 'Review';
import { forkJoin } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-survey-assignment-dialog',
  standalone: false,
  templateUrl: './survey-assignment-dialog.component.html',
  styleUrl: './survey-assignment-dialog.component.css'
})
export class SurveyAssignmentDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() surveyStatusUpdated = new EventEmitter<void>();
  @Output() updateSurveyStatus = new EventEmitter<{ selectedStage: string, isSurveyShow: boolean }>();

  surveyList: any[] = [];
  userOptions: any[] = [];
  selectedSurveys: any[] = [];
  filteredSurveys: any[] = [];
  searchText: string = '';
  staffList: any[] = [];

  statusOptions: any[] = [];
  stageOptions: any[] = [];
  selectedStatus: string | null = null;
  selectedStage: string | null = null;

  // Pagination
  first: number = 0;
  rowsPerPage: number = 10;
  totalRecords: number = 0;
  isLoading: boolean = false;

  isRejectDialogVisible: boolean = false;
  rejectionReason: string = '';
  selectedSurveyForRejection: any = null;

  private readonly statusOrder: Record<SurveyStatus, number> = {
    'Initiated': 1,
    'Assigned': 2,
    'In progress': 3,
    'Approved': 4,
    'Completed': 5,
    'Done': 6,
    'Reassign': 7,
    'Review': 8
  };

  constructor(
    public apiService: ApiService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private messageService: MessageService
  ) { }

  ngOnInit() {
    this.filteredSurveys = [...this.sortedSurveys];
  }

  private initializeFilters(): void {
    // Get unique status and stage values
    const uniqueStatuses = new Set(this.surveyList.map(s => s.surveyStatusName));
    const uniqueStages = new Set(this.surveyList.map(s => s.surveyStageName));

    this.statusOptions = Array.from(uniqueStatuses).map(status => ({
      label: status,
      value: status
    })).sort((a, b) => a.label.localeCompare(b.label));

    this.stageOptions = Array.from(uniqueStages).map(stage => ({
      label: stage,
      value: stage
    })).sort((a, b) => a.label.localeCompare(b.label));
  }
  // When dialog becomes visible
  onShow() {
    this.loadData();
  }

  getBadgeClass(status: string): string {
    const statusMap: Record<SurveyStatus, string> = {
      'Initiated': 'badge-initiated',
      'Assigned': 'badge-assigned',
      'In progress': 'badge-in-progress',
      'Approved': 'badge-approved',
      'Completed': 'badge-completed',
      'Done': 'badge-done',
      'Reassign': 'badge-reassign',
      'Review': 'badge-approved'
    };
    return statusMap[status as SurveyStatus] || 'badge-initiated';
  }

  surveyStatusOptions: { id: number, name: string }[] = [];
  // Load both survey and user data
  loadData(): void {
    const userId = this.apiService.getUserId();
    const mvnoId = this.apiService.getMvnoId();
    this.isLoading = true;

    forkJoin([
      this.apiService.getsurveyArea(userId, mvnoId),
      this.apiService.getassignuserName() // This should return staff list
    ]).subscribe({
      next: ([surveyRes, staffRes]: any) => {
        this.staffList = staffRes.data
        this.userOptions = this.staffList.map(staff => ({
          id: staff.staffId,
          name: staff.userName
        }));

        // Create a staffId -> userName map for quick lookup
        const staffMap = this.staffList.reduce((acc, staff) => {
          acc[staff.staffid] = staff.userName;
          return acc;
        }, {} as Record<number, string>);

        // Process survey data
        if (surveyRes.success && Array.isArray(surveyRes.data)) {
          this.surveyList = surveyRes.data.map((item: any) => ({
            surveyId: item.id,
            publicId: item.publicId,
            surveyName: item.name,
            userId: this.apiService.getUserId(),
            statusId: item.statusId,
            surveyStatusName: this.normalizeStatusName(item.surveyStatusName),
            surveyStageName: item.surveyStageName || item.lookupSurveyStage?.name || '—',
            staffId: item.staffId, // The currently assigned staff ID
            staffName: staffMap[item.staffId] || 'Unassigned', // The currently assigned staff name
            // For dropdown selection - preselect the current staff
            selectedUserId: item.staffId || null
          }));

          this.filteredSurveys = [...this.sortedSurveys];
          this.totalRecords = this.surveyList.length;
          this.isLoading = false;
          this.initializeFilters();
        } else {
          this.surveyList = [];
          this.totalRecords = 0;
          this.toastr.warning('No survey data found', 'Warning');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load data', 'Error');
        this.isLoading = false;
      }
    });

  }

  private normalizeStatusName(status: string): SurveyStatus {
    if (!status) return 'Initiated';
    const statusMap: Record<string, SurveyStatus> = {
      'Initiated': 'Initiated',
      'Assigned': 'Assigned',
      'In progress': 'In progress',
      'Approved': 'Approved',
      'Completed': 'Completed',
      'Done': 'Done',
      'Reassign': 'Reassign',
      'Review': 'Review'
    };
    return statusMap[status] || 'Initiated';
  }

  // Filter surveys based on search input
  filterSurveys(event?: Event, statusFilter?: string | null, stageFilter?: string | null): void {
    if (event) {
      const input = event.target as HTMLInputElement;
      this.searchText = input.value.toLowerCase();
    }

    // Update filters if provided
    if (statusFilter !== undefined) {
      this.selectedStatus = statusFilter;
    }
    if (stageFilter !== undefined) {
      this.selectedStage = stageFilter;
    }
    // Apply all filters
    this.filteredSurveys = this.sortedSurveys.filter(s => {
      if (!s) return false; // Add null check
      // Name filter
      const nameMatch = this.searchText
        ? s.surveyName?.toLowerCase().includes(this.searchText) ?? false
        : true;

      // Status filter
      const statusMatch = this.selectedStatus
        ? s.surveyStatusName === this.selectedStatus
        : true;

      // Stage filter
      const stageMatch = this.selectedStage
        ? s.surveyStageName === this.selectedStage
        : true;

      return nameMatch && statusMatch && stageMatch;
    });
    this.totalRecords = this.filteredSurveys.length;
    this.first = 0;

    // const input = event.target as HTMLInputElement;
    // this.searchText = input.value.toLowerCase();
    // this.filteredSurveys = this.searchText
    //   ? this.sortedSurveys.filter(s => s.surveyName.toLowerCase().includes(this.searchText))
    //   : [];
    // this.totalRecords = this.filteredSurveys.length || this.surveyList.length;
    // this.first = 0;
  }

  get filteredSortedSurveys() {
    if (!this.searchText) return this.sortedSurveys;
    return this.sortedSurveys.filter(survey =>
      survey.surveyName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Check if survey is selected
  isSurveySelected(survey: any): boolean {
    return this.selectedSurveys.some(s => s.surveyId === survey.surveyId);
  }

  // Handle survey unselection
  onSurveyUnselect(event: any): void {
    const unselectedSurvey = event.data;
    const index = this.surveyList.findIndex(s => s.surveyId === unselectedSurvey.surveyId);
    if (index !== -1) {
      this.surveyList[index].userId = null;
    }
  }

  // Save assignments
  assignSurveys(): void {
    console.log(this.surveyList);
    const userId = this.apiService.getUserId();
    const assignments = this.surveyList
      .filter(s => this.selectedSurveys.some(sel => sel.surveyId === s.surveyId))
      .map(s => ({
        publicId: s.publicId,
        userId: s.selectedUserId,
        // statusId: s.statusId
      }));

    if (assignments.length === 0) {
      this.toastr.warning('No assignments to save', 'Warning');
      return;
    }

    this.isLoading = true;
    this.apiService.createAssignsurveyArea(assignments).subscribe({
      next: () => {
        this.toastr.success('Survey assigned successfully', 'Success');
        // this.surveyAreaRefresh.emit();
        this.closeDialog();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Something went wrong';
        this.toastr.error(errorMsg, 'Error');
        this.isLoading = false;
      }
    });
  }

  // Close the dialog
  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.searchText = '';
    this.filteredSurveys = [];
    this.selectedSurveys = [];
    this.isLoading = false;
  }

  // Handle page change
  onPageChange(event: any): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }
  canSave(): any {
    // No surveys selected
    if (this.selectedSurveys.length === 0) {
      return false;
    }

    // Check if all selected surveys have a user assigned
    // if (this.apiService.getRoleName() === 'Admin') {
    //   return this.selectedSurveys.every(selectedSurvey => {
    //     const survey = this.surveyList.find(s => s.surveyId === selectedSurvey.surveyId);
    //     return survey && survey.userId &&
    //       (survey.surveyStatusName === 'Initiated' || survey.surveyStatusName === 'Assigned');
    //   });

    if (this.apiService.getRoleName() === 'Admin') {
      return this.selectedSurveys.every(selectedSurvey => {
        const survey = this.surveyList.find(s => s.surveyId === selectedSurvey.surveyId);
        // Check if survey exists AND has a selected user (using selectedUserId)
        return survey && survey.selectedUserId;
      });


    } else {
      return this.selectedSurveys.every(selectedSurvey => {
        const survey = this.surveyList.find(s => s.surveyId === selectedSurvey.surveyId);
        return survey && survey.surveyStatusName !== 'Completed';
      });
    }
  }
  // In SurveyAssignmentDialogComponent class
onUserSelectionChange(survey: any): void {
  if (!survey.selectedUserId || !survey.publicId) {
    return;
  }
  // Call the validation API
  this.apiService.getValidateUserLocation(
    survey.selectedUserId,
    survey.publicId,
    Number(this.apiService.getMvnoId())
  ).subscribe({
    next: (res: any) => {
      if (res.success) {
        // User is allowed, do nothing (allow assignment)
      } else {
        // Not allowed, show error and reset selection
        this.toastr.error('This user does not have permission for the selected survey area. Please select another user.', 'Permission Denied');
        survey.selectedUserId = null;
      }
    },
    error: () => {
      this.toastr.error('Failed to validate user permission for this survey area.', 'Error');
      survey.selectedUserId = null;
    }
  });
}

  onSurveyInProgress(survey: any): void {
    if (!survey?.publicId || !survey?.userId) {
      this.toastr.warning('Invalid survey or user ID', 'Warning');
      return;
    }

    const currentStatus = survey.surveyStatusName;
    console.log(currentStatus);

    let newStatus = '';
    if (currentStatus === 'Assigned') {
      newStatus = 'In progress';
      const payload = {
        userId: survey.userId,
        surveyStatusName: newStatus,
        publicId: survey.publicId,
        mvnoId: this.apiService.getMvnoId()
      };
      this.apiService.updateSurveyStatus(survey.publicId, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(`Survey status changed from ${currentStatus} to "${newStatus}"`, 'Sucess');
          this.isLoading = false;
          this.loadData();
          this.closeDialog();
          this.surveyStatusUpdated.emit();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to update survey status', 'Error');
          this.isLoading = false;
        }
      });
    } else if (currentStatus === 'In progress') {
      newStatus = 'Review'; // Skip "Completed" as per your requirement
      this.apiService.getSurveyCreatedUser(survey.surveyId)
        .subscribe({
          next: (res: any) => {
            if (res.success && res.data) {
              const assignedUser = res.data.userName;
              const assignedUserId = res.data.staffId;
              this.showConfirmationDialog(assignedUser, survey, newStatus,assignedUserId);
            } else {
              this.toastr.error('No user data found', 'Error');
            }
          },
          error: (err) => {
            this.toastr.error('Failed to fetch assigned user', 'Error');
          }
        });
    } else if (currentStatus === 'Review') {
      // Handle Review → Approved/Rejected
      this.confirmationService.confirm({
        message: 'Approve or reject this survey?',
        header: 'Final Review',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Approve',
        rejectLabel: 'Reject',
        accept: () => {
          newStatus = 'Approved';
          const payload = {
            userId: survey.userId,
            surveyStatusName: newStatus,
            publicId: survey.publicId,
            mvnoId: this.apiService.getMvnoId()
          };
          this.apiService.updateSurveyStatus(survey.publicId, payload).subscribe({
            next: () => {
              this.toastr.success('Survey approved!', 'Success');
              this.updateSurveyStatus.emit({
                selectedStage: newStatus,
                isSurveyShow: true
              });
              this.isLoading = false;
              this.closeDialog();
              this.surveyStatusUpdated.emit();
              this.loadData();
            },
            error: (err) => {
              this.toastr.error('Failed to approve survey', 'Error');
            }
          });
        },
        reject: () => {
          newStatus = 'Rejected';
          const payload = {
            userId: survey.userId,
            surveyStatusName: newStatus,
            publicId: survey.publicId,
            mvnoId: this.apiService.getMvnoId()
          };
          this.apiService.updateSurveyStatus(survey.publicId, payload).subscribe({
            next: () => {
              this.toastr.warning('Survey rejected', 'Warning');
              this.updateSurveyStatus.emit({
                selectedStage: newStatus,
                isSurveyShow: true
              });
              this.isLoading = false;
              this.closeDialog();
              this.surveyStatusUpdated.emit();
              this.loadData();
            },
            error: (err) => {
              this.toastr.error('Failed to reject survey', 'Error');
            }
          });
        }
      });
    } else if (currentStatus === 'Done') {
      this.toastr.info('Survey is already done', 'Info');
      return;
    } else {
      newStatus = 'In progress'; // Default start status
    }
    // this.updateSurveyNewStatus(survey, newStatus);
    this.updateSurveyStatus.emit({ selectedStage: newStatus, isSurveyShow: true });  // ✅ Correct: Using .emit()
  }

  private showConfirmationDialog(assignedUser: string, survey: any, newStatus: string, assignedUserId: string): void {
  this.confirmationService.confirm({
    message: `Are you sure you want to change the status to "${newStatus}"? This survey will be reassigned to ${assignedUser}.`,
    header: 'Confirm Status Change',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // Build the array payload as required by createAssignsurveyArea
      const payload = [
        {
          publicId: survey.publicId,
          userId: assignedUserId // or survey.selectedUserId if that's the correct property
        }
      ];
      this.apiService.createAssignsurveyArea(payload).subscribe({
        next: () => {
          this.toastr.success(`Survey status changed from In Progress to "${newStatus}" successfully!, And Assigned back to owner`, 'Success');
          this.updateSurveyStatus.emit({
            selectedStage: newStatus,
            isSurveyShow: true
          });
          this.isLoading = false;
          this.loadData();
          this.closeDialog();
          this.surveyStatusUpdated.emit();
        },
        error: (err) => {
          this.toastr.error('Failed to update status', 'Error');
          console.error('API Error:', err);
        }
      });
    },
    reject: () => {
      this.toastr.info('Status update cancelled','Cancel');
      this.isLoading = false;
      this.loadData();
      this.closeDialog();
      this.surveyStatusUpdated.emit();
    }
  });
}
  private updateSurveyNewStatus(survey: any, newStatus: string): void {
    const payload = {
      userId: survey.userId,
      surveyStatusName: newStatus,
      publicId: survey.publicId,
      mvnoId: this.apiService.getMvnoId()
    };

    if (survey.surveyStatusName == 'Initiated' || survey.surveyStatusName == 'In progress' || survey.surveyStatusName == 'Review') {
      this.apiService.updateSurveyStatus(survey.publicId, payload).subscribe({
        next: (res: any) => {
          this.toastr.success(`Survey marked as ${newStatus}`, 'Success');
          this.isLoading = false;
          this.loadData();
          this.closeDialog();
          this.surveyStatusUpdated.emit();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to update survey status', 'Error');
          this.isLoading = false;
        }
      });
    }

  }
  // for seprate status survey  
  onSurveySelect(event: any): void {
    const selectedSurvey = event.data;
    // Reset userId when survey is selected (if Admin)
    if (this.apiService.getRoleName() === 'Admin') {
      selectedSurvey.userId = null;
    }
    this.cdr.detectChanges();
  }

  get sortedSurveys() {
    return [...this.surveyList].sort((a, b) => {
      const aStatus = a.surveyStatusName as SurveyStatus;
      const bStatus = b.surveyStatusName as SurveyStatus;
      return this.statusOrder[aStatus] - this.statusOrder[bStatus] ||
        a.surveyName.localeCompare(b.surveyName);
    });
  }

  showStatusHeader(index: number): boolean {
    const surveys = this.filteredSurveys.length ? this.filteredSurveys : this.sortedSurveys;
    return index === 0 || surveys[index].surveyStatusName !== surveys[index - 1].surveyStatusName;
  }

  isCheckboxDisabled(survey: any): boolean {
    if (this.apiService.getRoleName() === 'Admin') {
      // Admin can only check Initiated and Assigned surveys
      return survey.surveyStatusName !== 'Initiated' && survey.surveyStatusName !== 'Assigned';
    } else {
      // User can't check Completed surveys
      return survey.surveyStatusName === 'Done';
    }
  }

  canSelectSurvey(survey: any): boolean {
    if (this.apiService.getRoleName() === 'Admin') {
      return survey.surveyStatusName === 'Initiated' || survey.surveyStatusName === 'Assigned';
    }
    return survey.surveyStatusName !== 'Done';
  }

onAdminReviewAction(survey: any): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to approve this survey? Once approved, no further changes can be made.',
    header: 'Review Survey',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Approve',
    rejectLabel: 'Reject',
    accept: () => this.updateSurveyStatusAndStage(survey, 'Approved'),
    reject: () => {
      // Instead of prompt, show PrimeNG dialog
      this.selectedSurveyForRejection = survey;
      this.rejectionReason = '';
      this.isRejectDialogVisible = true;
    }
  });
}

submitRejection(): void {
  if (!this.rejectionReason.trim()) {
    this.toastr.warning('Rejection reason is required.','Reject Survey');
    return;
  }

  this.updateSurveyStatusAndStage(
    this.selectedSurveyForRejection,
    'Rejected',
    this.rejectionReason.trim()
  );

  this.isRejectDialogVisible = false;
}


private updateSurveyStatusAndStage(survey: any, newStatus: string, reasonForRejection: string = ''): void {
  const mvn = this.apiService.getMvnoId();
  
  const payload = {
    userId: survey.selectedUserId,
    status: newStatus,
    currentStage: survey.surveyStageName,
    mvnoId: Number(mvn),
    publicId: survey.publicId,
    reasonForRejection: newStatus === 'Rejected' ? reasonForRejection : ''
  };

  this.isLoading = true;
  this.apiService.updateStatusAndStage(survey.publicId, payload).subscribe({
    next: () => {
      this.toastr.success(`Survey ${newStatus.toLowerCase()} successfully!`, 'Success');
      this.updateSurveyStatus.emit({
        selectedStage: newStatus,
        isSurveyShow: true,
      });
      this.isLoading = false;
      this.closeDialog();
      this.surveyStatusUpdated.emit();
      this.loadData(); // Refresh the data
    },
    error: (err) => {
      this.toastr.error(`Failed to ${newStatus.toLowerCase()} survey`, 'Error');
      console.error('API Error:', err);
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

}