import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { TITLE, FOOTER } from "../app/RadiusUtils/RadiusConstants";
import * as configData from "src/assets/config.json";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    standalone: false
})
export class AppComponent implements OnInit {
  config!: { version: string };
  title = "KeyannaGui";
  
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private titleService: Title
  ) {
    router.events.subscribe((event) => {
      const routerEvent = event as RouterEvent;
      if (routerEvent instanceof RouteConfigLoadStart) {
        this.spinner.show();
      } else if (routerEvent instanceof RouteConfigLoadEnd) {
        this.spinner.hide();
      }
    });
    
  }
  ngOnInit(): void {
    this.titleService.setTitle(TITLE);
    this.config = configData; // Assign the imported config
    // console.log(this.config.version);
    const headers = new HttpHeaders()
    .set("Cache-Control", "no-cache")
    .set("Pragma", "no-cache");

  this.http.get<{ version: string }>("/assets/config.json", { headers }).subscribe((config) => {
    if (config.version !== this.config.version) {
      this.http.get("", { headers, responseType: "text" }).subscribe(() => location.reload());
    }
  });
  }
}
