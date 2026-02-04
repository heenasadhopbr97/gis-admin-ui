import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerService } from "src/app/service/customer.service";
import { StaffService } from "src/app/service/staff.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { ServiceAreaService } from "src/app/service/service-area.service";

declare var $: any;
declare const google: any;

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
  visible?: boolean;
  opacity?: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

@Component({
    selector: "app-all-service-area-polygon",
    templateUrl: "./all-service-area-polygon.component.html",
    styleUrls: ["./all-service-area-polygon.component.css"],
    standalone: false
})
export class AllServiceAreaPolygon implements OnInit {
  @Output() hideAllPolygonModel = new EventEmitter();

  isAllPolygoneModelShow: boolean = false;
  map: any;
  drawingManager: any;
  polygonMap!: google.maps.Polygon;
  lat = 23.16774596751141;
  lng = 72.39140613721185;
  zoom = 7;
  markers: marker[] = [];
location: any;

  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    public keyannaCommonBaseService: KeyannaCommonBaseService,
    private serviceAreaService: ServiceAreaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isAllPolygoneModelShow = true;
    this.showAllPolygons();
  }

  hidePolygonModel() {
    this.hideAllPolygonModel.emit();
  }

  onAllPolygonMapReady(map:any) {
    this.map = map;
    this.initDrawingManagerForAllPolygons(map);
  }

  initDrawingManagerForAllPolygons(map: any) {
    const options = {
      drawingControl: false,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
      polygonOptions: {
        draggable: false,
        editable: false,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    this.drawingManager.setDrawingMode(null);
    this.drawingManager.setOptions({
      drawingControl: false,
    });
  }

  drawAllPolygons(map:any, polygons:any) {
    this.isAllPolygoneModelShow = true;
    let polygonArray = [];

    map.setZoom(this.zoom);

    polygons.forEach((data:any) => {
      let paths = data.polygonData.map((point:any) => new google.maps.LatLng(point.lat, point.lng));

      const centroid = this.calculatePolygonCentroid(data.polygonData);
      this.markers.push({
        lat: centroid.lat,
        lng: centroid.lng,
        label: data.serviceAreaName,
      });

      if (data.type == "private") {
        this.polygonMap = new google.maps.Polygon({
          map: map,
          paths: paths,
          strokeColor: "#1e90ff",
          fillColor: "#1e90ff",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
      } else {
        this.polygonMap = new google.maps.Polygon({
          map: map,
          paths: paths,
          strokeColor: "#FF8C00",
          fillColor: "#FF8C00",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
      }

      this.polygonMap.setMap(map);

      polygonArray.push(this.polygonMap);

      this.lat = Number(data.polygonData[0].lat);
      this.lng = Number(data.polygonData[0].lng);
      this.zoom = 15;
    });
  }

  showAllPolygons() {
    this.isAllPolygoneModelShow = true;
    let url = "/polygone/getAllPolyGones";
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        let polygons = response.dataList;

        let polygonsWithData: { name: any; polygonData: any; type: any; serviceAreaName: any; }[] = [];
        polygons.forEach((data:any) => {
          polygonsWithData.push({
            name: data.serviceAreaId,
            polygonData: data.polyGoneDTOList,
            type: data.serviceAreaType,
            serviceAreaName: data.polyGoneDTOList[0].serviceAreaName,
          });
        });
        this.drawAllPolygons(this.map, polygonsWithData);
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.zoom = 18;
    this.markers = [];
    this.markers.push({
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
      draggable: false,
    });
  }

  calculatePolygonCentroid(paths: LatLng[]): LatLng {
    let centroidLat = 0;
    let centroidLng = 0;

    paths.forEach(point => {
      centroidLat += Number(point.lat);
      centroidLng += Number(point.lng);
    });

    return {
      lat: centroidLat / paths.length,
      lng: centroidLng / paths.length,
    };
  }
}
