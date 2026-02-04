import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Utils {
  constructor(private confirmationService: ConfirmationService) {}

  canExit(form:FormGroup) {
    console.log(form);
    if (!form) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          },
        });
        return false;
      });
    }
  }
}
