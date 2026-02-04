import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../RadiusUtils/CommonConstant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  userId = localStorage.getItem('userId');
  mvnoId = localStorage.getItem('mvnoId');
  roleName = localStorage.getItem('roleName');
  isAdmin: boolean = false;

  getRoleName(): string | null {
    return localStorage.getItem('roleName');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getMvnoId() {
    return localStorage.getItem('mvnoId');
  }

  // get isAdmin(): boolean {
  //  return localStorage.getItem('roleName') === 'Admin';
  // }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.status === 400) {
        errorMessage = 'Bad Request: Please check your input data';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal Server Error';
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  constructor(private http: HttpClient) {
  }

  // customer create
  createCustomer(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CUSTOMER}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // FDP create
  createFdp(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDP}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // FAT create
  createFat(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FAT}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // FDT create
  createFdt(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDT}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // OLT create
  createOlt(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.OLT}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // JOINT create
  createJointClosure(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.JOINT_CLOSURE}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // pole create
  createPole(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POLE}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // MANHOLE create
  createManhole(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.MANHOLE}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // HANDHOLE create
  createHandhole(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.HANDHOLE}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // cable create
  createCable(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CABLE}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // trench create
  createTrench(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.TRENCH}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // duct create
  createDuct(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.DUCT}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // street create
  createStreet(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.STREET}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // building create
  createBuilding(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.BUILDING}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  //Create building with img
  createBuildingWithImg(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.BUILDING}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  //Create sdu with img
  createSduWithImg(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SDU}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  //Create cdu with img
  createCduWithImg(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CDU}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // Create mdu with img
  createMduWithImg(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.MDU}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  createPoleWithImg(data: FormData) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POLE}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  createFatWithImg(data: FormData) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FAT}/createWithImage`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // splitter create
  createSplitter(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // POP create
  createPOP(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POP}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // FDC create
  createFDC(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDC}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // surveyArea create
  createSurveyArea(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_AREA}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  //surveyarea asign mapping
  createAssignsurveyArea(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_USER_MAPPING}/create`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  //get buiding data seurveyarea
  getAllSurveyArea() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.BUILDING}/getDataInSurveyArea`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // get cable specification 
  getAllCableSpecifications() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CABLE_SPECIFICATION}/getAllCableSpecifications`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  //get All buildings
  getAllBuildings() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.BUILDING}/getAllBuildings`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }


  // get customer 
  getCustomers() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CUSTOMER}/getAllCustomers`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }


  // get cable specification 
  getAllPops() {
    const params = new HttpParams().set('withGeometry', 'true');

    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POP}/getAllPops`, { params })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }


  // get cable specification 
  getAllFats() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FAT}/getAllFats`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // get cable specification 
  getAllCables() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CABLE}/getAllCables`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // get Fdp Type
  getFdpTypes() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/v1/GisCore/${API_ENDPOINTS.FDP_TYPE}/getAllLookupFdps`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // get cable specification 
  getAllSplitterSpecification() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER_SPECIFICATION}/getAllSplitterSpecifications`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getParentLayerByCode(code: string) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.LAYER_MAPPING}/parent-layers-by-code/${code}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  } 

  getAllFdcs() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDC}/getAllFdcs`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // get cable type
  getAllCableType() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.LOOKUP_CABLE}/getAllLookupCables`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // get surveyArea Status
  getsurveyStatus() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_STATUS}/getAllLookupSurveyStatus/`+ 2)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // get surveyAreaname 
  getsurveyName() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_AREA}/getAllPlanned`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  // get assign userName
  getassignuserName() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getStaffDetails/${this.getMvnoId()}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
  //get country border
  getCountryBorder() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.ADM_00}/getAllAdm00/KE`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }
  //get counties 
  getCounties() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.ADM_01}/getAllAdm01/KE`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }
  //get Districts
  getDistricts() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.ADM_02}/getAllAdm02/KE`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }
  //get accessory list pole dyanamic remain
  // http://164.52.212.187:30080/api/v1/KeyannaInventoryManagement/specificationParameters/getSpecificParametersByProductCategoryId?product_category_id=14
  getAccessoiesListPole() {
    return this.http.get(`${API_ENDPOINTS.INVENTORY_API_URL}/specificationParameters/getSpecificParametersByProductCategoryId?product_category_id=14`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }
  //get accessory list fat dyanamic remain
  getAccessoiesListFat() {
    return this.http.get(`${API_ENDPOINTS.INVENTORY_API_URL}/${API_ENDPOINTS.PRODUCT_CATEGORY}/2`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }
  //get accessory list building dyanamic remain
  getAccessoiesListBuilding() {
    return this.http.get(`${API_ENDPOINTS.INVENTORY_API_URL}/${API_ENDPOINTS.PRODUCT_CATEGORY}/3`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }

  findNearByGeom(data: any) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/findNearByGeom`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getNetworkElementData(payload: { publicId: string, layerName: string }) {
    return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getNetworkElementDataById`, payload)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getBuildings() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.BUILDING}/get/getAllBuildings`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getsurveyArea(userId: any, mvnoId: any) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_AREA}/getByUserId/${userId}/${mvnoId}/${this.isAdmin}`)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of({ success: false, data: [] }); // Return empty array on error
        })
      );
  }

  // for get single survey
getSurvey(publicId: any) {
  return this.http.get(
    `${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/getById/${publicId}/${this.getMvnoId()}`,
    // { params: { mvnoId: this.getMvnoId() } }
  ).pipe(
    catchError(error => {
      console.error('API Error:', error);
      return of({ success: false, data: [] });
    })
  );
}

getAllSurveys(): Observable<any> {
  return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/getAllSurveys/${this.getMvnoId()}`)
    .pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
}

  getsurveyAreaByUser(surveyAreaId: any) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getDataInSurveyArea/${surveyAreaId}/${this.getMvnoId()}`)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of({ success: false, data: [] }); // Return empty array on error
        })
      );
  }
  // get survey data for digitalization
  getSurveyDataForDigitalization(surveyAreaId: any) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getSurveyDataForDigitalization/${surveyAreaId}/${this.getMvnoId()}`)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of({ success: false, data: [] }); // Return empty array on error
        })
      );
  }

  // get validate user location
  getValidateUserLocation(userId: number, surveyAreaPublicId: string, mvnoId: number) {
    const params = new HttpParams()
      .set('userId', userId)
      .set('surveyAreaPublicId', surveyAreaPublicId)
      .set('mvnoId', mvnoId);

    return this.http.get(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/area/validateUserLocation`,
      { params }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAllAreasForUser(userId: number, mvnoId: number) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/area/get-all-areas`,
      { userId, mvnoId }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  exportBomExcel(surveyAreaId: number) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getDataInSurveyAreaBom/${surveyAreaId}`, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of(new Blob()); // Return empty Blob on error
        })
      );
  }

  exportDigitalizeExcel(surveyAreaId: number) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/getDetailDataInExcel/${surveyAreaId}`, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of(new Blob()); // Return empty Blob on error
        })
      );
  }

  getProductCategoryByName(name: string) {
    return this.http.get(`${API_ENDPOINTS.INVENTORY_API_URL}/productCategory/name/${name}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getFeatureByPublicId(publicId: any, layerType: any) {
    // Map layerType to the correct API_ENDPOINTS key
    const endpointKeyMap: any = {
      'building': API_ENDPOINTS.BUILDING,
      'pole': API_ENDPOINTS.POLE,
      'fat': API_ENDPOINTS.FAT,
      'fdt': API_ENDPOINTS.FDT,
      '8m poles': API_ENDPOINTS.POLE,
      '10m poles': API_ENDPOINTS.POLE,
      '12m poles': API_ENDPOINTS.POLE,
      'sdu': API_ENDPOINTS.SDU,
      'mdu': API_ENDPOINTS.MDU,
      'cdu': API_ENDPOINTS.CDU,
      'olt': API_ENDPOINTS.OLT,
      'cable': API_ENDPOINTS.CABLE,
      'splitter': API_ENDPOINTS.SPLITTER,
      'jointclosure': API_ENDPOINTS.JOINT_CLOSURE
    };

    const endpointKey = endpointKeyMap[layerType?.toLowerCase()];
    if (!endpointKey) {
      throw new Error(`Invalid layerType: ${layerType}`);
    }

    return this.http.get(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${endpointKey}/getByPublicId/${publicId}/${this.getMvnoId()}`
    );
  }
  
  getAvailableSplitterPorts(splitterId: number) {
  return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER}/available-ports?splitterId=${splitterId}&mvnoId=${this.getMvnoId()}`)
    .pipe(catchError(this.handleError.bind(this)));
  }

  getNearbySdus(splitterId: number, surveyAreaId: number) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER}/nearby-sdus?splitterId=${splitterId}&surveyAreaId=${surveyAreaId}&mvnoId=${this.getMvnoId()}`)
    .pipe(catchError(this.handleError.bind(this)));
  }

  getNearbyNes(networkId: number, surveyAreaId: number, networkType: string) {
    return this.http.get(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/nearby-nes`,
      {
        params: {
          networkId,
          surveyAreaId,
          mvnoId: this.getMvnoId(),
          networkType
        }
      }
    ).pipe(
    catchError(this.handleError.bind(this))
    );
  }

  // splitter with SDU connection
  splitterWithSduConnection(params: {
    surveyAreaId: number;
    mvnoId: number;
    networkId: number;
    networkType: string;
    status: string;
    userId: number;
  }) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/connectivity/splitterWithSduConnection`,
      params // passed in the request body
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  splitterWithCduOrMduConnection(params: {
    surveyAreaId: number;
    mvnoId: number;
    networkId: number;
    networkType: string;
    status: string;
    userId: number;
  }) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/connectivity/splitterWithCduOrMduConnection`,
      params // passed in the request body
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getCduHomePassesByCduId(cduId: string | number) {
    return this.http.get(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/cduHomePassesMapping/getAllByCduId/${cduId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getMduHomePassesByMduId(mduId: string | number) {
    return this.http.get(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/mduHomePassesMapping/getAllByMduId/${mduId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAllPoles() {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POLE}/getAll`);
  }

  updatePop(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POP}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateFdp(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDP}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateSurveyStatus(publicId: any, payload: any) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/updateStatus/${publicId}`, payload).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateSurveyArea(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_AREA}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateFat(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FAT}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateFdt(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDT}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateJointClosure(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.JOINT_CLOSURE}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updatePole(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POLE}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateSdu(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SDU}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateMdu(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.MDU}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateCdu(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CDU}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateSduWithImg(publicId: string, formData: FormData) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SDU}/update/${publicId}`,
      formData
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateMduWithImg(publicId: string, formData: FormData) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.MDU}/update/${publicId}`,
      formData
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateCduWithImg(publicId: string, formData: FormData) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CDU}/update/${publicId}`,
      formData
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  

  updateSplitter(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER}/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

   updateOlt(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/olt/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }

    updateCable(publicId: string, data: any) {
    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/cable/update/${publicId}`, data).pipe(
        catchError(this.handleError.bind(this))
      );
  }




  // delete survey
  deleteSurvey(publicId: any) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SURVEY_AREA}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`).pipe(
        catchError(this.handleError.bind(this))
      );
  }

  //delete fat
  deleteFat(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FAT}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    )
  }
  //delete sdu
  deleteSdu(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SDU}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  //delete mdu
  deleteMdu(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.MDU}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  //delete cdu
  deleteCdu(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.CDU}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  // delete pole
  deletePole(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.POLE}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  // delete fdt
  deleteFdt(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.FDT}/delete/${publicId}/${this.getMvnoId()}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  // delete olt
  deleteOlt(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.OLT}/delete/${publicId}/${this.getMvnoId()}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
  // delete splitter
  deleteSplitter(publicId: string) {
    return this.http.delete(  
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.SPLITTER}/delete/${publicId}/${this.getMvnoId()}/${this.userId}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteJointClosure(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.JOINT_CLOSURE}/delete/${publicId}/${this.getMvnoId()}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  
  deleteCable(publicId: string) {
    return this.http.delete(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/cable/delete/${publicId}/${this.getMvnoId()}`
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }



  getSurveyAreasByStage(userId: string, mvnoId: string, stageName: string) {
    const url = `GisCore/surveyArea/getByUserIdAndStage/${userId}/${mvnoId}/${stageName}`;
    return this.http.get(url);
  }

  getSurveyCreatedUser(surveyAreaId: any) {
    return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/getSurveyCreatedUser/${surveyAreaId}/${this.getMvnoId()}`);
    // return this.http.get(`${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/getSurveyCreatedUser/${surveyAreaId}/4`);
  }

  updateStatusAndStage(publicId: any, params: any) {
    // Build HttpParams from the params object
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.put(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/surveyArea/updateStatusAndStage/${publicId}`,
      {}, // empty body
      { params: httpParams }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // for connectivity
    getNearbyAllNes(payload: { layerId: number, layerCode: string, surveyAreaId: number, mvnoId: any }) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/${API_ENDPOINTS.COMMON}/nearby-all-nes`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }
    fromNetworkPort(payload: { layerId: number, layerCode: string}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/networkPort/ports/available-ports`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

    toNetworkPort(payload: { layerId: number, layerCode: string}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/networkPort/ports/available-ports`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

    connectivityCableCores(payload: { cableId: number, mvnoId: any}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/cableCore/get-cable-cores`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

   createConnectivity(payload:any) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/connectivity/createConnectivity`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  getNearBycableForConnectivity(payload:any) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/cable/near-by-cables`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

   viewElementData(payload: { publicId: number, mvnoId: any}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/olt/getByPublicId/}`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  // /api/v1/GisCore/olt/ports/all-ports

 oltNetworkPort(payload: { layerId: number, layerCode: string}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/olt/ports/all-ports`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }


   fdtNetworkPort(payload: { layerId: number, layerCode: string}) {
    return this.http.post(
      `${environment.KEYANNA_API_GIS_CORE_PORT}/fdt/ports/all-ports`,
      payload
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  getNearbyElements(payload: any): Observable<any> {
  return this.http.post(`${environment.KEYANNA_API_GIS_CORE_PORT}/common/getNearbyMultipleElements`, payload);
}



}
