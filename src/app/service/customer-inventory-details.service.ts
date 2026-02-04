import { Injectable } from "@angular/core";
declare var $: any;
@Injectable({
  providedIn: "root",
})
export class CustomerInventoryDetailsService {
  constructor() {}
  show(id: string) {
    // open modal specified by id
    $("#" + id).modal("show");
  }

  hide(id: string) {
    // close modal specified by id
    $("#" + id).modal("hide");
  }
}
