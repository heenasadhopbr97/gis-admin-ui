import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-survey-stage',
  standalone: false,
  templateUrl: './survey-stage.component.html',
  styleUrl: './survey-stage.component.css'
})
export class SurveyStageComponent {

  selectedStage = '';
  surveyData: any[] = [];
  filteredSurveyData: any[] = [];
  isSurveyShow = false;
  @Input() visible: boolean = true;
  @Output() stageChanged = new EventEmitter<{ selectedStage: string, isSurveyShow: boolean }>();
  @Output() surveySelected = new EventEmitter<any>();
  @Output() multiSurveySelected = new EventEmitter<any[]>();

  selectedSurveyIds: { [id: number]: boolean } = {};

  // for stages
  stagesOptions = [
    { value: 'survey', label: 'Survey' },
    { value: 'digitalization', label: 'Digitalization' },
    { value: 'design', label: 'Design' },
    { value: 'bom', label: 'BOM' }
  ];

  surveySearchTerm: string = '';
  filteredSurveyAreas: any[] = [];
  showDetailPopup = false;
  selectedSurveyDetail: any = null;
  isLoadingDetail = false;
  errorMessage: string | null = null;

  showImagePopup = false;
currentImages: string[] = [];
currentImageIndex = 0;
currentElementName = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadSurveyData();
  }

  onSurveySelect(survey: any) {
    console.log(survey);
    this.surveySelected.emit(survey);
  }
onSurveyCheckboxChange(survey: any) {
  // Build an array of all selected surveys
  const selected = this.filteredSurveyData.filter(s => this.selectedSurveyIds[s.id]);
  this.multiSurveySelected.emit(selected);

  // Optionally zoom to the last checked survey
  if (this.selectedSurveyIds[survey.id]) {
    this.surveySelected.emit(survey);
  }
}
  onStageChange() {
    this.filterSurveyDataByStage();
    this.stageChanged.emit({
      selectedStage: this.selectedStage,
      isSurveyShow: this.isSurveyShow
    });
    this.isSurveyShow = !!this.selectedStage;

    this.selectedSurveyIds = {};
    this.multiSurveySelected.emit([]);
  }

  onViewDetails(survey: any, event: Event) {
    event.stopPropagation();
    this.isLoadingDetail = true;
    this.showDetailPopup = true;
    this.errorMessage = null;

    this.apiService.getsurveyAreaByUser(survey.id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.selectedSurveyDetail = response.data;
          console.log("selectedSurveyDetail", this.selectedSurveyDetail);
        } else {
          this.errorMessage = response.message || 'Failed to load survey details';
          // Fallback to basic info
          this.selectedSurveyDetail = {
            name: survey.name,
            surveyStatusName: survey.surveyStatusName,
            surveyStageName: survey.surveyStageName
          };
        }
      },
      error: (error: any) => {
        console.error('Error loading survey details:', error);
        this.errorMessage = 'Failed to load survey details';
        // Show basic info if API fails
        this.selectedSurveyDetail = {
          name: survey.name,
          surveyStatusName: survey.surveyStatusName,
          surveyStageName: survey.surveyStageName
        };
      },
      complete: () => {
        this.isLoadingDetail = false;
      }
    });
  }

  hasElements(detail: any): boolean {
    if (!detail) return false;

    // List of all possible element types in the API response
    const elementTypes = [
      'sdu', 'mdu', 'cdu', 'pole', 'duct', 'splitter', 'pop',
      'handhole', 'manhole', 'olt', 'fdt', 'fat', 'jointclosure',
      'cable', 'connections', 'customer', 'trench', 'fdp', 'odf',
      '8m', '10m', '12m' // Add any other element types from your API
    ];

    return elementTypes.some(type =>
      detail[type] && Array.isArray(detail[type]) && detail[type].length > 0
    );
  }

  getElementKeys(detail: any): string[] {
    if (!detail) return [];

    return Object.keys(detail).filter(key =>
      key !== 'survey_area' &&
      key !== 'success' &&
      key !== 'message' &&
      Array.isArray(detail[key])
    );
  }


  closeDetailPopup() {
    this.showDetailPopup = false;
    this.selectedSurveyDetail = null;
  }


  filterSurveyAreas() {
    if (!this.surveySearchTerm) {
      this.filteredSurveyData = [...this.surveyData];
    } else {
      const searchTerm = this.surveySearchTerm.toLowerCase();
      this.filteredSurveyData = this.surveyData.filter(area =>
        area.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  loadSurveyData() {
    const userId = this.apiService.getUserId();
    const mvnoId = this.apiService.getMvnoId();
    this.apiService.getsurveyArea(userId, mvnoId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.surveyData = response.data;
          this.filterSurveyDataByStage(); // Filter data based on initial stage
        }
      },
      error: (error: any) => {
        console.error('Error loading survey data:', error);
      }
    });

  }

  loadDesignData() { }
  loadDigitalizationData() { }

  filterSurveyDataByStage() {
    if (this.selectedStage === 'survey') {
      this.filteredSurveyData = this.surveyData.filter(item =>
        item.surveyStageName.toLowerCase() === 'survey'
      );
      this.isSurveyShow = false;
    } else if (this.selectedStage === 'design') {
      this.filteredSurveyData = this.surveyData.filter(item =>
        item.surveyStageName.toLowerCase() === 'design'
      );
      this.isSurveyShow = false;
    } else if (this.selectedStage === 'digitalization') {
      this.filteredSurveyData = this.surveyData.filter(item =>
        item.surveyStageName.toLowerCase() === 'digitalization'
      );
      this.isSurveyShow = true;
    } else if (this.selectedStage === 'bom') {
      this.filteredSurveyData = this.surveyData.filter(item =>
        item.surveyStageName.toLowerCase() === 'bom'
      );
      this.isSurveyShow = true;
    }
    //     if (this.filteredSurveyData.length > 0) {
    //   this.onSurveySelect(this.filteredSurveyData[0]); // Auto-select first survey
    // }
  }

  clearStage() {
    this.selectedStage = '';
    this.isSurveyShow = false;
  }

  formatDate(dateValue: any): string {
    if (!dateValue || dateValue === 'null') return 'Not set';

    // If it's already a string representation
    if (typeof dateValue === 'string' && dateValue !== 'null') {
      return dateValue;
    }

    // If it's an array [year, month, day]
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      const year = dateValue[0];
      const month = dateValue[1];
      const day = dateValue[2];

      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }

    return 'Not set';
  }

  
showEditModal = false;
showDeleteModal = false;
editingElement: any = null;
editingElementType: string = '';
deletingElement: any = null;
deletingElementType: string = '';
// Edit element method
onEditElement(element: any, elementType: string) {
  this.editingElement = {...element}; // Create a copy to avoid direct mutation
  this.editingElementType = elementType;
  this.showEditModal = true;
}

// Delete element method
onDeleteElement(element: any, elementType: string) {
  this.deletingElement = element;
  this.deletingElementType = elementType;
  this.showDeleteModal = true;
}

// Save edited element
onSaveElement() {
  if (this.editingElement && this.editingElementType) {
    // Call the appropriate API based on element type
    this.updateElementBasedOnType();
  }
}

// Handle update error
handleUpdateError(error: any) {
  console.error('Error updating element:', error);
  this.showErrorMessage('Error updating element');
}

// Confirm delete
confirmDelete() {
  if (this.deletingElement && this.deletingElementType) {
    this.deleteElementBasedOnType();
  }
}

// Delete element based on type with specific API calls
deleteElementBasedOnType() {
  const publicId = this.deletingElement.publicId;
  
  switch (this.deletingElementType) {
    case 'fat':
      this.apiService.deleteFat(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'fdt':
      this.apiService.deleteFdt(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'jointclosure':
      this.apiService.deleteJointClosure(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'pole':
      this.apiService.deletePole(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'sdu':
      this.apiService.deleteSdu(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'mdu':
      this.apiService.deleteMdu(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'cdu':
      this.apiService.deleteCdu(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'olt':
      this.apiService.deleteOlt(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'splitter':
      this.apiService.deleteSplitter(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    case 'cable':
      this.apiService.deleteCable(publicId).subscribe({
        next: (response: any) => this.handleDeleteResponse(response),
        error: (error: any) => this.handleDeleteError(error)
      });
      break;
      
    // Add cases for other element types as needed
    default:
      console.error('Unsupported element type:', this.deletingElementType);
      this.showErrorMessage('Unsupported element type');
      break;
  }
}

// Handle delete response
handleDeleteResponse(response: any) {
  if (response.success) {
    console.log('Element deleted successfully');
    this.showSuccessMessage('Element deleted successfully');
    
    // Remove the element from the local array
    const elements = this.selectedSurveyDetail[this.deletingElementType];
    const index = elements.findIndex((el: any) => el.publicId === this.deletingElement.publicId);
    
    if (index !== -1) {
      elements.splice(index, 1);
    }
    
    this.closeDeleteModal();
  } else {
    console.error('Failed to delete element:', response.message);
    this.showErrorMessage(response.message || 'Failed to delete element');
  }
}

// Handle delete error
handleDeleteError(error: any) {
  console.error('Error deleting element:', error);
  this.showErrorMessage('Error deleting element');
}

// Close modals
closeEditModal() {
  this.showEditModal = false;
  this.editingElement = null;
  this.editingElementType = '';
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.deletingElement = null;
  this.deletingElementType = '';
}

// Helper methods for showing messages
showSuccessMessage(message: string) {
  // Implement your success notification logic here
  console.log('Success:', message);
}

showErrorMessage(message: string) {
  // Implement your error notification logic here
  console.error('Error:', message);
}
updateElementBasedOnType() {
  const publicId = this.editingElement.publicId;
  console.log('Updating element type:', this.editingElementType);
  
  // Create a copy of the element data without unwanted properties
 const data = this.prepareDataForApi(this.editingElement, this.editingElementType);
  
  switch (this.editingElementType) {
    case 'fat':
      this.apiService.updateFat(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'fdt':
      this.apiService.updateFdt(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'jointclosure':
      this.apiService.updateJointClosure(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'pole':
      this.apiService.updatePole(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'sdu':
      this.apiService.updateSdu(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'mdu':
      this.apiService.updateMdu(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'cdu':
      this.apiService.updateCdu(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'olt':
      this.apiService.updateOlt(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'splitter':
      this.apiService.updateSplitter(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    case 'cable':
      this.apiService.updateCable(publicId, data).subscribe({
        next: (response: any) => this.handleUpdateResponse(response),
        error: (error: any) => this.handleUpdateError(error)
      });
      break;
      
    // Add other element types as needed
    default:
      console.error('Unsupported element type:', this.editingElementType);
      this.showErrorMessage('Unsupported element type');
      break;
  }
}

// Prepare data for API by removing unwanted properties
prepareDataForApi(element: any, elementType: string): any {
  switch (elementType) {
    case 'fat':
      return this.prepareFatData(element);
    
    // Add other element type preparations as needed
    default:
      // Default preparation for other element types
      const data = { ...element };
      delete data.publicId;
      delete data.elementType;
      delete data.layerName;
      return data;
  }
}

// Prepare FAT data according to the API specification
prepareFatData(element: any): any {
  // Extract coordinates from geom if available
  let longitude = 0;
  let latitude = 0;
  
  if (element.geom && element.geom.coordinates && element.geom.coordinates.length >= 2) {
    longitude = element.geom.coordinates[0];
    latitude = element.geom.coordinates[1];
  }
  
  // Create the FAT data structure according to the API specification
  const fatData: any = {
    name: element.name || '',
    capacity: element.capacity || 0,
    address: element.address || '',
    longitude: longitude,
    latitude: latitude,
    status: element.status || '',
    parentNeId: element.parentNeId || 0,
    parentNeType: element.parentNeType || '',
    mvnoId: element.mvnoId || 0,
    surveyAreaId: element.surveyAreaId || 0,
    remarks: element.remarks || '',
    powerLevels: element.powerLevels || 0,
    userId: element.userId || 0,
    inventoryList: element.inventoryList || []
  };
  
  // Remove any undefined or null values
  Object.keys(fatData).forEach(key => {
    if (fatData[key] === undefined || fatData[key] === null) {
      delete fatData[key];
    }
  });
  
  return fatData;
}

// Handle update response
handleUpdateResponse(response: any) {
  if (response.success) {
    console.log('Element updated successfully');
    this.showSuccessMessage('Element updated successfully');
    
    // Update the element in the local array
    const elements = this.selectedSurveyDetail[this.editingElementType];
    const index = elements.findIndex((el: any) => el.publicId === this.editingElement.publicId);
    
    if (index !== -1) {
      // Keep the original publicId and layerName when updating locally
      elements[index] = {
        ...this.editingElement,
        publicId: elements[index].publicId, // Keep original publicId
        layerName: elements[index].layerName // Keep original layerName
      };
    }
    
    this.closeEditModal();
  } else {
    console.error('Failed to update element:', response.message);
    this.showErrorMessage(response.message || 'Failed to update element');
  }
}

// Add these methods to your component class
openImagePopup(images: string | string[], elementName: string) {
  // Convert single image to array for consistency
  this.currentImages = Array.isArray(images) ? images : [images];
  this.currentImageIndex = 0;
  this.currentElementName = elementName;
  this.showImagePopup = true;
}

closeImagePopup() {
  this.showImagePopup = false;
  this.currentImages = [];
  this.currentImageIndex = 0;
}

nextImage() {
  if (this.currentImages.length > 1) {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
  }
}

prevImage() {
  if (this.currentImages.length > 1) {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.currentImages.length) % this.currentImages.length;
  }
}
setImageIndex(index: number) {
  this.currentImageIndex = index;
}


}
