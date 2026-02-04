import { Component, OnInit } from "@angular/core";
import { TITLE, FOOTER } from "../../RadiusUtils/RadiusConstants";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.css"],
    standalone: false
})
export class FooterComponent implements OnInit {
  constructor() {}
  footer = FOOTER;
  ngOnInit() {
    this.loadJsFile("../../../assets/scripts/keyanna-common.js");
    this.loadJsFile("../../../assets/vendor/jquery/jquery.min.js");
    // this.loadJsFile("../../../assets/vendor/bootstrap/js/bootstrap.js");
    this.loadJsFile("../../../assets/vendor/bootstrap/js/bootstrap.min.js");
    this.loadJsFile("../../../assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js");
    this.loadJsFile("../../../assets/vendor/jquery.easy-pie-chart/jquery.easypiechart.min.js");
    this.loadJsFile("../../../assets/vendor/chartist/js/chartist.min.js");
    // this.loadCssFile("../../../assets/vendor/bootstrap/css/bootstrap.min.css");
    // this.loadCssFile("../../../assets/vendor/font-awesome/css/font-awesome.min.css");
    // this.loadCssFile("../../../assets/vendor/linearicons/style.css");
    // this.loadCssFile("../../../assets/vendor/chartist/css/chartist-custom.css");
    // this.loadCssFile("../../../assets/css/main.css");
    // this.loadCssFile("../../../../styles.css");
  }
  public loadJsFile(url:any) {
    let node = document.createElement("script");
    node.src = url;
    node.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(node);
  }
  public loadCssFile(url:any) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}
